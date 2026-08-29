import { env } from "../config/env.js";

/*
|--------------------------------------------------------------------------
| Judge0 language IDs
|--------------------------------------------------------------------------
|
| These are the standard Judge0 language IDs we use.
|
*/

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50
};

/*
|--------------------------------------------------------------------------
| Judge0 status IDs
|--------------------------------------------------------------------------
*/

const STATUS = {
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR: 7,
  SYSTEM_ERROR: 8,
  INTERNAL_ERROR: 13,
  EXEC_FORMAT_ERROR: 14
};

/*
|--------------------------------------------------------------------------
| Headers
|--------------------------------------------------------------------------
*/

function getHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };

  /*
   * Some Judge0 deployments use X-Auth-Token.
   */

  if (env.judge0ApiKey) {
    headers["X-Auth-Token"] = env.judge0ApiKey;
  }

  /*
   * Some hosted providers use RapidAPI headers.
   */

  if (env.judge0ApiHost) {
    headers["X-RapidAPI-Host"] = env.judge0ApiHost;
  }

  return headers;
}

/*
|--------------------------------------------------------------------------
| Normalize URL
|--------------------------------------------------------------------------
*/

function judge0BaseUrl() {
  return String(env.judge0Url || "").replace(/\/+$/, "");
}

/*
|--------------------------------------------------------------------------
| Local development evaluator
|--------------------------------------------------------------------------
|
| This is ONLY used when Judge0 is not configured.
|
*/

function demoEvaluate(code, challenge) {
  const source = String(code || "").toLowerCase();

  const keywords = challenge.keywords || [];

  const matched = keywords.filter(keyword =>
    source.includes(
      String(keyword).toLowerCase()
    )
  );

  const required = Math.max(
    2,
    Math.ceil(keywords.length * 0.45)
  );

  const total =
    challenge.testCases?.length || 0;

  const passed =
    matched.length >= required
      ? total
      : Math.floor(total / 2);

  return {
    status:
      passed === total
        ? "Accepted"
        : "Wrong Answer",

    passed,
    total,

    executionTime: "demo",

    memory: null,

    stdout: null,

    stderr: null,

    compileOutput: null,

    demo: true
  };
}

/*
|--------------------------------------------------------------------------
| Submit code to Judge0
|--------------------------------------------------------------------------
*/

async function createSubmission({
  code,
  languageId,
  stdin,
  expectedOutput
}) {
  const url =
    `${judge0BaseUrl()}` +
    `/submissions/?base64_encoded=false&wait=true`;

  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(),

    body: JSON.stringify({
      source_code: code,

      language_id: languageId,

      stdin: stdin || "",

      expected_output:
        expectedOutput || "",

      /*
       * Safety limits.
       *
       * These limits are also controlled by
       * the Judge0 instance configuration.
       */

      cpu_time_limit: 2,

      wall_time_limit: 5,

      memory_limit: 128000
    })
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Judge0 returned invalid JSON: ${text}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      `Judge0 request failed: ${response.status}`
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Execute one test case
|--------------------------------------------------------------------------
*/

async function executeTestCase({
  code,
  languageId,
  testCase
}) {
  const result = await createSubmission({
    code,
    languageId,
    stdin: testCase.input,
    expectedOutput: testCase.expectedOutput
  });

  return {
    passed:
      result.status?.id === STATUS.ACCEPTED,

    status:
      result.status?.description ||
      "Unknown",

    stdout:
      result.stdout || "",

    stderr:
      result.stderr || "",

    compileOutput:
      result.compile_output || "",

    time:
      result.time || null,

    memory:
      result.memory || null,

    message:
      result.message || null
  };
}

/*
|--------------------------------------------------------------------------
| Execute all challenge tests
|--------------------------------------------------------------------------
*/

async function executeWithJudge0({
  code,
  language,
  challenge
}) {
  const languageId =
    LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error(
      `Unsupported language: ${language}`
    );
  }

  const testCases =
    challenge.testCases || [];

  if (!testCases.length) {
    throw new Error(
      "This challenge has no test cases."
    );
  }

  const results = [];

  /*
   * Run tests one by one.
   *
   * This is intentionally simple for Phase 2.
   * Later we can optimize using Judge0 batch submissions.
   */

  for (const testCase of testCases) {
    const result =
      await executeTestCase({
        code,
        languageId,
        testCase
      });

    results.push(result);

    /*
     * Stop immediately on compilation,
     * runtime, or time-limit errors.
     */

    if (
      result.status ===
        "Compilation Error" ||
      result.status ===
        "Runtime Error" ||
      result.status ===
        "Time Limit Exceeded" ||
      result.status ===
        "Internal Error"
    ) {
      break;
    }
  }

  const passed =
    results.filter(
      result => result.passed
    ).length;

  const total =
    testCases.length;

  const firstFailure =
    results.find(
      result => !result.passed
    );

  let status = "Accepted";

  if (passed !== total) {
    status =
      firstFailure?.status ||
      "Wrong Answer";
  }

  const times =
    results
      .map(result => Number(result.time))
      .filter(time => Number.isFinite(time));

  const memoryValues =
    results
      .map(result => Number(result.memory))
      .filter(memory => Number.isFinite(memory));

  return {
    status,

    passed,

    total,

    executionTime:
      times.length
        ? `${Math.max(...times).toFixed(3)}s`
        : null,

    memory:
      memoryValues.length
        ? `${Math.max(...memoryValues)} KB`
        : null,

    stdout:
      firstFailure?.stdout || "",

    stderr:
      firstFailure?.stderr || "",

    compileOutput:
      firstFailure?.compileOutput || "",

    message:
      firstFailure?.message || null,

    demo: false,

    testResults: results.map(
      (result, index) => ({
        testCase: index + 1,
        passed: result.passed,
        status: result.status
      })
    )
  };
}

/*
|--------------------------------------------------------------------------
| Public execution function
|--------------------------------------------------------------------------
*/

export async function executeCode({
  code,
  language,
  challenge
}) {
  /*
   * Basic input validation.
   */

  if (!code || !code.trim()) {
    throw new Error(
      "Code cannot be empty."
    );
  }

  if (!language) {
    throw new Error(
      "Programming language is required."
    );
  }

  if (!challenge) {
    throw new Error(
      "Challenge not found."
    );
  }

  /*
   * If Judge0 is not configured,
   * use the development evaluator.
   */

  if (!env.judge0Url) {
    console.warn(
      "Judge0 is not configured. Using demo evaluator."
    );

    return demoEvaluate(
      code,
      challenge
    );
  }

  /*
   * Real execution.
   */

  return executeWithJudge0({
    code,
    language,
    challenge
  });
}
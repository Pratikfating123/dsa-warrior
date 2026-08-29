import { z } from "zod";

import {
  createSubmission,
  findChallenge,
  saveUser,
  listUserSubmissions
} from "../services/store.js";

import {
  executeCode
} from "../services/executor.js";

import {
  publicUser
} from "../utils/auth.js";


/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const submissionSchema = z.object({
  challengeId:
    z.string()
      .min(1)
      .max(100),

  language:
    z.string()
      .min(1)
      .max(30),

  code:
    z.string()
      .min(1)
      .max(50000)
});


/*
|--------------------------------------------------------------------------
| Submit solution
|--------------------------------------------------------------------------
*/

export async function submit(req, res) {
  try {
    const data =
      submissionSchema.parse(
        req.body
      );

    /*
     * Find challenge using slug.
     */

    const challenge =
      await findChallenge(
        data.challengeId
      );

    if (!challenge) {
      return res.status(404).json({
        message:
          "Challenge not found."
      });
    }

    /*
     * Execute code.
     */

    const result =
      await executeCode({
        code: data.code,
        language: data.language,
        challenge
      });

    /*
     * Check whether this challenge
     * was already solved.
     */

    const solvedChallenges =
      req.user.solvedChallenges ||
      [];

    const alreadySolved =
      solvedChallenges.includes(
        data.challengeId
      );

    /*
     * Reward the player only once.
     */

    let reward = {
      xp: 0,
      coins: 0,
      firstSolve: false
    };

    if (
      result.status === "Accepted" &&
      !alreadySolved
    ) {
      const xpReward =
        Number(challenge.xp || 0);

      const coinReward = 25;

      req.user.xp += xpReward;

      req.user.coins += coinReward;

      req.user.solvedChallenges.push(
        data.challengeId
      );

      reward = {
        xp: xpReward,
        coins: coinReward,
        firstSolve: true
      };

      /*
       * First challenge achievement.
       */

      if (
        !req.user.achievements.includes(
          "first-blood"
        )
      ) {
        req.user.achievements.push(
          "first-blood"
        );
      }

      /*
       * Three challenges.
       */

      if (
        req.user.solvedChallenges.length >= 3 &&
        !req.user.achievements.includes(
          "three-quests"
        )
      ) {
        req.user.achievements.push(
          "three-quests"
        );
      }

      /*
       * Five challenges.
       */

      if (
        req.user.solvedChallenges.length >= 5 &&
        !req.user.achievements.includes(
          "five-quests"
        )
      ) {
        req.user.achievements.push(
          "five-quests"
        );
      }

      await saveUser(
        req.user
      );
    }

    /*
     * Save submission history.
     */

    await createSubmission({
      userId: req.user._id,

      challengeId:
        data.challengeId,

      language:
        data.language,

      code:
        data.code,

      status:
        result.status,

      passed:
        result.passed,

      total:
        result.total,

      executionTime:
        result.executionTime,

      memory:
        result.memory,

      stdout:
        result.stdout,

      stderr:
        result.stderr
    });

    /*
     * Response.
     */

    return res.json({
      success: true,

      result,

      reward,

      user:
        publicUser(
          req.user
        )
    });

  } catch (error) {
    console.error(
      "SUBMISSION ERROR:",
      error
    );

    if (
      error.name ===
      "ZodError"
    ) {
      return res.status(400).json({
        message:
          "Invalid submission data.",
        issues:
          error.issues
      });
    }

    return res.status(500).json({
      message:
        error.message ||
        "Code execution failed."
    });
  }
}


/*
|--------------------------------------------------------------------------
| Submission history
|--------------------------------------------------------------------------
*/

export async function mySubmissions(
  req,
  res
) {
  const submissions =
    await listUserSubmissions(
      req.user._id
    );

  res.json({
    submissions
  });
}
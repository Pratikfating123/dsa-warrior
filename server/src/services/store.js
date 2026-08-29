import mongoose from "mongoose";
import crypto from "node:crypto";

import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import Submission from "../models/Submission.js";

/*
|--------------------------------------------------------------------------
| In-memory store
|--------------------------------------------------------------------------
|
| Used when MONGODB_URI is not configured.
| Your real project uses MongoDB Atlas.
|
*/

const mem = {
  users: [],
  challenges: [],
  submissions: []
};

/*
|--------------------------------------------------------------------------
| Storage mode
|--------------------------------------------------------------------------
*/

export const isMemory = () => !process.env.MONGODB_URI;

/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

/**
 * Find a user by email.
 */
export async function findUserByEmail(email) {
  if (isMemory()) {
    return mem.users.find(
      user => user.email === email
    );
  }

  return User.findOne({
    email
  });
}

/**
 * Find a user by ID.
 *
 * MongoDB requires a valid ObjectId.
 */
export async function findUserById(id) {
  if (isMemory()) {
    return mem.users.find(
      user => String(user._id) === String(id)
    );
  }

  // Prevent Mongoose ObjectId CastError
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return User.findById(id);
}

/**
 * Create a new user.
 */
export async function createUser(data) {
  if (isMemory()) {
    const user = {
      _id: crypto.randomUUID(),

      ...data,

      xp: 0,
      coins: 100,
      streak: 0,
      lastActiveDate: "",

      solvedChallenges: [],
      achievements: [],

      createdAt: new Date()
    };

    mem.users.push(user);

    return user;
  }

  return User.create(data);
}

/**
 * Save/update a user.
 */
export async function saveUser(user) {
  if (isMemory()) {
    return user;
  }

  return user.save();
}

/*
|--------------------------------------------------------------------------
| CHALLENGES
|--------------------------------------------------------------------------
*/

/**
 * Get all challenges.
 *
 * Optional:
 *
 * /api/challenges?topic=arrays
 */
export async function listChallenges(topicId) {
  if (isMemory()) {
    return mem.challenges
      .filter(
        challenge =>
          !topicId ||
          challenge.topicId === topicId
      )
      .sort(
        (a, b) =>
          a.order - b.order
      );
  }

  const filter = topicId
    ? { topicId }
    : {};

  return Challenge.find(filter)
    .sort({
      order: 1
    });
}

/**
 * Find a challenge.
 *
 * IMPORTANT:
 *
 * Frontend challenge IDs are slugs:
 *
 *   find-maximum
 *   two-sum
 *   recursive-factorial
 *   recursive-power
 *   tree-height
 *   bubble-sort
 *
 * MongoDB's `_id` is an ObjectId.
 *
 * Therefore we MUST NOT do:
 *
 *   Challenge.findOne({
 *     $or: [
 *       { slug: id },
 *       { _id: id }
 *     ]
 *   })
 *
 * when id = "two-sum".
 *
 * Mongoose would try to convert "two-sum"
 * into an ObjectId and throw:
 *
 * CastError: Cast to ObjectId failed
 */
export async function findChallenge(id) {
  /*
   * ----------------------------------------
   * MEMORY MODE
   * ----------------------------------------
   */

  if (isMemory()) {
    return mem.challenges.find(
      challenge =>
        challenge.slug === id ||
        String(challenge._id) === String(id)
    );
  }

  /*
   * ----------------------------------------
   * MONGODB MODE
   * ----------------------------------------
   */

  // First search by slug.
  //
  // This handles:
  //
  // /api/challenges/two-sum
  //
  const challengeBySlug =
    await Challenge.findOne({
      slug: id
    });

  if (challengeBySlug) {
    return challengeBySlug;
  }

  /*
   * ----------------------------------------
   * ObjectId fallback
   * ----------------------------------------
   *
   * Only search `_id` if the supplied value
   * is actually a valid MongoDB ObjectId.
   */

  if (mongoose.isValidObjectId(id)) {
    return Challenge.findById(id);
  }

  /*
   * The value isn't a slug and isn't a
   * valid MongoDB ObjectId.
   */

  return null;
}

/**
 * Create a challenge.
 */
export async function createChallenge(data) {
  if (isMemory()) {
    const challenge = {
      _id: crypto.randomUUID(),

      ...data,

      createdAt: new Date()
    };

    mem.challenges.push(challenge);

    return challenge;
  }

  return Challenge.create(data);
}

/*
|--------------------------------------------------------------------------
| SUBMISSIONS
|--------------------------------------------------------------------------
*/

/**
 * Create a submission.
 */
export async function createSubmission(data) {
  if (isMemory()) {
    const submission = {
      _id: crypto.randomUUID(),

      ...data,

      createdAt: new Date()
    };

    mem.submissions.push(submission);

    return submission;
  }

  return Submission.create(data);
}

/**
 * Get current user's recent submissions.
 */
export async function listUserSubmissions(userId) {
  if (isMemory()) {
    return mem.submissions
      .filter(
        submission =>
          String(submission.userId) ===
          String(userId)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 20);
  }

  /*
   * Validate userId before querying MongoDB.
   *
   * This prevents another ObjectId CastError.
   */

  if (!mongoose.isValidObjectId(userId)) {
    return [];
  }

  return Submission.find({
    userId
  })
    .sort({
      createdAt: -1
    })
    .limit(20);
}

/*
|--------------------------------------------------------------------------
| LEADERBOARD
|--------------------------------------------------------------------------
*/

/**
 * Get top players.
 */
export async function leaderboard() {
  if (isMemory()) {
    return [...mem.users]
      .sort(
        (a, b) =>
          b.xp - a.xp
      )
      .slice(0, 20);
  }

  return User.find({})
    .select(
      "name xp achievements"
    )
    .sort({
      xp: -1
    })
    .limit(20);
}

/*
|--------------------------------------------------------------------------
| MEMORY SEED
|--------------------------------------------------------------------------
*/

/**
 * Seed data for development mode.
 */
export function seedMemory({
  users = [],
  challenges = []
}) {
  mem.users.push(
    ...users
  );

  mem.challenges.push(
    ...challenges
  );
}

/*
|--------------------------------------------------------------------------
| OPTIONAL MEMORY HELPERS
|--------------------------------------------------------------------------
*/

/**
 * Clear in-memory data.
 *
 * Useful for development/testing.
 */
export function clearMemoryStore() {
  mem.users.length = 0;
  mem.challenges.length = 0;
  mem.submissions.length = 0;
}

/**
 * Get current in-memory data.
 *
 * Useful for debugging.
 */
export function getMemoryStore() {
  return mem;
}
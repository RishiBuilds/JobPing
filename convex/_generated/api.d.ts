/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activityLogs from "../activityLogs.js";
import type * as applications from "../applications.js";
import type * as helpers from "../helpers.js";
import type * as jobs from "../jobs.js";
import type * as memberships from "../memberships.js";
import type * as notifications from "../notifications.js";
import type * as organizations from "../organizations.js";
import type * as users from "../users.js";
import type * as webhookProcessor from "../webhookProcessor.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activityLogs: typeof activityLogs;
  applications: typeof applications;
  helpers: typeof helpers;
  jobs: typeof jobs;
  memberships: typeof memberships;
  notifications: typeof notifications;
  organizations: typeof organizations;
  users: typeof users;
  webhookProcessor: typeof webhookProcessor;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

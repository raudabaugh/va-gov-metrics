/* node:coverage disable */

import Onboarder from "./Onboarder.js";

export const createOnboarder = (attributes = {}) =>
  new Onboarder({
    gitHubHandle: "octocat",
    onboardingStart: new Date("2023-07-01T00:00:00Z"),
    ...attributes,
  });

/* node:coverage enable */

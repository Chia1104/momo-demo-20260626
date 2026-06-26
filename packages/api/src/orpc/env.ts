import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {},
  runtimeEnv: {},
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.SKIP_ENV_VALIDATION === "1",
});

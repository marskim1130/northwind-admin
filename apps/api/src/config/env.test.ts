import { afterEach, describe, expect, it } from "vitest";
import { loadEnv } from "./env";

const originalApiPort = process.env.API_PORT;

afterEach(() => {
  if (originalApiPort === undefined) {
    delete process.env.API_PORT;
  } else {
    process.env.API_PORT = originalApiPort;
  }
});

describe("环境变量加载 [Environment Loading]", () => {
  it("API_PORT 非数字时抛出清晰配置错误 [Clear Configuration Error]", () => {
    process.env.API_PORT = "not-a-number";

    expect(() => loadEnv()).toThrow("API_PORT must be a number between 1 and 65535.");
  });
});

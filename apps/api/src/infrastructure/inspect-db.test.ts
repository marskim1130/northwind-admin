import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const apiRoot = fileURLToPath(new URL("../..", import.meta.url));
const pnpmCli = process.env.npm_execpath;

describe("只读数据库检查 [Read-only Database Inspection]", () => {
  it("缺少 DATABASE_URL 时输出清晰配置错误 [Clear Configuration Error]", () => {
    expect(pnpmCli).toBeDefined();

    const result = spawnSync(process.execPath, [pnpmCli ?? "", "db:inspect"], {
      cwd: apiRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        DATABASE_URL: ""
      }
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("DATABASE_URL is required for read-only database inspection.");
    expect(result.stderr).not.toContain("Error:");
  });
});

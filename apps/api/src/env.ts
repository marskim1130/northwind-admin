import { config } from "dotenv";
import { fileURLToPath } from "node:url";

const workspaceEnvPath = fileURLToPath(new URL("../../../.env", import.meta.url));

export function loadEnv() {
  config({ path: workspaceEnvPath });
  validateApiPort(process.env.API_PORT);
}

function validateApiPort(value: string | undefined) {
  if (value === undefined || value === "") {
    return;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("API_PORT must be a number between 1 and 65535.");
  }
}

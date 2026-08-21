const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const ROOT = process.cwd();

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function upsertEnvValue(envText, key, value) {
  const lines = envText.split(/\r?\n/);
  let found = false;

  const next = lines.map((line) => {
    if (!line) return line;
    if (line.trim().startsWith("#")) return line;

    const idx = line.indexOf("=");
    if (idx === -1) return line;

    const k = line.slice(0, idx).trim();
    if (k !== key) return line;

    found = true;
    return `${key}=${value}`;
  });

  if (!found) next.push(`${key}=${value}`);

  return next
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()
    .concat("\n");
}

function ensureEnvLocal() {
  const envExamplePath = path.join(ROOT, ".env.example");
  const envLocalPath = path.join(ROOT, ".env.local");

  if (!fileExists(envLocalPath)) {
    if (fileExists(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envLocalPath);
    } else {
      fs.writeFileSync(envLocalPath, "");
    }
  }

  let content = fs.readFileSync(envLocalPath, "utf8");

  content = upsertEnvValue(
    content,
    "MONGODB_URI",
    "mongodb://localhost:27017/mentorbridge"
  );

  const defaultSecret = `mentorbridge-dev-${crypto.randomBytes(16).toString("hex")}`;
  content = upsertEnvValue(content, "JWT_SECRET", defaultSecret);
  content = upsertEnvValue(content, "NODE_ENV", "development");

  fs.writeFileSync(envLocalPath, content, "utf8");
}

function run(cmd, args, { name } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${name || cmd} failed with exit code ${code}`));
    });
  });
}

async function main() {
  ensureEnvLocal();

  await run("npm", ["install"], { name: "npm install" });
  await run("npm", ["run", "seed"], { name: "npm run seed" });

  await run("npm", ["run", "dev"], { name: "npm run dev" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

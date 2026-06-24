import crypto from "node:crypto";
import { stdin, stdout, stderr } from "node:process";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(password, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

async function readPassword() {
  if (process.argv[2]) return process.argv[2];
  stdout.write("Enter admin password: ");
  stdin.setRawMode?.(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  let password = "";
  return await new Promise((resolve) => {
    stdin.on("data", (char) => {
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode?.(false);
        stdout.write("\n");
        resolve(password);
        return;
      }
      if (char === "\u0003") {
        stderr.write("\nCancelled.\n");
        process.exit(1);
      }
      password += char;
      stdout.write("*");
    });
  });
}

const password = await readPassword();
if (password.length < 10) {
  stderr.write("Password must be at least 10 characters.\n");
  process.exit(1);
}

stdout.write(`${hashPassword(password)}\n`);

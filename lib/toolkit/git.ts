// Gracefully execute git commands.

import {spawn} from "child_process";

export interface IOutput {
  stderr: string;
  stdout: string;
  code: number | null;
  signal: string | null;
}

export type GitError = Error & IOutput;

export function isGitError(err: any): err is GitError {
  return ["stderr", "stdout", "code", "signal"].every(
    field => err[field] !== undefined
  );
}

export function git(...args: string[]): Promise<IOutput> {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args);

    let stderr = "";
    let stdout = "";
    let complete = false;

    child.stdout.on("data", chunk => (stdout += chunk));
    child.stderr.on("data", chunk => (stderr += chunk));

    child.on("exit", (code, signal) => {
      if (complete) {
        const description =
          code === null ? `exit code ${code}` : `signal ${signal}`;
        console.log(
          `git ${args.join(" ")} terminated unexpectedly with ${description}`
        );
      } else {
        complete = true;

        if (code !== null) {
          if (code === 0) {
            // Successful completion
            resolve({stderr, stdout, code, signal: null});
          } else {
            // Error
            const e = new Error(
              `git ${args.join(" ")} terminated with nonzero exit code ${code}`
            ) as GitError;
            e.stdout = stdout;
            e.stderr = stderr;
            e.code = code;
            e.signal = null;
            reject(e);
          }
        } else if (signal !== null) {
          const e = new Error(
            `git ${args.join(" ")} was terminated with signal ${signal}`
          ) as GitError;
          e.stdout = stdout;
          e.stderr = stderr;
          e.code = null;
          e.signal = signal;
          reject(e);
        }
      }
    });

    child.on("error", err => {
      if (complete) {
        console.error(`Error from spawned git process:\n${err.stack}`);
      } else {
        complete = true;
        reject(err);
      }
    });
  });
}

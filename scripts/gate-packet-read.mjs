#!/usr/bin/env node
/**
 * Structured Gate Packet read (Option B).
 *
 * READ-ONLY index: GitHub live PR state + locked pilot evidence docs.
 * Does not post to GitHub. Does not authorize mutation.
 */
import { execFileSync } from "node:child_process";
import process from "node:process";

import { readGatePacketForIssue } from "./lib/gate-packet/read-gate-packet.mjs";

const root = process.cwd();

const issueArg = process.argv.find((a) => /^\d+$/.test(a));
const issueNumber = issueArg ? Number(issueArg) : 552;

const run = (command, args) =>
  execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

const mainSha = (() => {
  try {
    return run("git", ["rev-parse", "origin/main"]);
  } catch {
    try {
      return run("git", ["rev-parse", "HEAD"]);
    } catch {
      return "UNKNOWN";
    }
  }
})();

const runGh = (args) => {
  try {
    return run("gh", args);
  } catch {
    return null;
  }
};

const packet = await readGatePacketForIssue(issueNumber, { root, runGh, mainSha });
console.log(JSON.stringify(packet, null, 2));

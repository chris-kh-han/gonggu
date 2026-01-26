#!/usr/bin/env node
/**
 * SessionStart Hook - Load previous context and detect package manager
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs when a new Claude session starts:
 * - Checks for recent session files
 * - Detects package manager from project
 * - Outputs systemMessage for Claude context
 */

import path from 'path';
import fs from 'fs';
import {
  getProjectSessionsDir,
  findFiles,
  ensureDir,
  appendFile,
  readStdinJson,
} from '../../lib/utils.js';
import { getPackageManager } from '../../lib/package-manager.js';

const LOGS_DIR = './.claude/logs';

/**
 * Find recent session files in project's .claude/sessions directory
 * @param {number} maxAgeDays - Maximum age in days
 * @returns {Array} - Array of session file info
 */
function findRecentSessions(maxAgeDays = 7) {
  const sessionsDir = getProjectSessionsDir();

  if (!fs.existsSync(sessionsDir)) {
    return [];
  }

  const sessions = findFiles(sessionsDir, '*-session.tmp', {
    maxAge: maxAgeDays,
  });

  return sessions.map((s) => ({
    filename: path.basename(s.path),
    path: s.path,
    mtime: new Date(s.mtime).toISOString(),
  }));
}

async function main() {
  try {
    const input = await readStdinJson();
    const sessionId = (input.session_id || 'unknown').slice(0, 8);
    const ts = new Date().toTimeString().slice(0, 8);

    ensureDir(LOGS_DIR);

    const messages = [];

    // 1. Check for recent sessions
    const recentSessions = findRecentSessions(7);
    if (recentSessions.length > 0) {
      const latest = recentSessions[0].filename;
      const msg = `${recentSessions.length} recent session(s). Latest: ${latest}`;
      messages.push(msg);
      appendFile(
        `${LOGS_DIR}/hooks.log`,
        `${ts} [SessionStart] Recent sessions: ${recentSessions.length}\n`,
      );
    }

    // 2. Detect package manager
    const pm = getPackageManager();
    const pmMsg = `PM: ${pm.name} (${pm.source})`;
    messages.push(pmMsg);
    appendFile(
      `${LOGS_DIR}/hooks.log`,
      `${ts} [SessionStart] PM: ${pm.name} (${pm.source})\n`,
    );

    // Output combined systemMessage
    if (messages.length > 0) {
      console.log(
        JSON.stringify({
          systemMessage: `SessionStart:${messages.join(' | ')}`,
        }),
      );
    }
  } catch (err) {
    console.error('[session-start] Error:', err.message);
  }
}

main();

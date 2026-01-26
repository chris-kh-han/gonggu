#!/usr/bin/env node
/**
 * SessionEnd Hook - Persist session state when session ends
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs when Claude session ends. Creates/updates session log file
 * with actual session content from git diff and hooks.log
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  getProjectSnapshotsDir,
  getProjectClaudeDir,
  getDateString,
  getCompactDateString,
  getTimeString,
  getCompactTimeString,
  ensureDir,
  writeFile,
  replaceInFile,
  log,
} from '../../lib/utils.js';

// Read stdin JSON input
let inputData = '';
process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', async () => {
  try {
    const input = JSON.parse(inputData || '{}');
    const sessionId = (input.session_id || 'unknown').slice(0, 8);

    const snapshotsDir = getProjectSnapshotsDir();
    const today = getDateString();
    const compactDate = getCompactDateString();
    const compactTime = getCompactTimeString();
    const currentTime = getTimeString();
    const sessionFile = path.join(
      snapshotsDir,
      `${compactDate}-${compactTime}-${sessionId}-snapshot.md`,
    );

    ensureDir(snapshotsDir);

    // Gather session info
    const modifiedFiles = getModifiedFiles();
    const recentActivity = getRecentActivity(sessionId);

    // If session file exists, update it
    if (fs.existsSync(sessionFile)) {
      replaceInFile(
        sessionFile,
        /\*\*Last Updated:\*\*.*/,
        `**Last Updated:** ${currentTime}`,
      );

      // Update modified files section if exists
      if (modifiedFiles.length > 0) {
        const filesSection = modifiedFiles.map((f) => `- \`${f}\``).join('\n');
        const content = fs.readFileSync(sessionFile, 'utf8');
        if (content.includes('### Modified Files')) {
          // Update existing section
          const updated = content.replace(
            /### Modified Files\n[\s\S]*?(?=\n###|$)/,
            `### Modified Files\n${filesSection}\n\n`,
          );
          fs.writeFileSync(sessionFile, updated);
        }
      }

      log(`[SessionEnd] Updated: ${sessionFile}`);
      console.log(
        JSON.stringify({ systemMessage: `[Hook] Session ${sessionId} ended` }),
      );
    } else {
      // Create new session file with actual content
      const filesSection =
        modifiedFiles.length > 0
          ? modifiedFiles.map((f) => `- \`${f}\``).join('\n')
          : '- (no changes)';

      const activitySection =
        recentActivity.length > 0
          ? recentActivity.map((a) => `- ${a}`).join('\n')
          : '- (no activity logged)';

      const template = `# Session: ${today} (${sessionId})
**Date:** ${today}
**Session ID:** ${sessionId}
**Started:** ${currentTime}
**Last Updated:** ${currentTime}

---

## Summary

[Add session summary here]

### Modified Files
${filesSection}

### Recent Activity
${activitySection}

### Notes for Next Session
-

### Context to Load
\`\`\`
${modifiedFiles.slice(0, 5).join('\n') || '[relevant files]'}
\`\`\`
`;

      writeFile(sessionFile, template);
      log(`[SessionEnd] Created: ${sessionFile}`);
      console.log(
        JSON.stringify({
          systemMessage: `[Hook] Session ${sessionId} saved (${modifiedFiles.length} files modified)`,
        }),
      );
    }
  } catch (err) {
    console.error('[SessionEnd] Error:', err.message);
  }

  process.exit(0);
});

/**
 * Get list of modified files from git
 */
function getModifiedFiles() {
  try {
    // Check if in git repo
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });

    // Get modified files (staged + unstaged)
    const output = execSync(
      'git diff --name-only HEAD 2>/dev/null || git diff --name-only',
      {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      },
    );

    return output.split('\n').filter((f) => f.trim());
  } catch {
    return [];
  }
}

/**
 * Get recent activity from hooks.log
 */
function getRecentActivity(sessionId) {
  try {
    const logFile = path.join(getProjectClaudeDir(), 'logs', 'hooks.log');
    if (!fs.existsSync(logFile)) return [];

    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.split('\n').filter((l) => l.trim());

    // Get last 20 lines of activity
    const recent = lines.slice(-20);

    // Filter to relevant entries (Edit, Write, Bash with git)
    const relevant = recent
      .filter(
        (l) =>
          l.includes('[PostToolUse:Edit]') ||
          l.includes('[PostToolUse:Write]') ||
          (l.includes('[PostToolUse:Bash]') &&
            (l.includes('git') || l.includes('pnpm'))),
      )
      .map((l) => {
        // Extract just the description part
        const match = l.match(/\[PostToolUse:\w+\]\s*(.+)/);
        return match ? match[1].trim() : l;
      })
      .slice(-10);

    return relevant;
  } catch {
    return [];
  }
}

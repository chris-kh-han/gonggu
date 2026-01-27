#!/usr/bin/env node
/**
 * macOS Notification Hook for Claude Code
 * Sends notifications via terminal-notifier when:
 * - Permission prompt appears
 * - Idle prompt (waiting for input)
 * - Task completed
 *
 * Title format: Claude [IDE:project:sessionId]
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

// Read stdin for session context
let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  let data = {};
  try {
    data = JSON.parse(input);
  } catch {
    // stdin might be empty for some hook types
  }

  // IDE detection from environment
  const ide = process.env.ZED_TERM
    ? 'Zed'
    : (process.env.__CFBundleIdentifier || '').toLowerCase().includes('cursor')
      ? 'Cursor'
      : process.env.VSCODE_GIT_IPC_HANDLE
        ? 'VSCode'
        : 'CLI';

  // Project name from current directory
  const project = path.basename(process.cwd());

  // Session ID (first 8 characters)
  const sessionId = (
    data.session_id ||
    process.env.CLAUDE_SESSION_ID ||
    'unknown'
  ).slice(0, 8);

  // Base message from CLI argument
  const baseMessage = process.argv[2] || 'Notification';

  // Extract context from last user prompt (saved by UserPromptSubmit hook)
  let context = '';
  try {
    const lastPrompt = readFileSync('./.claude/logs/last-prompt.txt', 'utf8');
    if (lastPrompt) {
      context = lastPrompt.slice(0, 50).replace(/\n/g, ' ');
      if (lastPrompt.length > 50) context += '...';
    }
  } catch {
    // File doesn't exist or can't read - fall back to tool info
    if (data.tool_name) {
      const toolName = data.tool_name;
      const toolInput = data.tool_input || {};

      if (toolName === 'Bash') {
        const cmd = (toolInput.command || '').slice(0, 40);
        context = `${toolName}: ${cmd}${toolInput.command?.length > 40 ? '...' : ''}`;
      } else if (
        toolName === 'Edit' ||
        toolName === 'Write' ||
        toolName === 'Read'
      ) {
        context = `${toolName}: ${path.basename(toolInput.file_path || '')}`;
      } else if (toolName === 'Task') {
        context = `${toolName}: ${toolInput.description || ''}`;
      } else {
        context = toolName;
      }
    }
  }

  // Build full message
  const message = context ? `${baseMessage}\n${context}` : baseMessage;

  // Build title
  const title = `Claude [${ide}:${project}:${sessionId}]`;

  // Escape single quotes in message and title
  const escapeQuotes = (str) => str.replace(/'/g, "'\\''");

  try {
    execSync(
      `/opt/homebrew/bin/terminal-notifier -title '${escapeQuotes(title)}' -message '${escapeQuotes(message)}' -sound default -activate com.todesktop.230313mzl4w4u92`,
      { stdio: 'pipe' },
    );
  } catch (error) {
    // Silently fail - notification is non-critical
    console.error('[Notification] Failed:', error.message);
  }
});

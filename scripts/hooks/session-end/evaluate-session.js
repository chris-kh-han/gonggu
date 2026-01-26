#!/usr/bin/env node
/**
 * SessionEnd Hook - Session Evaluator
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs on SessionEnd to signal that session should be evaluated
 * for extractable patterns (long sessions only)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getProjectClaudeDir,
  ensureDir,
  readFile,
  log,
} from '../../lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read stdin JSON input
let inputData = '';
process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', async () => {
  try {
    const input = JSON.parse(inputData || '{}');
    const sessionId = (input.session_id || 'unknown').slice(0, 8);
    const transcriptPath = input.transcript_path;

    // Get config
    const configFile = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'skills',
      'continuous-learning',
      'config.json',
    );

    let minSessionLength = 10;
    let learnedSkillsPath = path.join(getProjectClaudeDir(), 'skills', 'learned');

    const configContent = readFile(configFile);
    if (configContent) {
      try {
        const config = JSON.parse(configContent);
        minSessionLength = config.min_session_length || 10;

        if (config.learned_skills_path?.startsWith('./')) {
          learnedSkillsPath = path.join(process.cwd(), config.learned_skills_path.slice(2));
        }
      } catch {
        // Invalid config, use defaults
      }
    }

    ensureDir(learnedSkillsPath);

    // Check transcript exists
    if (!transcriptPath || !fs.existsSync(transcriptPath)) {
      log(`[ContinuousLearning] No transcript found for session ${sessionId}`);
      process.exit(0);
    }

    // Count user messages
    const content = fs.readFileSync(transcriptPath, 'utf8');
    const messageCount = (content.match(/"type":"user"/g) || []).length;

    if (messageCount < minSessionLength) {
      log(`[ContinuousLearning] Session ${sessionId} too short (${messageCount} msgs), skipping`);
      process.exit(0);
    }

    // Signal for pattern extraction
    log(`[ContinuousLearning] Session ${sessionId} has ${messageCount} messages`);
    console.log(JSON.stringify({
      systemMessage: `[Hook] Session ${sessionId} (${messageCount} msgs) - evaluate for patterns`,
    }));
  } catch (err) {
    console.error('[ContinuousLearning] Error:', err.message);
  }

  process.exit(0);
});

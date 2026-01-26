import path from 'path';
import {
  getProjectSessionsDir,
  getDateTimeString,
  ensureDir,
  appendFile,
  log,
} from '../../lib/utils.js';

async function main() {
  const sessionsDir = getProjectSessionsDir();
  const compactionLog = path.join(sessionsDir, 'compaction-log.txt');

  ensureDir(sessionsDir);

  // Log compaction event with timestamp
  const timestamp = getDateTimeString();
  appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

  log('[PreCompact] Compaction logged');
  process.exit(0);
}

main().catch((err) => {
  console.error('[PreCompact] Error:', err.message);
  process.exit(0);
});

const fs = require('fs');
const path = require('path');
const os = require('os');

const THRESHOLD = parseInt(process.env.COMPACT_THRESHOLD, 10) || 50;
const REPEAT_INTERVAL = parseInt(process.env.COMPACT_REPEAT, 10) || 25;

const sessionId = process.env.CLAUDE_SESSION_ID || `pid-${process.ppid}`;
const counterFile = path.join(
  os.tmpdir(),
  `claude-compact-counter-${sessionId}`,
);

function readCounter() {
  try {
    const content = fs.readFileSync(counterFile, 'utf8').trim();
    return parseInt(content, 10) || 0;
  } catch {
    return 0;
  }
}

function writeCounter(count) {
  fs.writeFileSync(counterFile, String(count), 'utf8');
}

function shouldSuggest(count) {
  if (count < THRESHOLD) return false;
  if (count === THRESHOLD) return true;
  return (count - THRESHOLD) % REPEAT_INTERVAL === 0;
}

const count = readCounter() + 1;
writeCounter(count);

if (shouldSuggest(count)) {
  process.stderr.write(
    `[Hook] ${count} edits this session. Consider running /compact to free context.\n`,
  );
}

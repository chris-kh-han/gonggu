let data = '';
process.stdin.on('data', (chunk) => (data += chunk));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const cmd = input.tool_input?.command || '';
    if (/npm run dev|pnpm( run)? dev|yarn dev|bun run dev/.test(cmd)) {
      console.error(
        '[Hook] BLOCKED: Dev server must run in tmux for log access',
      );
      console.error(
        '[Hook] Use: tmux new-session -d -s dev "pnpm dev"',
      );
      console.error('[Hook] Then: tmux attach -t dev');
      process.exit(2);
    }
  } catch {}
  process.exit(0);
});

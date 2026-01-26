let data = '';
process.stdin.on('data', (chunk) => (data += chunk));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const cmd = input.tool_input?.command || '';
    const pattern =
      /npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright/;
    if (pattern.test(cmd) && !process.env.TMUX) {
      console.error(
        '[Hook] Consider running in tmux for session persistence',
      );
      console.error('[Hook] tmux new -s dev  |  tmux attach -t dev');
    }
  } catch {}
  process.exit(0);
});

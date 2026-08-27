const { existsSync } = require('node:fs');
const { spawnSync } = require('node:child_process');

const archive = 'GamesCalculators-phase3.tar.gz';

if (existsSync('src') && existsSync('astro.config.mjs')) {
  process.exit(0);
}

if (!existsSync(archive)) {
  throw new Error(`Missing validated source archive: ${archive}`);
}

const result = spawnSync('tar', ['--exclude=package.json', '-xzf', archive], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  throw new Error(`Could not extract validated Phase 3 source (tar exited ${result.status}).`);
}

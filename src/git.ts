import { join, normalize, resolve, sep } from 'path';
import { rm } from 'fs/promises';
import { $ } from 'bun';

const tmpdir = () => Bun.env.TMPDIR ?? '/tmp';

export async function cloneRepo(url: string): Promise<string> {
  const tempDir = join(tmpdir(), `add-skill-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await $`git clone --depth 1 ${url} ${tempDir}`.quiet();
  return tempDir;
}

export async function cleanupTempDir(dir: string): Promise<void> {
  // Validate that the directory path is within tmpdir to prevent deletion of arbitrary paths
  const normalizedDir = normalize(resolve(dir));
  const normalizedTmpDir = normalize(resolve(tmpdir()));

  if (!normalizedDir.startsWith(normalizedTmpDir + sep) && normalizedDir !== normalizedTmpDir) {
    throw new Error('Attempted to clean up directory outside of temp directory');
  }

  await rm(dir, { recursive: true, force: true });
}

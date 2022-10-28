import Store from 'electron-store';
import { app } from 'electron';

const store = new Store();

const SOURCE_PATH = 'source-path';

function setSourcePath(newSourcePath: string) {
  console.log(`[setSourcePath]: ${newSourcePath}`);
  store.set(SOURCE_PATH, newSourcePath);
}
async function getSourcePath(): Promise<string> {
  const defaultPath = app.getPath('documents');
  const sourcePath = (await store.get(SOURCE_PATH)) as string;
  console.log(`[getSourcePath] sourcePath: ${sourcePath}`);
  if (sourcePath) return sourcePath;

  setSourcePath(defaultPath);
  console.log(`[getSourcePath] defaultPath: ${defaultPath}`);
  return defaultPath;
}

export { getSourcePath, setSourcePath };

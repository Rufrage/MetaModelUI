/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import {
  MMAttribute,
  MMAttributeType,
  MMBuildProfileEntry,
  MMObject,
  MMTemplate,
  MMTemplateInputType,
} from '@rufrage/metamodel';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { IPluginInfo, PluginManager } from 'live-plugin-manager';
import path from 'path';
import MenuBuilder from './menu';
import { generate } from './util/generateUtil';
import { resolveHtmlPath } from './util/htmlUtil';
import { getSourcePath, setSourcePath } from './util/store';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const manager = new PluginManager();

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on('setSourcePath', (_event, newSourcePath: string) => {
  setSourcePath(newSourcePath);
});

ipcMain.handle('getSourcePath', async (): Promise<string> => {
  return getSourcePath();
});

ipcMain.handle('selectDirectory', async () => {
  if (mainWindow) {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    if (result.filePaths && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
  }
  return null;
});

ipcMain.handle('selectFile', async () => {
  if (mainWindow) {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
    });
    if (result.filePaths && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
  }
  return null;
});

ipcMain.handle('installPackage', async (_event, filepath: string) => {
  const pluginInfo: IPluginInfo = await manager.installFromPath(filepath);
  console.log(pluginInfo);
  if (pluginInfo && pluginInfo.name?.length > 0) {
    return true;
  }
  return false;
});

ipcMain.on('generateBuildProfile', (_event, newSourcePath: string) => {
  console.log('Test');
});

ipcMain.on('generate', () => {
  const object1 = new MMObject('Auto', 'Diese Klasse beschreibt ein Auto');
  object1.addAttribute(
    new MMAttribute(
      'Hersteller',
      'Der Hersteller des Autos',
      MMAttributeType.MMString
    )
  );
  object1.addAttribute(
    new MMAttribute(
      'Preis',
      'Dies ist der Preis des Autos',
      MMAttributeType.MMInteger
    )
  );
  object1.addAttribute(
    new MMAttribute('ps', 'Die PS des Autos', MMAttributeType.MMInteger)
  );

  const object2 = new MMObject('Pferd', 'Diese Klasse beschreibt ein Pferd');
  object2.addAttribute(
    new MMAttribute(
      'Besitzer',
      'Der Besitzer des Pferds',
      MMAttributeType.MMString
    )
  );
  object2.addAttribute(
    new MMAttribute(
      'Preis',
      'Dies ist der Preis des Pferds',
      MMAttributeType.MMInteger
    )
  );
  object2.addAttribute(
    new MMAttribute('ps', 'Die PS des Pferds', MMAttributeType.MMInteger)
  );

  const objects = [object1, object2];

  const template1 = new MMTemplate(
    'Template',
    'MultiObjectFrame.ejs',
    'Test Template',
    'ABC',
    MMTemplateInputType.None,
    MMTemplateInputType.None
  );

  const templates = [template1];

  const buildProfileEntry1 = new MMBuildProfileEntry(
    'ProfileEntry',
    'Test Entry',
    'NOPROFILE',
    'ABC',
    true,
    'DEF'
  );

  const buildProfileEntries = [buildProfileEntry1];

  generate(
    'C:\\Users\\Ruben\\Documents\\GitHub\\MetaModelUI\\assets\\templates\\',
    'C:\\Users\\Ruben\\Documents\\GitHub\\MetaModelUI\\assets\\output\\',
    buildProfileEntries,
    templates,
    objects
  );
});

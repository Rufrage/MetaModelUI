import { MMBuildProfileEntry, MMObject, MMTemplate } from '@rufrage/metamodel';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPluginInfo, PluginManager } from 'live-plugin-manager';
import { generate } from './util/generateUtil';

export type Channels = 'setSourcePath' | 'getSourcePath';

const manager = new PluginManager();

contextBridge.exposeInMainWorld('plugins', {
  installModule: async (path: string) => {
    const pluginInfo: IPluginInfo = await manager.installFromPath(path);
    console.log(pluginInfo);
    if (pluginInfo && pluginInfo.name?.length > 0) {
      return true;
    }
    return false;
  },
  requireModule: async (name: string) => {
    const plugin = await manager.require(name);
    console.log(plugin);
    return plugin;
  },
});

contextBridge.exposeInMainWorld('generator', {
  generate: async (
    targetFilePath: string,
    buildProfileEntries: MMBuildProfileEntry[],
    templates: MMTemplate[],
    objects: MMObject[]
  ) => {
    return generate(targetFilePath, buildProfileEntries, templates, objects);
  },
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
});

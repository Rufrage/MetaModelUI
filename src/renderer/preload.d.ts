import { MMBuildProfileEntry, MMObject, MMTemplate } from '@rufrage/metamodel';
import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        invoke(channel: string, ...args: unknown[]): Promise<unknown>;
      };
    };
    plugins: {
      installModule(path: string): Promise<boolean>;
      requireModule(name: string): Promise<any>;
    };
    generator: {
      generate(
        targetFilePath: string,
        buildProfileEntries: MMBuildProfileEntry[],
        templates: MMTemplate[],
        objects: MMObject[]
      ): Promise<boolean>;
    };
  }
}

export {};

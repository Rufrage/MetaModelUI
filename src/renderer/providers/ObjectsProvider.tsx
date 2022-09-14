import { MMObject } from '@rufrage/metamodel';
import { createContext, useEffect, useState } from 'react';
import {
  addObject,
  getObjects,
  getObject,
  saveObject,
} from 'renderer/services/ObjectService';

export type ObjectsContextContent = {
  objects: MMObject[];
  insertObject: (object: MMObject) => Promise<MMObject | undefined>;
  updateObject: (object: MMObject) => Promise<MMObject | undefined>;
  readObjects: () => Promise<boolean>;
  readObject: (id: string) => Promise<MMObject | undefined>;
};

export const ObjectsContext = createContext<ObjectsContextContent>({
  objects: [],
  insertObject: () => {
    return new Promise((resolve) => resolve(undefined));
  },
  updateObject: () => {
    return new Promise((resolve) => resolve(undefined));
  },
  readObjects: () => {
    return new Promise((resolve) => resolve(false));
  },
  readObject: () => {
    return new Promise((resolve) => resolve(undefined));
  },
});

interface ObjectsProviderProps {
  children: JSX.Element | JSX.Element[];
}

export default function ObjectsProvider({ children }: ObjectsProviderProps) {
  const [objects, setObjects] = useState<MMObject[]>([]);

  async function readObjects(): Promise<boolean> {
    try {
      const objectItems = await getObjects();
      setObjects(objectItems);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function readObject(id: string): Promise<MMObject | undefined> {
    try {
      const obj = await getObject(id);
      return obj;
    } catch (error) {
      console.log('Error: ', error);
      return undefined;
    }
  }

  async function insertObject(
    newObject: MMObject
  ): Promise<MMObject | undefined> {
    try {
      const addedObject = await addObject(newObject);
      await readObjects();
      return addedObject;
    } catch (error) {
      return newObject;
    }
  }

  async function updateObject(
    updateData: MMObject
  ): Promise<MMObject | undefined> {
    try {
      const updatedObject = await saveObject(updateData);
      await readObjects();
      return updatedObject;
    } catch (error) {
      return updateData;
    }
  }

  useEffect(() => {
    readObjects();
  }, []);

  return (
    <ObjectsContext.Provider
      value={{ objects, insertObject, readObjects, readObject, updateObject }}
    >
      {children}
    </ObjectsContext.Provider>
  );
}

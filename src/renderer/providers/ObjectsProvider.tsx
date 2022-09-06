import { MMObject } from '@rufrage/metamodel';
import { createContext, useState } from 'react';

export type ObjectsContextContent = {
  objects: MMObject[];
  setObjects: (objects: MMObject[]) => void;
  addObject: (object: MMObject) => void;
};

export const ObjectsContext = createContext<ObjectsContextContent>({
  objects: [],
  setObjects: () => {},
  addObject: () => {},
});

interface ObjectsProviderProps {
  children: JSX.Element | JSX.Element[];
}

export default function ObjectsProvider({ children }: ObjectsProviderProps) {
  const [objects, setObjects] = useState<MMObject[]>([]);

  const addObject = (newObject: MMObject) => {
    setObjects([...objects, newObject]);
  };

  return (
    <ObjectsContext.Provider value={{ objects, setObjects, addObject }}>
      {children}
    </ObjectsContext.Provider>
  );
}

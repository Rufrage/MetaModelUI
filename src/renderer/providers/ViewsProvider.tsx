import { MMView } from '@rufrage/metamodel';
import { createContext, useEffect, useState } from 'react';
import {
  addView,
  getViews,
  getView,
  saveView,
} from 'renderer/services/ViewService';

export type ViewsContextContent = {
  views: MMView[];
  insertView: (view: MMView) => Promise<MMView | undefined>;
  updateView: (view: MMView) => Promise<MMView | undefined>;
  readViews: () => Promise<boolean>;
  readView: (id: string) => Promise<MMView | undefined>;
};

export const ViewsContext = createContext<ViewsContextContent>({
  views: [],
  insertView: () => {
    console.log('insertView Default called.');
    return new Promise((resolve) => resolve(undefined));
  },
  updateView: () => {
    return new Promise((resolve) => resolve(undefined));
  },
  readViews: () => {
    return new Promise((resolve) => resolve(false));
  },
  readView: () => {
    return new Promise((resolve) => resolve(undefined));
  },
});

interface ViewsProviderProps {
  children: JSX.Element | JSX.Element[];
}

export default function ViewsProvider({ children }: ViewsProviderProps) {
  const [views, setViews] = useState<MMView[]>([]);

  async function readViews(): Promise<boolean> {
    try {
      const ViewItems = await getViews();
      setViews(ViewItems);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function readView(id: string): Promise<MMView | undefined> {
    try {
      const obj = await getView(id);
      return obj;
    } catch (error) {
      console.log('Error: ', error);
      return undefined;
    }
  }

  async function insertView(newView: MMView): Promise<MMView | undefined> {
    console.log('insert View implemented called.');
    try {
      const addedView = await addView(newView);
      await readViews();
      return addedView;
    } catch (error) {
      return newView;
    }
  }

  async function updateView(updateData: MMView): Promise<MMView | undefined> {
    try {
      const updatedView = await saveView(updateData);
      await readViews();
      return updatedView;
    } catch (error) {
      return updateData;
    }
  }

  useEffect(() => {
    readViews();
  }, []);

  return (
    <ViewsContext.Provider
      value={{ views, insertView, updateView, readViews, readView }}
    >
      {children}
    </ViewsContext.Provider>
  );
}

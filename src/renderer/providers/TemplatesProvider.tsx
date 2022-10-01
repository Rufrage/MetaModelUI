import { MMObject, MMTemplate } from '@rufrage/metamodel';
import { createContext, useEffect, useState } from 'react';
import {
  addTemplate,
  getTemplates,
  getTemplate,
  saveTemplate,
} from 'renderer/services/TemplateService';

export type TemplatesContextContent = {
  templates: MMTemplate[];
  insertTemplate: (template: MMTemplate) => Promise<MMTemplate | undefined>;
  updateTemplate: (template: MMTemplate) => Promise<MMTemplate | undefined>;
  readTemplates: () => Promise<boolean>;
  readTemplate: (id: string) => Promise<MMTemplate | undefined>;
};

export const TemplatesContext = createContext<TemplatesContextContent>({
  templates: [],
  insertTemplate: () => {
    console.log('Default called');
    return new Promise((resolve) => resolve(undefined));
  },
  updateTemplate: () => {
    return new Promise((resolve) => resolve(undefined));
  },
  readTemplates: () => {
    return new Promise((resolve) => resolve(false));
  },
  readTemplate: () => {
    return new Promise((resolve) => resolve(undefined));
  },
});

interface TemplatesProviderProps {
  children: JSX.Element | JSX.Element[];
}

export default function TemplatesProvider({
  children,
}: TemplatesProviderProps) {
  const [templates, setTemplates] = useState<MMTemplate[]>([]);

  async function readTemplates(): Promise<boolean> {
    try {
      const templateItems = await getTemplates();
      setTemplates(templateItems);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function readTemplate(id: string): Promise<MMTemplate | undefined> {
    try {
      const obj = await getTemplate(id);
      return obj;
    } catch (error) {
      console.log('Error: ', error);
      return undefined;
    }
  }

  async function insertTemplate(
    newTemplate: MMTemplate
  ): Promise<MMTemplate | undefined> {
    console.log('Insert Template..');
    try {
      const addedTemplate = await addTemplate(newTemplate);
      console.log('Added');
      await readTemplates();
      return addedTemplate;
    } catch (error) {
      console.log('Error: ', error);
      return newTemplate;
    }
  }

  async function updateTemplate(
    updateData: MMTemplate
  ): Promise<MMTemplate | undefined> {
    try {
      const updatedTemplate = await saveTemplate(updateData);
      await readTemplates();
      return updatedTemplate;
    } catch (error) {
      return updateData;
    }
  }

  useEffect(() => {
    readTemplates();
  }, []);

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        insertTemplate,
        readTemplates,
        readTemplate,
        updateTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
}

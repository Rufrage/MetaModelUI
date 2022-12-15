/* eslint-disable no-console */
import {
  MMAttributeType,
  MMBuildProfile,
  MMBuildProfileEntry,
  MMObject,
  MMTemplate,
  MMTemplateInputType,
  MMView,
} from '@rufrage/metamodel';
import path from 'path';
import { getSourcePath } from './store';

const ejs = require('ejs');
const fs = require('fs');

function getString4AttributeType(attributeType: MMAttributeType) {
  switch (attributeType) {
    case MMAttributeType.MMString:
      return 'string';
    case MMAttributeType.MMDecimal:
      return 'float';
    case MMAttributeType.MMInteger:
      return 'number';
    default:
      return 'undefined';
  }
}

function generate(
  targetFilePath: string,
  buildProfileEntries: MMBuildProfileEntry[],
  templates: MMTemplate[],
  objects: MMObject[]
): boolean {
  const templateFilePath = path.join(__dirname, '../../../assets/templates/');
  console.log('targetFilePath: ', targetFilePath);
  console.log('templates: ', templates);
  console.log('objects: ', objects);
  console.log('buildProfileEntries: ', buildProfileEntries);

  /**
   * First we build the data object to pass the data to the template
   */
  const data = {
    objects,
    name: 'Janosch',
  };

  /**
   * Now we loop over all build path entries to decide which templates to generate.
   */
  buildProfileEntries?.forEach((buildProfileEntry: MMBuildProfileEntry) => {
    /**
     * We find the required template from the template list
     */
    const template = templates.find(
      (t) => t.id === buildProfileEntry.templateID
    );

    /**
     * The template path is built from the templates base path and the templates individual path
     */
    const templatePath = templateFilePath + template?.filepath;

    /**
     * Now we create the JSON from the template.
     * The object contains a list of result files. Each file contains a target name and the source code.
     */
    ejs.renderFile(templatePath, data, async (err: string, str: string) => {
      if (err?.length > 0) {
        console.log(`[generate] err: ${err}`);
      }
      if (str?.length > 0) {
        const obj = JSON.parse(str);
        if (obj && obj.output && obj.output.length > 0 && targetFilePath) {
          obj.output.forEach((file: { filename: any; src: any }) => {
            const targetPath = targetFilePath + file.filename;
            const src = file.src?.join('\n');

            fs.writeFileSync(targetPath, src, 'utf8');
          });
        }
      }
    });
  });

  return true;
}
export { generate, getString4AttributeType };

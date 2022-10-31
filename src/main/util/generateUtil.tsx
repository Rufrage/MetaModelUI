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
  templateFilePath: string,
  buildProfile: MMBuildProfile,
  templates: Map<string, MMTemplate>,
  objects: Map<string, MMObject>,
  views: Map<string, MMView>
) {
  // Set enums
  const enums = new Map();
  enums.set('MMAttributeType', MMAttributeType);

  // Loop over all BuildPathEntries and generate each
  buildProfile.buildProfileEntries.forEach(
    (buildProfileEntry: MMBuildProfileEntry) => {
      // First we check, if this buildProfileEntry is active as the associated template exists
      const template = templates.get(buildProfileEntry.templateID);
      if (!buildProfileEntry.active || !template) {
        return;
      }
      // Next, we check the input types for this template
      switch (template.objectInputType) {
        case MMTemplateInputType.None:
          // Nothing to do here
          break;
        case MMTemplateInputType.Single:
          // TODO The template will be printed for every object
          break;
        case MMTemplateInputType.Multi:
          // TODO All objects will be passed to the template at once
          break;
        default:
          // Nothing to do here
          break;
      }
    }
  );

  const data = {
    getString4AttributeType,
    object: null,
    enums,
  };

  ejs.renderFile(templateFilePath, data, async (err: string, str: string) => {
    if (err) {
      console.log(`[generate] err: ${err}`);
    }
    if (str) {
      const targetDirectory = await getSourcePath();
      if (targetDirectory) {
        // const filePath = `${targetDirectory}\\${obj.name}.tsx`;
        const filePath = `${targetDirectory}\\filename.tsx`;
        fs.writeFileSync(filePath, str, 'utf8');
      }
    }
  });
}

export { generate, getString4AttributeType };

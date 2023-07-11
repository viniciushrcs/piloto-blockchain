import { mkdirSync, promises as fs } from 'fs';
import { join } from 'path';
import ejs from 'ejs';

async function createYamlFromTemplate(templatePath, outputPath, replacements) {
  const templateContent = await fs.readFile(join(templatePath), 'utf-8');
  const updatedTemplate = ejs.render(templateContent, replacements);
  await fs.writeFile(join(outputPath), updatedTemplate);
}

function createDirectories(destFolders) {
  for (const key in destFolders) {
    mkdirSync(destFolders[key], { recursive: true });
  }
}

export { createYamlFromTemplate, createDirectories };

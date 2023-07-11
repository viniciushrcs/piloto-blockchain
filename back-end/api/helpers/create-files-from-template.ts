import { promises as fs } from 'fs';
import { createYamlFromTemplate } from './generate-yaml';
import { join } from 'path';
import {
  CommonFileNames,
  OrdFilesNames,
  PeerFilesNames,
} from '../interfaces/file-names.interface';

/**
 * Create files from templates in a source directory.
 *
 * @param {string} sourceDir - The source directory containing the template files.
 * @param {string} destDir - The destination directory to save the generated files.
 * @param {{ [key: string]: string }} finalFilesPath - An object that maps template names to their final file paths.
 * @param {Replacements} replacements - An object containing the replacement values for the template placeholders.
 * @param {number | null} [peerOrgIndex=null] - The index of the peer organization, if applicable.
 */

type FinalFilesPath = CommonFileNames | OrdFilesNames | PeerFilesNames;
interface Replacements {
  [key: string]: string | number | string[] | number[];
}
export async function createFilesFromTemplates(
  sourceDir: string,
  destDir: string,
  finalFilesPath: FinalFilesPath,
  replacements: Replacements,
  peerOrgIndex: number | null = null
) {
  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const filePath = join(sourceDir, file);
    const match = /^(.+)\.ejs$/.exec(file);

    if ((await fs.stat(filePath)).isFile()) {
      if (match) {
        if (peerOrgIndex !== null) {
          replacements.peerOrgIndex = peerOrgIndex;
        }
        await createYamlFromTemplate(
          filePath,
          join(destDir, finalFilesPath[`${match[1]}`]),
          replacements
        );
      }
    }
  }
}

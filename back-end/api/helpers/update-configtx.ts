import ejs from 'ejs';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function updateConfigtx(profileName: string, peerOrgs: string[]) {
  const template = await fs.readFile(
    join(__dirname, '../templates/configtx-profiles-template.ejs'),
    'utf-8'
  );
  const data = { profileName, peerOrgs };
  const newProfile = ejs.render(template, data);
  const result = await fs.appendFile(
    join(__dirname, '../../build/configtx.yaml'),
    '\n' + newProfile
  );
  console.log(result);
}

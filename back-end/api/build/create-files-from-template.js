"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFilesFromTemplates = void 0;
const fs_1 = require("fs");
const generate_yaml_1 = require("./generate-yaml");
const path_1 = require("path");
async function createFilesFromTemplates(sourceDir, destDir, finalFilesPath, replacements, peerOrgIndex = null) {
    const files = await fs_1.promises.readdir(sourceDir);
    for (const file of files) {
        const filePath = (0, path_1.join)(sourceDir, file);
        const match = /^(.+)\.ejs$/.exec(file);
        if ((await fs_1.promises.stat(filePath)).isFile()) {
            if (match) {
                if (peerOrgIndex !== null) {
                    replacements.peerOrgIndex = peerOrgIndex;
                }
                await (0, generate_yaml_1.createYamlFromTemplate)(filePath, (0, path_1.join)(destDir, finalFilesPath[`${match[1]}`]), replacements);
            }
        }
    }
}
exports.createFilesFromTemplates = createFilesFromTemplates;
//# sourceMappingURL=create-files-from-template.js.map
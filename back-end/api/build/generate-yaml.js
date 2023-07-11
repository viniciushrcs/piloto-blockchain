"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectories = exports.createYamlFromTemplate = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const ejs_1 = __importDefault(require("ejs"));
async function createYamlFromTemplate(templatePath, outputPath, replacements) {
    const templateContent = await fs_1.promises.readFile((0, path_1.join)(templatePath), 'utf-8');
    const updatedTemplate = ejs_1.default.render(templateContent, replacements);
    await fs_1.promises.writeFile((0, path_1.join)(outputPath), updatedTemplate);
}
exports.createYamlFromTemplate = createYamlFromTemplate;
function createDirectories(destFolders) {
    for (const key in destFolders) {
        (0, fs_1.mkdirSync)(destFolders[key], { recursive: true });
    }
}
exports.createDirectories = createDirectories;
//# sourceMappingURL=generate-yaml.js.map
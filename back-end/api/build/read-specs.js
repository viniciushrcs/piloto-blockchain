"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAndProcessSpecs = void 0;
const fs_1 = __importDefault(require("fs"));
function readAndProcessSpecs(filePath) {
    if (!filePath) {
        return;
    }
    try {
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`Erro ao ler ou processar o arquivo JSON: ${error}`);
    }
}
exports.readAndProcessSpecs = readAndProcessSpecs;
//# sourceMappingURL=read-specs.js.map
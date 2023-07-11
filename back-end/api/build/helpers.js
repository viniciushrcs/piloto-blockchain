"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = exports.print_help = exports.logging_init = void 0;
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
function logging_init() {
    const logStream = fs_1.default.createWriteStream('./src/network.log', { flags: 'w' });
    const debugStream = fs_1.default.createWriteStream('./src/network-debug.log', {
        flags: 'w',
    });
    const logFile = fs_1.default.createWriteStream('./src/network.log', { flags: 'a' });
    const debugLogger = (data) => debugStream.write(data);
    const logLogger = (data) => {
        logStream.write(data);
        logFile.write(data);
    };
    console.log = (data) => {
        process.stdout.write(data);
        logLogger(data);
    };
    console.error = (data) => {
        process.stderr.write(data);
        debugLogger(data);
    };
}
exports.logging_init = logging_init;
function print_help() {
    console.log('--- Fabric Information');
    console.log(`Fabric Version        \t: ${process.env.FABRIC_VERSION}`);
    console.log(`Fabric CA Version     \t: ${process.env.FABRIC_CA_VERSION}`);
    console.log(`Container Registry \t: ${process.env.FABRIC_CONTAINER_REGISTRY}`);
    console.log(`Network name \t: ${process.env.NETWORK_NAME}`);
    console.log(`Ingress domain \t: ${process.env.DOMAIN}`);
    console.log(`Channel name \t: ${process.env.CHANNEL_NAME}`);
    console.log('--- Cluster Information');
    console.log(`Cluster runtime \t: ${process.env.CLUSTER_RUNTIME}`);
    console.log(`Cluster name \t: ${process.env.CLUSTER_NAME}`);
    console.log(`Cluster namespace \t: ${process.env.NS}`);
    console.log(`Fabric Registry \t: ${process.env.FABRIC_CONTAINER_REGISTRY}`);
    console.log(`Local Registry \t: ${process.env.LOCAL_REGISTRY_NAME}`);
    console.log(`Local Registry port \t: ${process.env.LOCAL_REGISTRY_PORT}`);
    console.log(`nginx http port \t: ${process.env.NGINX_HTTP_PORT}`);
    console.log(`nginx https port \t: ${process.env.NGINX_HTTPS_PORT}`);
    console.log('--- Script Information');
    console.log(`Log file \t: ${process.env.LOG_FILE}`);
    console.log(`Debug log file \t: ${process.env.DEBUG_FILE}`);
}
exports.print_help = print_help;
async function executeCommand(commands) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(commands.join(' && '), { shell: '/bin/bash' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing function: ${error}`);
                reject(error);
            }
            else {
                console.log(stdout, stderr);
                resolve();
            }
        });
    });
}
exports.executeCommand = executeCommand;
//# sourceMappingURL=helpers.js.map
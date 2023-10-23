import fs from 'fs';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

export function generateRandomId() {
  return uuidv4();
}

export function logging_init() {
  const logStream = fs.createWriteStream('./src/network.log', { flags: 'w' });
  const debugStream = fs.createWriteStream('./src/network-debug.log', {
    flags: 'w',
  });
  const logFile = fs.createWriteStream('./src/network.log', { flags: 'a' });

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

export function print_help() {
  console.log('--- Fabric Information');
  console.log(`Fabric Version        \t: ${process.env.FABRIC_VERSION}`);
  console.log(`Fabric CA Version     \t: ${process.env.FABRIC_CA_VERSION}`);
  console.log(
    `Container Registry \t: ${process.env.FABRIC_CONTAINER_REGISTRY}`
  );
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

export async function executeCommand(commands: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = [];
    const command = commands.join(' && ');
    const process = spawn(command, { shell: '/bin/bash' });

    process.stdout.on('data', (data) => {
      console.log(data.toString());
      output.push(data.toString());
    });

    process.stderr.on('data', (data) => {
      console.error(data.toString());
      output.push(data.toString());
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output.join(''));
      } else {
        reject(
          new Error(
            `Process exited with code: ${code}, Output: ${output.join('')}`
          )
        );
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

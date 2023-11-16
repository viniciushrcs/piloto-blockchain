import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

export function generateRandomId() {
  return uuidv4();
}

export function generateNetworkName() {
  const networkName = generateRandomId();
  process.env.NETWORK_NAME = networkName;
}

export function updateNetworkName(networkName: string) {
  process.env.NETWORK_NAME = networkName;
}

export function resetNetworkName() {
  process.env.NETWORK_NAME = '';
}

export function getNetworkName() {
  return process.env.NETWORK_NAME;
}

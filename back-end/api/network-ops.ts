import { executeCommand } from './helpers/helpers';
import { updateConfigtx } from './helpers/update-configtx';

export async function kind() {
  await executeCommand(['../network kind']);
}

export async function unkind() {
  await executeCommand(['../network unkind']);
}

export async function cluster() {
  await executeCommand(['../network cluster']);
}

export async function up(specs) {
  const peerOrgsArgs = specs.peerOrganizations
    .map((org) => `${org.name}:${org.peers.join(',')}`)
    .join(' ');
  await executeCommand([
    `../network up ${specs.ordererOrganization} ${peerOrgsArgs}`,
  ]);
  await createChannel({ ...specs, channelName: 'channeldefault' }, true);
}

export async function down() {
  await executeCommand([`../network down`]);
}

export async function createChannel(specs, isDefault = false) {
  const peerOrgsArgs = specs.peerOrganizations
    .map((org) => `${org.name}:${org.peers.join(',')}`)
    .join(' ');
  const peerOrgs = specs.peerOrganizations.map((org) => org.name);
  const peerOrgsList = specs.peerOrganizations.map((org) => org.name).join(' ');

  if (isDefault) {
    await executeCommand([
      `../network channel configtx ${specs.channelName} ${specs.ordererOrganization} ${peerOrgsList}`,
    ]);
    await executeCommand([
      `../network channel create ${specs.channelName} ${specs.ordererOrganization} ${peerOrgsArgs}`,
    ]);
    return;
  }
  const profileName = `${specs.channelName}Profile`;
  await updateConfigtx(profileName, peerOrgs);
  await executeCommand([
    `../network channel create ${specs.channelName} ${specs.ordererOrganization} ${peerOrgsArgs}`,
  ]);
}

export async function chaincodeDeploy(specs, selectedOrganization = null) {
  const { channelName, ordererOrganization, peerOrganizations, chaincodeName } =
    specs;

  let orgsToDeploy = peerOrganizations;

  if (selectedOrganization) {
    orgsToDeploy = peerOrganizations.filter(
      (org) => org.name === selectedOrganization
    );
  }

  const peerOrgsInfo = orgsToDeploy.map(
    (org) => `${org.name}:${org.peers.join(',')}`
  );
  const peerOrgsName = orgsToDeploy.map((org) => `${org.name}`);

  let chaincodeCommited = false;
  let i = 0;
  for (const peerOrg of peerOrgsName) {
    console.log(
      `Deploying chaincode for org ${peerOrg} and ${peerOrgsInfo[i]}`
    );
    await executeCommand([
      `../network chaincode deploy ${channelName} ${chaincodeName} ${chaincodeName} ${chaincodeCommited} ${ordererOrganization} ${peerOrg} ${peerOrgsInfo[i]}`,
    ]);
    chaincodeCommited = true;
    i++;
  }
}

export async function chaincodeInvoke(specs, selectedOrganization = null) {
  const chaincodeInvokeCommandParsed = JSON.stringify(
    specs.chaincodeCommand.init
  );

  const targetOrg = selectedOrganization || specs.peerOrganizations[0].name;

  await executeCommand([
    `../network chaincode invoke ${specs.channelName} ${specs.chaincodeName} '${chaincodeInvokeCommandParsed}' ${specs.ordererOrganization} ${targetOrg}`,
  ]);
}

export async function chaincodeQuery(specs, selectedOrganization = null) {
  const { channelName, ordererOrganization, chaincodeName } = specs;
  const chaincodeQueryCommandParsed = JSON.stringify(
    specs.chaincodeCommand.query
  );

  if (selectedOrganization) {
    await executeCommand([
      `../network chaincode query ${channelName} ${chaincodeName} '${chaincodeQueryCommandParsed}' ${ordererOrganization} ${selectedOrganization}`,
    ]);
  } else {
    const peerOrgsArgs = specs.peerOrganizations.map((org) => `${org.name}`);
    const ret = [];
    for (const peerOrg of peerOrgsArgs) {
      const response = await executeCommand([
        `../network chaincode query ${channelName} ${chaincodeName} '${chaincodeQueryCommandParsed}' ${ordererOrganization} ${peerOrg}`,
      ]);
      console.log(response);
      ret.push(response);
    }
    return ret;
  }
}

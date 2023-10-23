#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

function launch_orderers() {
  push_fn "Launching orderers"

  apply_template kube/${NETWORK_NAME}/$1/$1-orderer1.yaml $NETWORK_NAME

  kubectl -n $NETWORK_NAME rollout status deploy/$1-orderer1

  pop_fn
}

function launch_peers() {
  local PEER_ORGS_INFO=("$@")

  push_fn "Launching peers"

  for PEER_ORG_INFO in "${PEER_ORGS_INFO[@]}"; do
    IFS=':' read -ra PEER_ORG_ARRAY <<< "${PEER_ORG_INFO}"
    local PEER_ORG="${PEER_ORG_ARRAY[0]}"
    IFS=',' read -ra PEERS <<< "${PEER_ORG_ARRAY[1]}"
    for PEER in "${PEERS[@]}"; do
      apply_template kube/${NETWORK_NAME}/$PEER_ORG/$PEER_ORG-$PEER.yaml $NETWORK_NAME
      kubectl -n $NETWORK_NAME rollout status deploy/$PEER_ORG-$PEER
    done
  done

  pop_fn
}

# Each network node needs a registration, enrollment, and MSP config.yaml
function create_node_local_MSP() {
  local node_type=$1
  local org=$2
  local node=$3
  local csr_hosts=$4
  local ns=$5
  local id_name=${org}-${node}
  local id_secret=${node_type}pw
  local ca_name=${org}-ca
  # Register the node admin
  rc=0
  fabric-ca-client  register \
    --id.name       ${id_name} \
    --id.secret     ${id_secret} \
    --id.type       ${node_type} \
    --url           https://${ca_name}.${DOMAIN} \
    --tls.certfiles $TEMP_DIR/cas/${ca_name}/tlsca-cert.pem \
    --mspdir        $TEMP_DIR/enrollments/${org}/users/${RCAADMIN_USER}/msp \
    || rc=$?        # trap error code from registration without exiting the network driver script"

  if [ $rc -eq 1 ]; then
    echo "CA admin was (probably) previously registered - continuing"
  fi

  # Enroll the node admin user from within k8s.  This will leave the certificates available on a volume share in the
  # cluster for access by the nodes when launching in a container.
  cat <<EOF | kubectl -n ${ns} exec deploy/${ca_name} -i -- /bin/sh

  set -x
  export FABRIC_CA_CLIENT_HOME=/var/hyperledger/fabric-ca-client
  export FABRIC_CA_CLIENT_TLS_CERTFILES=/var/hyperledger/fabric/config/tls/ca.crt

  fabric-ca-client enroll \
    --url https://${id_name}:${id_secret}@${ca_name} \
    --csr.hosts ${csr_hosts} \
    --mspdir /var/hyperledger/fabric/organizations/${node_type}Organizations/${org}.example.com/${node_type}s/${id_name}.${org}.example.com/msp

  # Create local MSP config.yaml
  echo "NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/${org}-ca.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/${org}-ca.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/${org}-ca.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/${org}-ca.pem
      OrganizationalUnitIdentifier: orderer" > /var/hyperledger/fabric/organizations/${node_type}Organizations/${org}.example.com/${node_type}s/${id_name}.${org}.example.com/msp/config.yaml
EOF
}

function create_orderer_local_MSP() {
  local org=$1
  local orderer=$2
  local csr_hosts=${org}-${orderer}

  create_node_local_MSP orderer $org $orderer $csr_hosts $NETWORK_NAME
}

function create_peer_local_MSP() {
  local org=$1
  local peer=$2
  local ns=$3
  local csr_hosts=localhost,${org}-${peer},${org}-peer-gateway-svc

  create_node_local_MSP peer $org $peer $csr_hosts ${ns}
}

function create_local_MSP() {
  ORD_ORG=$1
  shift
  PEER_ORGS_INFO=("$@")

  push_fn "Creating local node MSP"
  create_orderer_local_MSP $ORD_ORG orderer1

  for PEER_ORG_INFO in "${PEER_ORGS_INFO[@]}"; do
    IFS=':' read -ra PEER_ORG_ARRAY <<< "${PEER_ORG_INFO}"
    local PEER_ORG="${PEER_ORG_ARRAY[0]}"
    IFS=',' read -ra PEERS <<< "${PEER_ORG_ARRAY[1]}"
    for PEER in "${PEERS[@]}"; do
      create_peer_local_MSP $PEER_ORG $PEER $NETWORK_NAME
    done
  done

  pop_fn
}

function network_up() {
  local ORD_ORG="$1"
  shift # Remove o primeiro argumento (ORD_ORG) da lista de argumentos
  local PEER_ORGS_INFO=("$@")
  
   # Separando o nome da organização e um array de pares
  local PEER_ORGS=()
  for PEER_ORG_INFO in "${PEER_ORGS_INFO[@]}"; do
    IFS=':' read -ra PEER_ORG_ARRAY <<< "${PEER_ORG_INFO}"
    local PEER_ORG="${PEER_ORG_ARRAY[0]}"
    PEER_ORGS+=("$PEER_ORG")
  done

  # Kube config
  update_configmap $NETWORK_NAME
  push_fn $NETWORK_NAME
  init_namespace
  init_storage_volumes $ORD_ORG "${PEER_ORGS[@]}"
  load_org_config $ORD_ORG "${PEER_ORGS[@]}"

  # Service account permissions for the k8s builder
  if [ "${CHAINCODE_BUILDER}" == "k8s" ]; then
    apply_k8s_builder_roles
    for PEER_ORG in "${PEER_ORGS[@]}"; do
      apply_k8s_builders $PEER_ORG
    done
  fi

  # Network TLS CAs
  init_tls_cert_issuers $ORD_ORG "${PEER_ORGS[@]}"

  # Network ECert CAs
  launch_ECert_CAs $ORD_ORG "${PEER_ORGS[@]}"
  enroll_bootstrap_ECert_CA_users $ORD_ORG "${PEER_ORGS[@]}"

  # Test Network
  create_local_MSP $ORD_ORG "${PEER_ORGS_INFO[@]}"

  launch_orderers $ORD_ORG
  launch_peers "${PEER_ORGS_INFO[@]}"
}

function stop_services() {
  push_fn "Stopping Fabric services"
  for ns in $NETWORK_NAME $NETWORK_NAME; do
    kubectl -n $ns delete ingress --all
    kubectl -n $ns delete deployment --all
    kubectl -n $ns delete pod --all
    kubectl -n $ns delete service --all
    kubectl -n $ns delete configmap --all
    kubectl -n $ns delete cert --all
    kubectl -n $ns delete issuer --all
    kubectl -n $ns delete secret --all
  done

  pop_fn
}

function scrub_org_volumes() {
  ORD_ORG=$1
  PEER_ORG=$2

  push_fn "Scrubbing Fabric volumes"
  for org in $PEER_ORG $ORD_ORG; do
    # clean job to make this function can be rerun
    local namespace_variable=${org^^}_NS
    kubectl -n ${!namespace_variable} delete jobs --all

    # scrub all pv contents
    kubectl -n ${!namespace_variable} create -f kube/${org}/${org}-job-scrub-fabric-volumes.yaml
    kubectl -n ${!namespace_variable} wait --for=condition=complete --timeout=60s job/job-scrub-fabric-volumes
    kubectl -n ${!namespace_variable} delete jobs --all
  done
  pop_fn
}

function network_down() {

  set +e
  for ns in $NETWORK_NAME $NETWORK_NAME; do
    kubectl get namespace $ns > /dev/null
    if [[ $? -ne 0 ]]; then
      echo "No namespace $ns found - nothing to do."
      return
    fi
  done
  set -e

  stop_services
  scrub_org_volumes $1 $2

  delete_namespace

  rm -rf $PWD/build
}

#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

function launch_ECert_CAs() {
  push_fn "Launching Fabric CAs"
  ORD_ORG=$1
  shift
  PEER_ORGS=("$@")

  apply_template kube/$ORD_ORG/$ORD_ORG-ca.yaml $ORG0_NS

  for PEER_ORG in "${PEER_ORGS[@]}"; do
    apply_template kube/$PEER_ORG/$PEER_ORG-ca.yaml $ORG1_NS
    kubectl -n $ORG1_NS rollout status deploy/$PEER_ORG-ca
  done

  kubectl -n $ORG0_NS rollout status deploy/$ORD_ORG-ca

  # todo: this papers over a nasty bug whereby the CAs are ready, but sporadically refuse connections after a down / up
  sleep 5
  pop_fn
}

# experimental: create TLS CA issuers using cert-manager for each org.
function init_tls_cert_issuers() {
  ORD_ORG=$1
  shift 
  PEER_ORGS=("$@")

  push_fn "Initializing TLS certificate Issuers"

  # Create a self-signing certificate issuer / root TLS certificate for the blockchain.
  # TODO : Bring-Your-Own-Key - allow the network bootstrap to read an optional ECDSA key pair for the TLS trust root CA.
  kubectl -n $ORG0_NS apply -f kube/root-tls-cert-issuer.yaml
  kubectl -n $ORG0_NS wait --timeout=30s --for=condition=Ready issuer/root-tls-cert-issuer

  for PEER_ORG in "${PEER_ORGS[@]}"; do
    kubectl -n $ORG1_NS apply -f kube/root-tls-cert-issuer.yaml
    kubectl -n $ORG1_NS wait --timeout=30s --for=condition=Ready issuer/root-tls-cert-issuer

    # Use the self-signing issuer to generate an Issuer for each org.
    kubectl -n $ORG1_NS apply -f kube/$PEER_ORG/$PEER_ORG-tls-cert-issuer.yaml
    kubectl -n $ORG1_NS wait --timeout=30s --for=condition=Ready issuer/$PEER_ORG-tls-cert-issuer
  done

  kubectl -n $ORG0_NS apply -f kube/$ORD_ORG/$ORD_ORG-tls-cert-issuer.yaml
  kubectl -n $ORG0_NS wait --timeout=30s --for=condition=Ready issuer/$ORD_ORG-tls-cert-issuer

  pop_fn
}

function enroll_bootstrap_ECert_CA_user() {
  local org=$1
  local ns=$2

  # Determine the CA information and TLS certificate
  CA_NAME=${org}-ca
  CA_DIR=${TEMP_DIR}/cas/${CA_NAME}
  mkdir -p ${CA_DIR}

  # Read the CA's TLS certificate from the cert-manager CA secret
  echo "retrieving ${CA_NAME} TLS root cert"
  kubectl -n $ns get secret ${CA_NAME}-tls-cert -o json \
    | jq -r .data.\"ca.crt\" \
    | base64 -d \
    > ${CA_DIR}/tlsca-cert.pem

  # Enroll the root CA user
  fabric-ca-client enroll \
    --url https://${RCAADMIN_USER}:${RCAADMIN_PASS}@${CA_NAME}.${DOMAIN}:${NGINX_HTTPS_PORT} \
    --tls.certfiles $TEMP_DIR/cas/${CA_NAME}/tlsca-cert.pem \
    --mspdir $TEMP_DIR/enrollments/${org}/users/${RCAADMIN_USER}/msp
}

function enroll_bootstrap_ECert_CA_users() {
  ORD_ORG=$1
  shift
  PEER_ORGS=("$@")

  push_fn "Enrolling bootstrap ECert CA users"

  enroll_bootstrap_ECert_CA_user $ORD_ORG $ORG0_NS

  for PEER_ORG in "${PEER_ORGS[@]}"; do
    enroll_bootstrap_ECert_CA_user $PEER_ORG $ORG1_NS
  done

  pop_fn
}
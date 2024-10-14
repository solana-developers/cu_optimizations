#!/usr/bin/env bash

PROGRAM_NAME="$1"
ROOT_DIR="$(cd "$(dirname "$0")"; pwd)"
set -e
PROGRAM_DIR=$ROOT_DIR/$PROGRAM_NAME
make
SBF_OUT_DIR="out" cargo test --manifest-path "Cargo.toml" 

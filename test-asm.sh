#!/usr/bin/env bash

PROGRAM_NAME="$1"
ROOT_DIR="$(cd "$(dirname "$0")"; pwd)"
set -e
PROGRAM_DIR=$ROOT_DIR/$PROGRAM_NAME
cd $PROGRAM_DIR/asm
make
SBF_OUT_DIR="$PROGRAM_DIR/asm/out" cargo test --manifest-path "$PROGRAM_DIR/Cargo.toml"


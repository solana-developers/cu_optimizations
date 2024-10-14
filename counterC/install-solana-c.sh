#!/usr/bin/env bash

if [[ -n $SOLANA_VERSION ]]; then
  solana_version="$SOLANA_VERSION"
else
  solana_version="v2.0.8"
fi

output_dir="$1"
if [[ -z $output_dir ]]; then
  output_dir="solana-c-sdk"
fi
output_dir="$(mkdir -p "$output_dir"; cd "$output_dir"; pwd)"
cd $output_dir

sdk_tar="sbf-sdk.tar.bz2"
sdk_release_url="https://github.com/anza-xyz/agave/releases/download/$solana_version/$sdk_tar"
echo "Downloading $sdk_release_url"
curl --proto '=https' --tlsv1.2 -SfOL "$sdk_release_url"
echo "Unpacking $sdk_tar"
tar -xjf $sdk_tar
rm $sdk_tar

# Install platform-tools
mv sbf-sdk/* .
rmdir sbf-sdk
./scripts/install.sh
echo "solana-c compiler available at $output_dir"

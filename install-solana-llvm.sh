#!/usr/bin/env bash

if [[ -n $SOLANA_TOOLS_VERSION ]]; then
  solana_tools_version="$SOLANA_TOOLS_VERSION"
else
  solana_tools_version="v1.43.1"
fi
release_url="https://github.com/joncinque/solana-zig-bootstrap/releases/download/solana-$solana_tools_version"

output_dir="$1"
if [[ -z $output_dir ]]; then
  output_dir="solana-llvm"
fi
output_dir="$(mkdir -p "$output_dir"; cd "$output_dir"; pwd)"
cd $output_dir

arch=$(uname -m)
if [[ "$arch" == "arm64" ]]; then
  arch="aarch64"
fi
case $(uname -s | cut -c1-7) in
"Linux")
  os="linux"
  abi="musl"
  ;;
"Darwin")
  os="macos"
  abi="none"
  ;;
"Windows" | "MINGW64")
  os="windows"
  abi="gnu"
  ;;
*)
  echo "install-solana-llvm.sh: Unknown OS $(uname -s)" >&2
  exit 1
  ;;
esac

solana_llvm_tar=llvm-$arch-$os-$abi.tar.bz2
url="$release_url/$solana_llvm_tar"
echo "Downloading $url"
curl --proto '=https' --tlsv1.2 -SfOL "$url"
echo "Unpacking $solana_llvm_tar"
tar -xjf $solana_llvm_tar
rm $solana_llvm_tar

solana_llvm_dir="llvm-$arch-$os-$abi-baseline"
mv "$solana_llvm_dir"/* .
rmdir $solana_llvm_dir

echo "PHDRS
{
  text PT_LOAD  ;
  rodata PT_LOAD ;
  data PT_LOAD ;
  dynamic PT_DYNAMIC ;
}

SECTIONS
{
  . = SIZEOF_HEADERS;
  .text : { *(.text*) } :text
  .rodata : { *(.rodata*) } :rodata
  .data.rel.ro : { *(.data.rel.ro*) } :rodata
  .dynamic : { *(.dynamic) } :dynamic
  .dynsym : { *(.dynsym) } :data
  .dynstr : { *(.dynstr) } :data
  .rel.dyn : { *(.rel.dyn) } :data
  /DISCARD/ : {
      *(.eh_frame*)
      *(.gnu.hash*)
      *(.hash*)
    }
}" > sbf.ld
echo "solana-llvm tools available at $output_dir"

This counter example was created using the Assembly Tools written by Jon Cinque: https://github.com/joncinque/solana-program-rosetta?tab=readme-ov-file#assembly

# How to run 

cd counterAsm 

./install-solana-llvm.sh

cd asm 

make 

cd ..

Run tests: 
./test-asm.sh counterAsm
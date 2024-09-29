.globl entrypoint

entrypoint:
  ldxdw r2, [r1 + 0] # The first byte of the payload in r1 holds the amount of accounts 
  jne r2, 2, error   # we make sure here we have two. First one will be the counter (for easy access) and second one the signer

  ldxdw r3, [r1 + 8 + 8 + 32 + 32 + 8] # accountNumber, 8byte flags(signer, writable, executable), account key, owner, lamports, dataSize, data
  # You can see the exact account layout here: https://solana.com/docs/programs/faq#input-parameter-serialization
  jne r3, 8, error # Here we check if the instruction data is exactly 8 for our u64 counter

  mov64 r4, r1 # Move all to r4             
  add64 r4, 8 + 8 + 32 + 32 + 8 + 8 # Access the data fiel which holds our u64 value           
  ldxdw r5, [r4 + 0] # Move data to r5        

  add64 r5, 1 # Add 1               

  stxdw [r4 +0], r5 # write it back into the data field

  exit

error:
  mov64 r0, 1 # Set an error in r0 
	exit
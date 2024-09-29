.globl entrypoint

entrypoint:
  ldxdw r2, [r1 + 0] # The first byte of the payload in r1 holds the amount of accounts 
  jne r2, 2, error   # we make sure here we have two. First one will be the counter (for easy access) and second one the signer

  ldxdw r3, [r1 + 8 + 8 + 32 + 32 + 8] # accountNumber, 8byte flags(signer, writable, executable), account key, owner, lamports, dataSize, data
  # You can see the exact account layout here: https://solana.com/docs/programs/faq#input-parameter-serialization
  jne r3, 8, error # Here we check if the account data is exactly 8 byte for one u64 

  ldxdw r4, [r1 + 8 + 8 + 32 + 32 + 8 + 8] // Put the account data into R4 
  add64 r4, 1 // increase counter by one 
  stxdw [r1 + 8 + 8 + 32 + 32 + 8 + 8], r4 / write data back to account

  jne r4, 1, error // Check if counter is 1 

  exit

error:
  mov64 r0, 1 # Set an error in r0 
	exit



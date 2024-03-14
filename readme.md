# Optimizing CU in programs 

## Introduction

By default every transaction on solana requests 200.000 CUs. 
With the call setComputeLimit this can be increased to a maximum of 1.4 million and the blockspace limit is 48 million CU and 12M CU/account write lock/slot.


```js
  const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 200_000,
  });

```

There can also be priority fees which can be set like this: 

```js
  const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });
```

// TODO: calculate this correctly 
This means for every requested CU, 1 microLamport is paid. This would result in a fee of 0.2 lamports.
These instructions can be put into a transaction at any position.

```js
const transaction = new Transaction().add(computePriceIx, computeLimitIx, ...);
```

Find Compute Budget code here: 
https://github.com/solana-labs/solana/blob/090e11210aa7222d8295610a6ccac4acda711bb9/program-runtime/src/compute_budget.rs#L26-L87


Blocks are packed using the real CU used and not the requested CU.




Things to Optimize 

- Logging 
- Error Handling
- Unsave Math 
- Borsh 
- Closures 
- Memory Allocation
- Inlining 
- CPIs 25k 

# Optimizing CU in programs

## Introduction

Every block on Solana has a blockspace limit of 48 million CUs and a 12 million CUs per account write lock. If you exhaust the CU limit your transaction will fail. Optimizing your program CUs has many advantages.

Currently every transactions on Solana costs 5000 lamports per signature independant on the compute units used.
Four reasons on why to optimize CU anyway:

1. A smaller transaction is more likely to be included in a block.
2. Currently every transaction costs 5000 lamports/sig no matter the CU. This may change in the future. Better be prepared.
3. It makes your program more composable, because when another program does a CPI in your program it also need to cover your CU.
4. More block space for every one. One block could theoretically hold around tens of thousands of simple transfer transactions for example. So the less intensive each transaction is the more we can get in a block.

By default every transaction on solana requests 200.000 CUs.
With the call setComputeLimit this can be increased to a maximum of 1.4 million.

If you are only doing a simple transfer, you can set the CU limit to 300 for example.

```js
const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300,
});
```

There can also be priority fees which can be set like this:

```js
const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1,
});
```

This means for every requested CU, 1 microLamport is paid. This would result in a fee of 0.2 lamports.
These instructions can be put into a transaction at any position.

```js
const transaction = new Transaction().add(computePriceIx, computeLimitIx, ...);
```

Find Compute Budget code here:
https://github.com/solana-labs/solana/blob/090e11210aa7222d8295610a6ccac4acda711bb9/program-runtime/src/compute_budget.rs#L26-L87

Blocks are packed using the real CU used and not the requested CU.

There may be a CU cost to loaded account size as well soon with a maximum of 16.000 CU which would be charges heap space at rate of 8cu per 32K. (Max loaded accounts per transaction is 64Mb)
https://github.com/solana-labs/solana/issues/29582

## How to measure CU

The best way to measure CU is to use the solana program log.

For that you can use this macro:

```rust
/// Total extra compute units used per compute_fn! call 409 CU
/// https://github.com/anza-xyz/agave/blob/d88050cda335f87e872eddbdf8506bc063f039d3/programs/bpf_loader/src/syscalls/logging.rs#L70
/// https://github.com/anza-xyz/agave/blob/d88050cda335f87e872eddbdf8506bc063f039d3/program-runtime/src/compute_budget.rs#L150
#[macro_export]
macro_rules! compute_fn {
    ($msg:expr=> $($tt:tt)*) => {
        ::solana_program::msg!(concat!($msg, " {"));
        ::solana_program::log::sol_log_compute_units();
        let res = { $($tt)* };
        ::solana_program::log::sol_log_compute_units();
        ::solana_program::msg!(concat!(" } // ", $msg));
        res
    };
}
```

You put it in front and after the code block you want to measure like so:

```rust

compute_fn!("My message" => {
    // Your code here
});

```

Then you can paste the logs into chatGPT and let i calculate the CU for you if you dont want to do it yourself.
Here is the original from @thlorenz https://github.com/thlorenz/sol-contracts/blob/master/packages/sol-common/rust/src/lib.rs

# Optimizations

## 1 Logging

Logging is very expensive. Especially logging pubkeys and concatenating strings. Use pubkey.log instead if you need it and only log what is really necessary.

```rust
// 11962 CU !!
// Base58 encoding is expensive, concatenation is expensive
compute_fn! { "Log a pubkey to account info" =>
    msg!("A string {0}", ctx.accounts.counter.to_account_info().key());
}

// 262 cu
compute_fn! { "Log a pubkey" =>
    ctx.accounts.counter.to_account_info().key().log();
}

let pubkey = ctx.accounts.counter.to_account_info().key();

// 206 CU
compute_fn! { "Pubkey.log" =>
    pubkey.log();
}

// 357 CU - string concatenation is expensive
compute_fn! { "Log a pubkey simple concat" =>
    msg!("A string {0}", "5w6z5PWvtkCd4PaAV7avxE6Fy5brhZsFdbRLMt8UefRQ");
}
```

## 2 Data Types

Bigger data types cost more CU. Use the smallest data type possible.

```rust
// 357
compute_fn! { "Push Vector u64 " =>
    let mut a: Vec<u64> = Vec::new();
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
}

// 211 CU
compute_fn! { "Vector u8 " =>
    let mut a: Vec<u8> = Vec::new();
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
}

```

## 3 Serialization

Borsh serialization can be expensive depending on the account structs, use zero copy when possible and directly interact with the memory. It also saves more stack space than boxing. Operations on the stack are slightly more efficient though.

```rust
// 6302 CU
pub fn initialize(_ctx: Context<InitializeCounter>) -> Result<()> {
    Ok(())
}

// 5020 CU
pub fn initialize_zero_copy(_ctx: Context<InitializeCounterZeroCopy>) -> Result<()> {
    Ok(())
}
```

```rust
// 108 CU - total CU including serialization 2600
let counter = &mut ctx.accounts.counter;
compute_fn! { "Borsh Serialize" =>
    counter.count = counter.count.checked_add(1).unwrap();
}

// 151 CU - total CU including serialization 1254
let counter = &mut ctx.accounts.counter_zero_copy.load_mut()?;
compute_fn! { "Zero Copy Serialize" =>
    counter.count = counter.count.checked_add(1).unwrap();
}
```

## 4 PDAs

Depending on the seeds find_program_address can use multiple loops and become very expensive. You can save the bump in an account or pass it in from the client to remove this overhead:

```rust
pub fn pdas(ctx: Context<PdaAccounts>) -> Result<()> {
    let program_id = Pubkey::from_str("5w6z5PWvtkCd4PaAV7avxE6Fy5brhZsFdbRLMt8UefRQ").unwrap();

    // 12,136 CUs
    compute_fn! { "Find PDA" =>
        Pubkey::find_program_address(&[b"counter"], ctx.program_id);
    }

    // 1,651 CUs
    compute_fn! { "Find PDA" =>
        Pubkey::create_program_address(&[b"counter", &[248_u8]], &program_id).unwrap();
    }

    Ok(())
}

#[derive(Accounts)]
pub struct PdaAccounts<'info> {
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
    // 12,136 CUs when not defining the bump
    #[account(
        seeds = [b"counter"],
        bump
    )]
    pub counter_checked: Account<'info, CounterData>,
}

#[derive(Accounts)]
pub struct PdaAccounts<'info> {
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
    // only 1600 if using the bump that is saved in the counter_checked account
    #[account(
        seeds = [b"counter"],
        bump = counter_checked.bump
    )]
    pub counter_checked: Account<'info, CounterData>,
}

```

## 5 Closures and function

During the tests it looks like that closures, function calls and inlining have a similar cost and were well optimized by the compiler.

## 6 CPIs

Every CPI comes with a cost and you also need to calculate in the costs of the called programs function.
If possible avoid doing many CPIs.
I did not find a difference in CPI cost between anchor and native and the optimization is more in the called function.
A CPI for a transfer with the system program costs 2215 CU.
Interesting is though that error handling also costs a lot of CU. So profile how you handle errors and optimize there.

```rust
// 2,215 CUs
compute_fn! { "CPI system program" =>
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.payer.to_account_info().clone(),
            to: ctx.accounts.counter.to_account_info().clone(),
        },
    );
    system_program::transfer(cpi_context, 1)?;
}

// 251 CUs. In an error case though the whole transactions is 1,199 CUs bigger than without. So error handling is expensive
compute_fn! { "Transfer borrowing lamports" =>
    let counter_account_info = ctx.accounts.counter.to_account_info();
    let mut source_lamports = counter_account_info.try_borrow_mut_lamports()?;
    const AMOUNT: u64 = 1;
    if **source_lamports < AMOUNT {
        msg!("source account has less than {} lamports", AMOUNT);
        let err = Err(anchor_lang::error::Error::from(ProgramError::InsufficientFunds));
        return err;
    }
    **source_lamports -= AMOUNT;
    let payer_account_info = ctx.accounts.payer.to_account_info();
    **payer_account_info.try_borrow_mut_lamports()? += AMOUNT;
}
```

## 7 Checked Math

It turns out that checked math is more expensive than unchecked math. This is because on every operation the program needs to check if the operation is valid and does not under- or overflow for example. If you are sure that the operation is valid you can use unchecked math so save some CU.
Also the compiler is very good at optimizing the code and inline checks and remove unnecessary calculations if a value is not used for example.
This is why the functions have the `no_inline` attribute to prevent the compiler from optimizing the code away and the calculations are in public functions and the result values are logged after the calculation.

```rust
// Testing checked_mul 97314 CU
compute_fn! { "checked mul" =>
    test_checked_mul(test_value_mul, 7, 200, 60);
}

msg!("Test value mul: {}", test_value_mul);

// Testing bit_shift 85113 CU
compute_fn! { "bit shift" =>
    check_bit_shift(test_value_shift, 7, 200, 60);
}
```

## 8 Clone vs Reference

Here we can see that passing by reference is cheaper than cloning.
Interesting is also that due to the bump allocator that solana
uses we will run out of memory as soon as we go to 40 iterations
on the loop that clones the vector. This is because the bump allocator
does not free memory and we only have 32 KB of heap space. By passing in the balances vector by reference we can avoid this problem.

```rust
let balances = vec![10_u64; 100]; // a vector with 10,000 elements

// 47683 CU
compute_fn! { "Pass by reference" =>
    for _ in 0..39 {
        sum_reference += sum_vector_by_reference(&balances);
    }
}

msg!("Sum by reference: {}", sum_reference);

let mut sum_clone = 0;

// 49322 CU
compute_fn! { "Clone" =>
    for _ in 0..39 {
        sum_clone += sum_vector_by_value(balances.clone());
    }
}

msg!("Sum by clone: {}", sum_clone);
```

## 9 Native vs Anchor vs Asm

Anchor is a great tool for writing programs, but it comes with a cost. Every check that anchor does costs CU. While most checks are useful, there may be room for improvement. The anchor generated code is not necessarily optimized for CU.

| Test Title   | Anchor                       | Native                       | ASM \*                      |
| ------------ | ---------------------------- | ---------------------------- | --------------------------- |
| Deploy size  | 265677 bytes (1.8500028 sol) | 48573 bytes (0.33895896 sol) | 1389 bytes (0.01055832 sol) |
| Counter Inc  | 946 CU                       | 843 CU                       | 6 CU                        |
| Signer Check | 303 CU                       | 103 CU                       | 1 CU                        |

- Note though that the assembly example is a very simple example and does not include any checks or error handling.

Size will increase with every check that you implement and every instruction that you add. You will also need to increase your program size whenever it becomes bigger.

## 10 Writing programs in Assembly

Writing programs in assembly can be very efficient. You can write very small programs that use very little CU. This can be great for example to write primitives that are used in other programs like checking token balances at the end of a swap or similar.

The downside is that you need to write everything yourself and you need to be very careful with the stack and heap. You also need to be very careful with the memory layout and the program will be harder to read and maintain. Also Anchor and even native rust are way easier to write secure programs with! Only use this if you know what you are doing.

There are two counter example in this repository. One was written using the [solana-program-rosetta](https://github.com/joncinque/solana-program-rosetta?tab=readme-ov-file#assembly) by Jon Cinque. It is a great tool to get started with writing programs in assembly. It comes complete with bankrun tests written in rust. It also contains examples written in Zig and C which can also bring great performance improvements.

Instead of solana-program-rosetta you can also use [SBPF](https://github.com/deanmlittle/sbpf) by [Dean](https://github.com/deanmlittle) which gives your very convenient functions like `sbpf init`, `sbpf build` and `sbpf deploy`. This one comes with Js tests using `mocha` and `chai` and is also a great tool to get started with writing programs in assembly and makes setting up projects much easier.

If you want to get started on Solana ASM program writing you should start by reading the [docs on the exact memory layout](https://solana.com/docs/programs/faq#input-parameter-serialization) of the [entry point](https://github.com/anza-xyz/agave/blob/1b3eb3df5e244cdbdedb7eff8978823ef0611669/sdk/program/src/entrypoint.rs#L336) and the registers for heap and stack frame.

Great [repository links and tips for ASM programs](https://github.com/deanmlittle/awesome-sbpf).

There is also a VSCode extension by Dean: https://github.com/deanmlittle/vscode-sbpf-asm that helps with autocomplete and syntax highlighting.

It is probably not realistic to write huge programs in assembly, but for small programs or primitives it can be a useful tool. Also knowing how Rust and C code transforms to assembly code can be useful when optimizing your programs.

Here are some ASM examples for reference:

- [Fibonacci example](https://github.com/deanmlittle/solana-fibonacci-asm)
- [Sol Transfer](https://github.com/joncinque/solana-program-rosetta/tree/main/transfer-lamports/asm)
- Hello world: https://github.com/deanmlittle/ezbpf run `sbpf init`
- The Counter examples can be found here in this repo

If you want to use AI like chat GPT to write your programs make sure to train it on these examples before you start.

## 11 Other low level optimizations

### Compiler flags

There is certain compiler flags that you set set to decrease CU usage of yor program. You can set the following flags in your `Cargo.toml`. For example you could disable overflow checks.
Note thought that changing a flag like overflow checks of course comes with additional risks like overflow bugs.

TODO: Add performance tests on different flags.
https://doc.rust-lang.org/cargo/reference/profiles.html#overflow-checks

### Inline

Inlining functions can save CU. The compiler is very good at optimizing the code and inline checks and remove unnecessary calculations if a value is not used for example.

```rust
#[inline(always)]
fn add(a: u64, b: u64) -> u64 {
    a + b
}
```

Note though that you need to balance inline always vs inline never. Inlining saves CU but needs more stack space while inline never saves stack space but costs more CU.

### Non standart heap allocators

The standart heap allocator is a bump heap allocator which does not free memory. This can lead to out of memory errors if you use a lot of memory. You can use a different heap allocator.

Metaplex token meta data program uses smalloc heap for example: https://github.com/metaplex-foundation/mpl-core-candy-machine/pull/10

### Different entry points 

The standart entry points is not necessarily the most efficient one. You can use a different entry point to save CU. For example the no_std entry point:
https://github.com/cavemanloverboy/solana-nostd-entrypoint
It uses unsafe rust though.
You can read on some comparison about this here: https://github.com/hetdagli234/optimising-solana-programs/tree/main

## 12 Analyze and optimize yourself

Most important here is actually to know that every check and every serialization costs compute and how to profile and optimize it yourself since every program is different. Profile and optimize your programs today!

Feel free to play around with it and add more examples. Also here is a very nice article from @RareSkills_io https://www.rareskills.io/post/solana-compute-unit-price on that topic. I replicated some of the examples :)

Also here is a nice Twitter thread on the topic: https://x.com/daglihet/status/1840396773833261085 with another CU optimization repository looking also at different entry points and how to optimize them. https://github.com/hetdagli234/optimising-solana-programs/tree/main

Some nice optimizations can also he found in this [twitter post by dev4all](https://twitter.com/kAsky53/status/1777799557759254810).

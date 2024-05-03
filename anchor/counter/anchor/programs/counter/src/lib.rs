#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use bytemuck::{Pod, Zeroable};

declare_id!("7XfR8Vdd8Hin4sSfbCMThaRZkXMCt7MwoB7sFSGVtYAE");

#[macro_export]
#[cfg(not(feature = "trace-compute"))]
macro_rules! compute {
    ($msg:expr=> $($tt:tt)*) => { $($tt)* };
}

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

#[program]
pub mod counter {

    use anchor_lang::system_program;
    use std::str::FromStr;

    use super::*;

    // Total 19241 CU
    pub fn allocations(ctx: Context<Update>) -> Result<()> {
        // 109 CU
        compute_fn! { "increase u8" =>
            ctx.accounts.counter.count += 1;
        }

        // 204
        compute_fn! { "Log a string " =>
            msg!("Compute units");
        }

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

        // 125 CU
        compute_fn! { "Vector u64 init" =>
            let _a: Vec<u64> = vec![1, 1, 1, 1, 1, 1];
        }

        // 356 CU
        compute_fn! { "Vector i64 " =>
            // this costs 356 CU (takes the same space as u64)
            let mut a: Vec<i64> = Vec::new();
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

        Ok(())
    }

    // Total 14742 CU
    pub fn increment(ctx: Context<Update>) -> Result<()> {
        // There seems to not be any difference in between different ways of using checked_add
        let counter = &mut ctx.accounts.counter;

        // 3405 CU
        compute_fn! { "counter checked_add.unwrap()" =>
            for _ in 0..254 {
                counter.count = counter.count.checked_add(1).unwrap();
            }
        }
        counter.count = 0;

        // 3404 CU
        compute_fn! { "counter checked_add()" =>
            for _ in 0..254 {
                match counter.count.checked_add(1) {
                    Some(v) => counter.count = v,
                    None => panic!("overflow"),
                }
            }
        }
        counter.count = 0;

        //  3404 CU
        compute_fn! { "counter += 1" =>
            for _ in 0..254 {
                counter.count += 1;
            }
        }

        Ok(())
    }

    // Total 16058 CU - there seem to be no big speed differences here. Surprisingly the function version is cheapest
    pub fn increment_with_fn_call(ctx: Context<Update>) -> Result<()> {
        let closure = |x: u64| -> u64 { x + 1 };

        // 3913 CU
        compute_fn! { "counter with closure call" =>
            for _ in 0..254 {
                ctx.accounts.counter.count = closure(ctx.accounts.counter.count);
            }
        }
        msg!("Counter: {}", ctx.accounts.counter.count);

        // 3660 CU
        compute_fn! { "counter with function call" =>
            for _ in 0..254 {
                ctx.accounts.counter.count = increase_counter_function(ctx.accounts.counter.count);
            }
        }
        msg!("Counter: {}", ctx.accounts.counter.count);

        // 3914 CU
        compute_fn! { "inline " =>
            for _ in 0..254 {
                ctx.accounts.counter.count += 1;
            }
        }
        msg!("Counter: {}", ctx.accounts.counter.count);

        Ok(())
    }

    // Total 13496 CU - There seems to be no speed improvements here
    pub fn increment_zero_copy(ctx: Context<UpdateZeroCopy>) -> Result<()> {
        let mut counter = ctx.accounts.counter_zero_copy.load_mut()?;

        // 3912 CU
        compute_fn! { "counter checked_add.unwrap()" =>
            for _ in 0..254 {
                counter.count = counter.count.checked_add(1).unwrap();
            }
        }
        counter.count = 0;

        // 3912 CU
        compute_fn! { "counter checked_add()" =>
            for _ in 0..254 {
                match counter.count.checked_add(1) {
                    Some(v) => counter.count = v,
                    None => panic!("overflow"),
                }
            }
        }
        counter.count = 0;

        //  3912 CU
        compute_fn! { "counter += 1" =>
            for _ in 0..254 {
                counter.count += 1;
            }
        }
        Ok(())
    }

    // 6302 CU
    pub fn initialize(_ctx: Context<InitializeCounter>) -> Result<()> {
        Ok(())
    }

    // 5020 CU
    pub fn initialize_zero_copy(_ctx: Context<InitializeCounterZeroCopy>) -> Result<()> {
        Ok(())
    }

    // Total 946 CU
    pub fn set_big_data(ctx: Context<Update>, _data: u64) -> Result<()> {
        ctx.accounts.counter.count = _data;
        Ok(())
    }

    // Total 945 CU
    pub fn set_small_data(ctx: Context<Update>, _data: u8) -> Result<()> {
        ctx.accounts.counter.count = _data as u64;
        Ok(())
    }

    pub fn init_pda_with_seed(ctx: Context<InitPdaWithSeeds>) -> Result<()> {
        ctx.accounts.counter_checked.bump = ctx.bumps.counter_checked;
        Ok(())
    }

    // Total 24985 CU - with the anchor checks for account_checked it becomes 38135 CU so the seeds check is around 12000 CU
    // which is not bad, but could be better.
    // If you instead use the bump that is saved in the counter_checked account it becomes 27859 CU so the overhead of the check is only 3000 CU
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

    // Total 5787 CU
    pub fn do_cpi(ctx: Context<DoCpi>, _data: u64) -> Result<()> {
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

        Ok(())
    }

    // 186578 CU
    pub fn checked_math_test(_ctx: Context<Update>) -> Result<()> {
        let mut test_value_mul: u64 = 7;
        let mut test_value_shift: u64 = 7;

        // The compiler is very good at optimizing and inlining thats
        // why these calculations and in functions with parameters and the
        // No inlining flag.

        // Testing checked_mul 97314 CU
        compute_fn! { "checked mul" =>
            test_checked_mul(test_value_mul, 7, 200, 60);
        }

        msg!("Test value mul: {}", test_value_mul);

        // Testing bit_shift 85113 CU
        compute_fn! { "bit shift" =>
            check_bit_shift(test_value_shift, 7, 200, 60);
        }

        msg!("Test value shift: {}", test_value_shift);

        Ok(())
    }

    // Total 101237 CU
    pub fn clone_variables(_ctx: Context<Update>) -> Result<()> {
        let balances = vec![10_u64; 100]; // a vector with 10,000 elements

        let mut sum_reference = 0;

        // Here we can see that passing by reference is cheaper than cloning
        // Interesting is also that due to the bump allocator that solana
        // uses we will run out of memory as soon as we go to 40 iterations
        // on the loop that clones the vector. This is because the bump allocator
        // does not free memory and we only have 32 KB of heap space.

        // 47683 CU
        compute_fn! { "pass by reference" =>
            for _ in 0..39 {
                sum_reference += sum_vector_by_reference(&balances);
            }
        }

        msg!("Sum by reference: {}", sum_reference);

        let mut sum_clone = 0;

        // 49322 CU
        compute_fn! { "clone" =>
            for _ in 0..39 {
                sum_clone += sum_vector_by_value(balances.clone());
            }
        }

        msg!("Sum by clone: {}", sum_clone);

        Ok(())
    }
}

// Function that takes a reference to a vector
fn sum_vector_by_reference(balances: &Vec<u64>) -> u64 {
    balances.iter().sum()
}

// Function that takes a vector by value
fn sum_vector_by_value(balances: Vec<u64>) -> u64 {
    balances.iter().sum()
}

pub fn increase_counter_function(mut count: u64) -> u64 {
    count += 1;
    count
}

#[inline(never)]
pub fn check_bit_shift(
    mut count: u64,
    mut extraValue: u64,
    first_loop: u64,
    second_loop: u64,
) -> u64 {
    for i in 0..(first_loop) {
        count = i;
        for _ in 0..second_loop {
            count = bit_shift(count);
        }
    }
    count
}

#[inline(never)]
pub fn bit_shift(mut count: u64) -> u64 {
    count << 1
}

#[inline(never)]
pub fn test_checked_mul(
    mut count: u64,
    mut extraValue: u64,
    first_loop: u64,
    second_loop: u64,
) -> u64 {
    for i in 0..(first_loop) {
        count = i;
        for _ in 0..second_loop {
            checked_mul(count);
        }
    }
    count
}

#[inline(never)]
pub fn checked_mul(mut count: u64) -> u64 {
    count.checked_mul(2).expect("overflow")
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + CounterData::INIT_SPACE,
        payer = payer
    )]
    pub counter: Box<Account<'info, CounterData>>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeCounterZeroCopy<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        space = 8 + CounterZeroCopy::INIT_SPACE,
        payer = payer
    )]
    pub counter_zero_copy: AccountLoader<'info, CounterZeroCopy>,
    pub system_program: Program<'info, System>,
}

// 15166 CU with signer 14863 CU without signer check
#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
}

/*
When boxing the account the CU increase to 3,657 which indicated that it takes more cu to
Calculate the data on the heap
#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Box<Account<'info, Counter>>,
}*/

#[derive(Accounts)]
pub struct InitPdaWithSeeds<'info> {
    #[account(
        init,
        seeds = [b"counter"],
        bump,
        payer = signer,
        space = 8 + CounterData::INIT_SPACE
    )]
    pub counter_checked: Account<'info, CounterData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PdaAccounts<'info> {
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
    // 12,136 CUs when not defining the bump, but only 1600 if using the bump that is saved in the counter_checked account
    #[account(
        seeds = [b"counter"],
        bump = counter_checked.bump
    )]
    pub counter_checked: Account<'info, CounterData>,
}

#[derive(Accounts)]
pub struct DoCpi<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateZeroCopy<'info> {
    #[account(mut)]
    pub counter_zero_copy: AccountLoader<'info, CounterZeroCopy>,
}

// 6389 CU
#[account]
#[derive(InitSpace)]
pub struct CounterData {
    count: u64,
    test: Pubkey,
    test1: u64,
    test2: u64,
    big_struct: BigStruct,
    bump: u8,
}

// 5020 CU
#[account(zero_copy)]
#[repr(C)]
#[derive(InitSpace)]
pub struct CounterZeroCopy {
    count: u64,
    test: Pubkey,
    test1: u64,
    test2: u64,
    big_struct: BigStruct,
}

#[repr(C)]
#[derive(
    AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Zeroable, Pod, InitSpace,
)]
pub struct BigStruct {
    test: Pubkey,
    test1: u64,
    test2: u64,
    test3: Pubkey,
    test4: u64,
    test5: u64,
}

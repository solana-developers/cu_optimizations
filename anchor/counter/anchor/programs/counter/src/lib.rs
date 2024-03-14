#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use bytemuck::{Pod, Zeroable};

declare_id!("5w6z5PWvtkCd4PaAV7avxE6Fy5brhZsFdbRLMt8UefRQ");

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

pub fn increase_counter_test(count: u64) -> u64 {
    return 5;
}

#[program]
pub mod counter {
    use super::*;

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
            // this costs 618 CU
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
            // this costs 618 CU (takes the same space as u64)
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
        let mut counter = &mut ctx.accounts.counter;

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

    pub fn increment_fn_call(ctx: Context<Update>) -> Result<()> {
        // let closure = |x: u64| -> u64 { x + 1 };

        //closure(ctx.accounts.counter.count);

        increase_counter_test(5);
        Ok(())
    }

    /*pub fn increase_counter(count: u64) -> Result<()> {
        Ok(())
    }*/

    // Total 13496 CU
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

    pub fn set(ctx: Context<Update>, value: u64) -> Result<()> {
        ctx.accounts.counter.count = value;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + Counter::INIT_SPACE,
        payer = payer
    )]
    pub counter: Box<Account<'info, Counter>>,
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

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
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
pub struct UpdateZeroCopy<'info> {
    #[account(mut)]
    pub counter_zero_copy: AccountLoader<'info, CounterZeroCopy>,
}

// 6389 CU
#[account]
#[derive(InitSpace)]
pub struct Counter {
    count: u64,
    test: Pubkey,
    test1: u64,
    test2: u64,
    big_struct: BigStruct,
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

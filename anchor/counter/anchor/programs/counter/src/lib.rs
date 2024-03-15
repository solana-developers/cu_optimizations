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

pub fn increase_counter_function(mut count: u64) -> u64 {
    count += 1;
    count
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

    pub fn set_big_data(ctx: Context<Update>, _data: u64) -> Result<()> {
        ctx.accounts.counter.count = _data;
        Ok(())
    }

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
        // 12,136 CUs
        compute_fn! { "Find PDA" =>
            Pubkey::find_program_address(&[b"counter"], ctx.program_id);
        }

        let program_id = Pubkey::from_str("5w6z5PWvtkCd4PaAV7avxE6Fy5brhZsFdbRLMt8UefRQ").unwrap();

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

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Box<Account<'info, CounterData>>,
}

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

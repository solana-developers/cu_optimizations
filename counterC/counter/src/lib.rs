use solana_program::msg;

// This is basically the same code as in rust, but instead in unsave rust using the 
#[no_mangle]
pub extern "C" fn entrypoint(input: *mut u8) -> u64 {
    unsafe {
        *input.add(96) += 1;
    }
    //msg!("Hello counter!");
    0
}

#[cfg(target_os = "solana")]
#[no_mangle]
fn custom_panic(_info: &core::panic::PanicInfo<'_>) {}

solana_program::custom_heap_default!();

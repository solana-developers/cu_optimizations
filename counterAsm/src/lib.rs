use solana_program::msg;

#[no_mangle]
pub extern "C" fn entrypoint(_: *mut u8) -> u64 {
    msg!("Hello world!");
    0
}
#[cfg(target_os = "solana")]
#[no_mangle]
fn custom_panic(info: &core::panic::PanicInfo<'_>) {}
solana_program::custom_heap_default!();

use solana_program::msg;

// Entrypoint function using unsafe Rust code to increment a value.
// Note: This is equivalent to a typical Rust approach but leverages unsafe code
// to perform direct pointer manipulation, which bypasses Rust's usual safety checks.
// So if you don't like the borrow checker you can use this ;) (not recommended)
//
// # Safety
// The input pointer is expected to be valid and aligned for this function to work correctly.
// The function increments the byte at offset 96 from the provided input pointer
// which is the first byte of the data field in the first account which is our counter account in this case.
// Improper handling or misuse of the pointer could lead to undefined behavior.
// Takes 5 CU. Can be improved to 4 CU using https://crates.io/crates/sbpf-asm-macros and removing the return type
#[no_mangle]
pub extern "C" fn entrypoint(input: *mut u8) -> u64 {
    unsafe {
        *input.add(96) += 1;
    }
    0
}

// You can define custom panic handlers and heap allocators here.
// #[cfg(target_os = "solana")]
// #[no_mangle]
// fn custom_panic(_info: &core::panic::PanicInfo<'_>) {}

// solana_program::custom_heap_default!();

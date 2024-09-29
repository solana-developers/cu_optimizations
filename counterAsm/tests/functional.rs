use ::{
    solana_program::instruction::Instruction,
    solana_program_test::{ tokio, ProgramTest },
    solana_sdk::{
        signature::Signer,
        transaction::Transaction,
        system_instruction,
        pubkey::Pubkey,
        instruction::AccountMeta,
    },
};
mod program {
    solana_program::declare_id!("1og1111111111111111111111111111111111111111");
}
fn program_test() -> ProgramTest {
    ProgramTest::new("solana_program_rosetta_helloworld", program::id(), None)
}
#[tokio::test]
async fn call() {
    let pt = program_test();
    let mut context = pt.start_with_context().await;
    let blockhash = context.banks_client.get_latest_blockhash().await.unwrap();

    let newCounterKeypair = solana_sdk::signature::Keypair::new();
    let pda_account_data = context.banks_client
        .get_account(newCounterKeypair.pubkey()).await
        .unwrap();
    if pda_account_data.is_none() {
        // Set lamports to cover rent and size (8 bytes for a u64 counter)
        let create_pda_ix = system_instruction::create_account(
            &context.payer.pubkey(),
            &newCounterKeypair.pubkey(),
            1_000_000_000, // Adjust lamports based on rent-exempt requirement
            8, // Size in bytes (64-bit counter = 8 bytes)
            &program::id() // The program owning the PDA
        );

        let create_pda_tx = Transaction::new_signed_with_payer(
            &[create_pda_ix],
            Some(&context.payer.pubkey()),
            &[&context.payer, &newCounterKeypair],
            blockhash
        );

        context.banks_client.process_transaction(create_pda_tx).await.unwrap();
        println!("PDA account created!");
    } else {
        println!("PDA account already exists!");
    }

    let pda_account_data = context.banks_client
        .get_account(newCounterKeypair.pubkey()).await
        .unwrap();
    if pda_account_data.is_none() {
        panic!("PDA account not found!");
    } else {
        let pdaData = pda_account_data.unwrap();
        println!("PDA account data: {:?}", pdaData);
    }

    let transaction = Transaction::new_signed_with_payer(
        &[
            Instruction {
                program_id: program::id(),
                accounts: vec![
                    AccountMeta::new(newCounterKeypair.pubkey(), true),
                    AccountMeta::new_readonly(context.payer.pubkey(), true)
                ],
                data: vec![],
            },
        ],
        Some(&context.payer.pubkey()),
        &[&context.payer, &newCounterKeypair],
        blockhash
    );
    context.banks_client.process_transaction(transaction).await.unwrap();

    let pda_account_data = context.banks_client
        .get_account(newCounterKeypair.pubkey()).await
        .unwrap();
    let pdaData = pda_account_data.unwrap();
    println!("PDA account data: {:?}", pdaData);
    assert!(pdaData.data[0] == 1);

    let transaction2 = Transaction::new_signed_with_payer(
        &[
            Instruction {
                program_id: program::id(),
                accounts: vec![
                    AccountMeta::new(newCounterKeypair.pubkey(), true),
                    AccountMeta::new_readonly(context.payer.pubkey(), true)
                ],
                data: vec![2],
            },
        ],
        Some(&context.payer.pubkey()),
        &[&context.payer, &newCounterKeypair],
        blockhash
    );
    context.banks_client.process_transaction(transaction2).await.unwrap();

    let pda_account_data = context.banks_client
        .get_account(newCounterKeypair.pubkey()).await
        .unwrap();
    let pdaData = pda_account_data.unwrap();
    assert!(pdaData.data[0] == 2);
    //panic!("PDA account data: {:?}", pdaData);
}

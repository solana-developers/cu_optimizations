use ::{
    solana_program::{ instruction::Instruction, log },
    solana_program_test::{ tokio, ProgramTest },
    solana_sdk::{
        account,
        instruction::AccountMeta,
        msg,
        nonce::state::Data,
        signature::{ Keypair, Signer },
        system_instruction,
        system_program,
        transaction::Transaction,
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

    let counter_keypair: Keypair = Keypair::new();

    let rent_exempt = context.banks_client.get_rent().await.unwrap();

    let create_counter_account_instruction: Instruction = system_instruction::create_account(
        &context.payer.pubkey(),
        &counter_keypair.pubkey(),
        rent_exempt.minimum_balance(8),
        8,
        &program::id()
    );

    let transaction = Transaction::new_signed_with_payer(
        &[
            create_counter_account_instruction,
            Instruction {
                program_id: program::id(),
                accounts: vec![
                    AccountMeta::new(counter_keypair.pubkey(), true),
                    AccountMeta::new(context.payer.pubkey(), true),
                ],
                data: vec![],
            },
        ],
        Some(&context.payer.pubkey()),
        &[&context.payer, &counter_keypair],
        blockhash
    );
    context.banks_client.process_transaction(transaction).await.unwrap();

    let account = context.banks_client.get_account(counter_keypair.pubkey()).await.unwrap();

    match account {
        Some(accout_data) => {
            panic!("dataq: {:?}", accout_data.data);
        }
        None => {
            println!("No data");
        }
    }
}

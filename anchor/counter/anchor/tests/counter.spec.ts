import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { Counter } from '../target/types/counter';

describe('counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Counter as Program<Counter>;

  const counterKeypair = Keypair.generate();
  const counterZeroCopyKeypair = Keypair.generate();

  it.only('Initialize Counter', async () => {
    const sig = await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([counterKeypair])
      .rpc();

    console.log('Init counter ' + sig);
  });

  it('Initialize Counter Zero Copy', async () => {
    const sig = await program.methods
      .initializeZeroCopy()
      .accounts({
        counterZeroCopy: counterZeroCopyKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([counterZeroCopyKeypair])
      .rpc();

    console.log('Init counter zero copy ' + sig);
  });

  it('Increment Counter', async () => {
    const sim = await program.methods
      .increment()
      .accounts({
        counter: counterKeypair.publicKey,
      })
      .simulate();

    console.log('Increment counter ' + JSON.stringify(sim));

    const sig = await program.methods
      .increment()
      .accounts({
        counter: counterKeypair.publicKey,
      })
      .rpc();

    console.log('Increment counter ' + sig);

    const currentCount = await program.account.counterData.fetch(
      counterKeypair.publicKey,
    );
    console.log('Current count ' + currentCount.count.toNumber());
  });

  it('Increment Counter zero copy', async () => {
    const sim = await program.methods
      .incrementZeroCopy()
      .accounts({ counterZeroCopy: counterZeroCopyKeypair.publicKey })
      .simulate();
    console.log('Increment counter zero copy ' + JSON.stringify(sim));

    const sig = await program.methods
      .incrementZeroCopy()
      .accounts({ counterZeroCopy: counterZeroCopyKeypair.publicKey })
      .rpc({ skipPreflight: true });
    console.log('Increment counter zero copy ' + sig);

    const currentCount = await program.account.counterZeroCopy.fetch(
      counterZeroCopyKeypair.publicKey,
    );
    console.log('Current count ' + currentCount.count.toNumber());
  });

  it('Allocations', async () => {
    const sig = await program.methods
      .allocations()
      .accounts({ counter: counterKeypair.publicKey })
      .simulate();

    console.log('Allocations ' + JSON.stringify(sig));
  });

  it('Closure and Function calls', async () => {
    const sim = await program.methods
      .incrementWithFnCall()
      .accounts({ counter: counterKeypair.publicKey })
      .simulate();

    console.log('Closure and Function calls ' + JSON.stringify(sim));
  });

  it('Set counter value u64', async () => {
    const sim = await program.methods
      .setBigData(new anchor.BN(42))
      .accounts({ counter: counterKeypair.publicKey })
      .simulate();

    console.log('Set value u64:  ' + JSON.stringify(sim));

    await program.methods
      .setBigData(new anchor.BN(42))
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.counterData.fetch(
      counterKeypair.publicKey,
    );

    expect(currentCount.count.toNumber()).toEqual(42);
  });

  it('Set counter value u8', async () => {
    const sim = await program.methods
      .setSmallData(42)
      .accounts({ counter: counterKeypair.publicKey })
      .simulate();

    console.log('Set value u8:  ' + JSON.stringify(sim));

    await program.methods
      .setSmallData(42)
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.counterData.fetch(
      counterKeypair.publicKey,
    );

    expect(currentCount.count.toNumber()).toEqual(42);
  });

  it('CPI', async () => {
    const sim = await program.methods
      .doCpi(new anchor.BN(1))
      .accounts({ counter: counterKeypair.publicKey })
      .simulate();

    console.log('Do Cpi:  ' + JSON.stringify(sim));

    const sig = await program.methods
      .doCpi(new anchor.BN(1))
      .accounts({ counter: counterKeypair.publicKey })
      .rpc({ skipPreflight: true });
    console.log('Do CPI ' + sig);
  });

  it('PDAS', async () => {
    const counter_checked = PublicKey.findProgramAddressSync(
      [Buffer.from('counter')],
      program.programId,
    );

    const init_sig = await program.methods
      .initPdaWithSeed()
      .accounts({
        counterChecked: counter_checked[0],
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: true });
    console.log('Init Pda with seed ' + init_sig);

    const sim = await program.methods
      .pdas()
      .accounts({
        counter: counterKeypair.publicKey,
        counterChecked: counter_checked[0],
      })
      .simulate();

    console.log('PDAS:  ' + JSON.stringify(sim));

    const sig = await program.methods
      .pdas()
      .accounts({
        counter: counterKeypair.publicKey,
        counterChecked: counter_checked[0],
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: true });
    console.log('PDAS ' + sig);
  });

  it('Checked Math', async () => {
    const sim = await program.methods
      .checkedMathTest()
      .accounts({
        counter: counterKeypair.publicKey,
      })
      .simulate();

    console.log('Calculations ' + JSON.stringify(sim));

    const sig = await program.methods
      .checkedMathTest()
      .accounts({
        counter: counterKeypair.publicKey,
      })
      .rpc();

    console.log('mulVsDiv ' + sig);
  });

  it('Clone variables', async () => {
    const sim = await program.methods
      .cloneVariables()
      .accounts({
        counter: counterKeypair.publicKey,
      })
      .simulate();

    console.log('cloneVariables ' + JSON.stringify(sim));

    const sig = await program.methods
      .cloneVariables()
      .accounts({
        counter: counterKeypair.publicKey,
      })
      .rpc();

    console.log('cloneVariables ' + sig);
  });
});

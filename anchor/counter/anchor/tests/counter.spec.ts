import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Counter } from '../target/types/counter';

describe('counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Counter as Program<Counter>;

  const counterKeypair = Keypair.generate();
  const counterZeroCopyKeypair = Keypair.generate();

  it('Initialize Counter zero copy', async () => {
    const sig = await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([counterKeypair])
      .rpc();

      console.log("Init counter " + sig);
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

      console.log("Init counter zero copy " + sig);
  });

  it('Increment Counter', async () => {
    const sim = await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey})
      .simulate();

      console.log("Increment counter " + JSON.stringify(sim));

      const sig = await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey})
      .rpc();

      console.log("Increment counter " + sig);

      const currentCount = await program.account.counter.fetch(
        counterKeypair.publicKey
      );
      console.log("Current count " + currentCount.count.toNumber());
  });

  it('Increment Counter zero copy', async () => {
    const sim = await program.methods
      .incrementZeroCopy()
      .accounts({ counterZeroCopy: counterZeroCopyKeypair.publicKey})
      .simulate();
      console.log("Increment counter zero copy " + JSON.stringify(sim));

    const sig = await program.methods
      .incrementZeroCopy()
      .accounts({ counterZeroCopy: counterZeroCopyKeypair.publicKey})
      .rpc({skipPreflight: true});
      console.log("Increment counter zero copy " + sig);

      const currentCount = await program.account.counterZeroCopy.fetch(
        counterZeroCopyKeypair.publicKey
      );
      console.log("Current count " + currentCount.count.toNumber());
  });

  it('Allocations', async () => {
    const sig = await program.methods
      .allocations()
      .accounts({ counter: counterKeypair.publicKey})
      .simulate();

      console.log("Allocations " + JSON.stringify(sig));
  });

  it('Set counter value', async () => {
    await program.methods
      .set(new anchor.BN(42))
      .accounts({ counter: counterKeypair.publicKey})
      .rpc();

    const currentCount = await program.account.counter.fetch(
      counterKeypair.publicKey
    );

    expect(currentCount.count.toNumber()).toEqual(42);
  });

});

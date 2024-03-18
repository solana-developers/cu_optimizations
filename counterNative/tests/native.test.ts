import * as borsh from "borsh";
import assert from "assert";
import * as web3 from "@solana/web3.js";
import { airdropIfRequired, getKeypairFromFile } from "@solana-developers/helpers";


// Manually initialize variables that are automatically defined in Playground
const PROGRAM_ID = new web3.PublicKey("52XVTAWa3VfFheKnD1VVX7JzMTyKhCYiTGumwNiCnGz");
const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");

/**
 * The state of a greeting account managed by the hello world program
 */
class CounterAccount {
  counter = 0;
  constructor(fields: { counter: number } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

/**
 * Borsh schema definition for greeting accounts
 */
const GreetingSchema = new Map([
  [CounterAccount, { kind: "struct", fields: [["counter", "u64"]] }],
]);

/**
 * The expected size of each greeting account.
 */
const GREETING_SIZE = borsh.serialize(
  GreetingSchema,
  new CounterAccount()
).length;

describe("Test", () => {

  it("greet", async () => {
    const keyPair = await getKeypairFromFile();
    const wallet = { keypair: keyPair };

    const newBalance = await airdropIfRequired(
      connection,
      keyPair.publicKey,
      0.5 * web3.LAMPORTS_PER_SOL,
      1 * web3.LAMPORTS_PER_SOL,
    );

    // Create greetings account instruction
    const counterAccountKp = new web3.Keypair();
    const lamports = await connection.getMinimumBalanceForRentExemption(
      GREETING_SIZE
    );
    const createGreetingAccountIx = web3.SystemProgram.createAccount({
      fromPubkey: wallet.keypair.publicKey,
      lamports,
      newAccountPubkey: counterAccountKp.publicKey,
      programId: PROGRAM_ID,
      space: GREETING_SIZE,
    });

    // Create greet instruction
    const greetIx = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: counterAccountKp.publicKey,
          isSigner: false,
          isWritable: true,
        },
      ],
      programId: PROGRAM_ID,
    });

    // Create transaction and add the instructions
    const tx = new web3.Transaction();
    tx.add(createGreetingAccountIx, greetIx);

    // Send and confirm the transaction
    const txHash = await web3.sendAndConfirmTransaction(connection, tx, [
      wallet.keypair,
      counterAccountKp,
    ], {skipPreflight: true});
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Fetch the greetings account
    const greetingAccount = await connection.getAccountInfo(
      counterAccountKp.publicKey
    );

    // Deserialize the account data
    const deserializedAccountData = borsh.deserialize(
      GreetingSchema,
      CounterAccount,
      greetingAccount.data
    );

    // Assertions
    assert.equal(greetingAccount.lamports, lamports);
    assert(greetingAccount.owner.equals(PROGRAM_ID));
    assert.deepEqual(greetingAccount.data, Buffer.from([1, 0, 0, 0, 0, 0, 0, 0]));
    assert.equal(deserializedAccountData.counter, 1);
  });
});

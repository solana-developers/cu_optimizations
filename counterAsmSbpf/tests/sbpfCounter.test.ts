import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import programSeed from "../deploy/sbpfCounter-keypair.json";

const programKeypair = Keypair.fromSecretKey(new Uint8Array(programSeed));
const program = programKeypair.publicKey;
const signerSeed = JSON.parse(process.env.SIGNER!);
const signer = Keypair.fromSecretKey(new Uint8Array(signerSeed));

console.log("Signer" + signer.publicKey.toBase58());

const connection = new Connection("http://127.0.0.1:8899", {
  commitment: "confirmed",
});

describe("Assembly tests", () => {
  it('Create counter and increase by one!"', async () => {
    const tx = new Transaction();
    var counterKeyPair = new Keypair();

    var rent = await connection.getMinimumBalanceForRentExemption(8);

    // Create the counter account before hand
    // (Using a PDA would work differently since the program needs to claim ownership of the account first)
    var params = {
      fromPubkey: signer.publicKey,
      newAccountPubkey: counterKeyPair.publicKey,
      lamports: rent,
      space: 8,
      programId: program,
    };
    var createAccountIx = SystemProgram.createAccount(params);

    tx.instructions.push(createAccountIx);

    tx.instructions.push(
      new TransactionInstruction({
        keys: [
          {
            pubkey: counterKeyPair.publicKey, // Notice how the first account is the counter so we can easily access it
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: signer.publicKey,
            isSigner: true,
            isWritable: true,
          },
        ],
        programId: program,
      })
    );
    var result = await signAndSend(tx, counterKeyPair).then(confirm).then(log);

    var transaction = await connection.getTransaction(result);
    console.log(transaction?.meta?.logMessages);

    var counter = await connection.getAccountInfo(counterKeyPair.publicKey);
    console.log(counter?.data);
  });
});

const confirm = async (signature: string): Promise<string> => {
  const block = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    signature,
    ...block,
  });
  return signature;
};

const log = async (signature: string): Promise<string> => {
  var transaction = await connection.getTransaction(signature);
  console.log(JSON.stringify(transaction?.meta?.logMessages, null, 2));
  console.log(
    `Transaction successful! https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
  );
  return signature;
};

const signAndSend = async (
  tx: Transaction,
  additionalSigner: Keypair
): Promise<string> => {
  const block = await connection.getLatestBlockhash();
  tx.recentBlockhash = block.blockhash;
  tx.lastValidBlockHeight = block.lastValidBlockHeight;
  const signature = await connection.sendTransaction(tx, [
    signer,
    additionalSigner,
  ]);
  return signature;
};

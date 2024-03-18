Install packages 

```bash
yarn install
```

Run the tests like this:

```bash
cargo build-bpf && solana program deploy ./target/deploy/temp.so && yarn test
```
# sbpfCounter

Created with [sbpf](https://github.com/deanmlittle/sbpf)

This program is written in assembly and reads data from an account increases the counter u64 value by 1 and writes it back to the account.

## Usage

Start a local validator

```bash
solana-test-validator
```

Then you can build, deploy and test the program with the following commands:

```bash
sbpf build && sbpf deploy && sbpf test
```

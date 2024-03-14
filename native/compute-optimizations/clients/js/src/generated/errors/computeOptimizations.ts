/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

export const enum ComputeOptimizationsProgramErrorCode {
  /** DeserializationError: Error deserializing an account */
  DESERIALIZATION_ERROR = 0x0, // 0
  /** SerializationError: Error serializing an account */
  SERIALIZATION_ERROR = 0x1, // 1
  /** InvalidProgramOwner: Invalid program owner. This likely mean the provided account does not exist */
  INVALID_PROGRAM_OWNER = 0x2, // 2
  /** InvalidPda: Invalid PDA derivation */
  INVALID_PDA = 0x3, // 3
  /** ExpectedEmptyAccount: Expected empty account */
  EXPECTED_EMPTY_ACCOUNT = 0x4, // 4
  /** ExpectedNonEmptyAccount: Expected non empty account */
  EXPECTED_NON_EMPTY_ACCOUNT = 0x5, // 5
  /** ExpectedSignerAccount: Expected signer account */
  EXPECTED_SIGNER_ACCOUNT = 0x6, // 6
  /** ExpectedWritableAccount: Expected writable account */
  EXPECTED_WRITABLE_ACCOUNT = 0x7, // 7
  /** AccountMismatch: Account mismatch */
  ACCOUNT_MISMATCH = 0x8, // 8
  /** InvalidAccountKey: Invalid account key */
  INVALID_ACCOUNT_KEY = 0x9, // 9
  /** NumericalOverflow: Numerical overflow */
  NUMERICAL_OVERFLOW = 0xa, // 10
}

export class ComputeOptimizationsProgramError extends Error {
  override readonly name = 'ComputeOptimizationsProgramError';

  readonly code: ComputeOptimizationsProgramErrorCode;

  readonly cause: Error | undefined;

  constructor(
    code: ComputeOptimizationsProgramErrorCode,
    name: string,
    message: string,
    cause?: Error
  ) {
    super(`${name} (${code}): ${message}`);
    this.code = code;
    this.cause = cause;
  }
}

let computeOptimizationsProgramErrorCodeMap:
  | Record<ComputeOptimizationsProgramErrorCode, [string, string]>
  | undefined;
if (__DEV__) {
  computeOptimizationsProgramErrorCodeMap = {
    [ComputeOptimizationsProgramErrorCode.DESERIALIZATION_ERROR]: [
      'DeserializationError',
      `Error deserializing an account`,
    ],
    [ComputeOptimizationsProgramErrorCode.SERIALIZATION_ERROR]: [
      'SerializationError',
      `Error serializing an account`,
    ],
    [ComputeOptimizationsProgramErrorCode.INVALID_PROGRAM_OWNER]: [
      'InvalidProgramOwner',
      `Invalid program owner. This likely mean the provided account does not exist`,
    ],
    [ComputeOptimizationsProgramErrorCode.INVALID_PDA]: [
      'InvalidPda',
      `Invalid PDA derivation`,
    ],
    [ComputeOptimizationsProgramErrorCode.EXPECTED_EMPTY_ACCOUNT]: [
      'ExpectedEmptyAccount',
      `Expected empty account`,
    ],
    [ComputeOptimizationsProgramErrorCode.EXPECTED_NON_EMPTY_ACCOUNT]: [
      'ExpectedNonEmptyAccount',
      `Expected non empty account`,
    ],
    [ComputeOptimizationsProgramErrorCode.EXPECTED_SIGNER_ACCOUNT]: [
      'ExpectedSignerAccount',
      `Expected signer account`,
    ],
    [ComputeOptimizationsProgramErrorCode.EXPECTED_WRITABLE_ACCOUNT]: [
      'ExpectedWritableAccount',
      `Expected writable account`,
    ],
    [ComputeOptimizationsProgramErrorCode.ACCOUNT_MISMATCH]: [
      'AccountMismatch',
      `Account mismatch`,
    ],
    [ComputeOptimizationsProgramErrorCode.INVALID_ACCOUNT_KEY]: [
      'InvalidAccountKey',
      `Invalid account key`,
    ],
    [ComputeOptimizationsProgramErrorCode.NUMERICAL_OVERFLOW]: [
      'NumericalOverflow',
      `Numerical overflow`,
    ],
  };
}

export function getComputeOptimizationsProgramErrorFromCode(
  code: ComputeOptimizationsProgramErrorCode,
  cause?: Error
): ComputeOptimizationsProgramError {
  if (__DEV__) {
    return new ComputeOptimizationsProgramError(
      code,
      ...(
        computeOptimizationsProgramErrorCodeMap as Record<
          ComputeOptimizationsProgramErrorCode,
          [string, string]
        >
      )[code],
      cause
    );
  }

  return new ComputeOptimizationsProgramError(
    code,
    'Unknown',
    'Error message not available in production bundles. Compile with __DEV__ set to true to see more information.',
    cause
  );
}
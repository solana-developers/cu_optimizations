/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  getScalarEnumDecoder,
  getScalarEnumEncoder,
} from '@solana/codecs';

export enum Key {
  Uninitialized,
  Counter,
}

export type KeyArgs = Key;

export function getKeyEncoder(): Encoder<KeyArgs> {
  return getScalarEnumEncoder(Key);
}

export function getKeyDecoder(): Decoder<Key> {
  return getScalarEnumDecoder(Key);
}

export function getKeyCodec(): Codec<KeyArgs, Key> {
  return combineCodec(getKeyEncoder(), getKeyDecoder());
}

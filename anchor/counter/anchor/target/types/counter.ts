/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/counter.json`.
 */
export type Counter = {
  "address": "5N5E4imUxwwdbYZern6xzKXejuHy3jNprfrvVmzT3YdF",
  "metadata": {
    "name": "counter",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "allocations",
      "discriminator": [
        1,
        113,
        97,
        54,
        169,
        80,
        89,
        24
      ],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "checkedMathTest",
      "discriminator": [
        55,
        211,
        21,
        128,
        186,
        18,
        184,
        162
      ],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "cloneVariables",
      "discriminator": [
        255,
        87,
        21,
        140,
        206,
        206,
        227,
        2
      ],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "doCpi",
      "discriminator": [
        107,
        239,
        148,
        185,
        227,
        28,
        152,
        173
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "counter",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u64"
        }
      ]
    },
    {
      "name": "increment",
      "discriminator": [
        11,
        18,
        104,
        9,
        104,
        174,
        59,
        33
      ],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "incrementWithFnCall",
      "discriminator": [
        208,
        97,
        183,
        168,
        74,
        255,
        253,
        125
      ],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "incrementZeroCopy",
      "discriminator": [
        185,
        18,
        29,
        251,
        232,
        249,
        13,
        86
      ],
      "accounts": [
        {
          "name": "counterZeroCopy",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "initPdaWithSeed",
      "discriminator": [
        212,
        53,
        116,
        159,
        89,
        204,
        73,
        11
      ],
      "accounts": [
        {
          "name": "counterChecked",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "counter",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeZeroCopy",
      "discriminator": [
        231,
        210,
        91,
        45,
        76,
        136,
        245,
        98
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "counterZeroCopy",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "pdas",
      "discriminator": [
        246,
        154,
        184,
        52,
        84,
        133,
        233,
        142
      ],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        },
        {
          "name": "counterChecked",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "setBigData",
      "discriminator": [
        103,
        175,
        127,
        132,
        44,
        228,
        21,
        134
      ],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setSmallData",
      "discriminator": [
        58,
        245,
        92,
        248,
        179,
        123,
        78,
        157
      ],
      "accounts": [
        {
          "name": "counter",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "counterData",
      "discriminator": [
        195,
        168,
        35,
        222,
        246,
        249,
        206,
        42
      ]
    },
    {
      "name": "counterZeroCopy",
      "discriminator": [
        162,
        95,
        60,
        218,
        12,
        108,
        88,
        52
      ]
    }
  ],
  "types": [
    {
      "name": "bigStruct",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "test",
            "type": "pubkey"
          },
          {
            "name": "test1",
            "type": "u64"
          },
          {
            "name": "test2",
            "type": "u64"
          },
          {
            "name": "test3",
            "type": "pubkey"
          },
          {
            "name": "test4",
            "type": "u64"
          },
          {
            "name": "test5",
            "type": "u64"
          },
          {
            "name": "test6",
            "type": "pubkey"
          },
          {
            "name": "pubkeyArray",
            "type": {
              "array": [
                "pubkey",
                43
              ]
            }
          }
        ]
      }
    },
    {
      "name": "counterData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "test",
            "type": "pubkey"
          },
          {
            "name": "test1",
            "type": "u64"
          },
          {
            "name": "test2",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "counterZeroCopy",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "test",
            "type": "pubkey"
          },
          {
            "name": "test1",
            "type": "u64"
          },
          {
            "name": "test2",
            "type": "u64"
          },
          {
            "name": "bigStruct",
            "type": {
              "defined": {
                "name": "bigStruct"
              }
            }
          }
        ]
      }
    }
  ]
};

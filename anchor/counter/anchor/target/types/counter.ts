export type Counter = {
  "version": "0.1.0",
  "name": "counter",
  "instructions": [
    {
      "name": "allocations",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "incrementZeroCopy",
      "accounts": [
        {
          "name": "counterZeroCopy",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeZeroCopy",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counterZeroCopy",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "set",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "test",
            "type": "publicKey"
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
              "defined": "BigStruct"
            }
          }
        ]
      }
    },
    {
      "name": "counterZeroCopy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "test",
            "type": "publicKey"
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
              "defined": "BigStruct"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BigStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "test",
            "type": "publicKey"
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
            "type": "publicKey"
          },
          {
            "name": "test4",
            "type": "u64"
          },
          {
            "name": "test5",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export const IDL: Counter = {
  "version": "0.1.0",
  "name": "counter",
  "instructions": [
    {
      "name": "allocations",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "incrementZeroCopy",
      "accounts": [
        {
          "name": "counterZeroCopy",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeZeroCopy",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counterZeroCopy",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "set",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "test",
            "type": "publicKey"
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
              "defined": "BigStruct"
            }
          }
        ]
      }
    },
    {
      "name": "counterZeroCopy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "test",
            "type": "publicKey"
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
              "defined": "BigStruct"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BigStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "test",
            "type": "publicKey"
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
            "type": "publicKey"
          },
          {
            "name": "test4",
            "type": "u64"
          },
          {
            "name": "test5",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
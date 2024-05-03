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
      "name": "incrementWithFnCall",
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
      "name": "setBigData",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
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
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initPdaWithSeed",
      "accounts": [
        {
          "name": "counterChecked",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
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
      "name": "pdas",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "counterChecked",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "doCpi",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "checkedMathTest",
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
      "name": "cloneVariables",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
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
      "name": "incrementWithFnCall",
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
      "name": "setBigData",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
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
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initPdaWithSeed",
      "accounts": [
        {
          "name": "counterChecked",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
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
      "name": "pdas",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "counterChecked",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "doCpi",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "checkedMathTest",
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
      "name": "cloneVariables",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
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

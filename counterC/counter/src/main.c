/**
 * @brief C-based Counter BPF program
 */
#include <solana_sdk.h>

// Highly optimized version directly working on the incoming byte array (5 CU)
// extern uint64_t entrypoint(const uint8_t *input) {
//   ((uint8_t *)input)[96]++;
//   return SUCCESS;
// }

// Version that uses the SolAccountInfo struct with the deserialization it takes 96 CU
extern uint64_t entrypoint(const uint8_t *input) {
  SolAccountInfo accounts[2];
  SolParameters params = (SolParameters){.ka = accounts};

  if (!sol_deserialize(input, &params, SOL_ARRAY_SIZE(accounts))) {
      sol_log("Failed to deserialize input");
      return ERROR_INVALID_ARGUMENT;
  }

  uint8_t* data_ptr = params.ka[0].data;
  *data_ptr += 1;

  // Logging is expensive. Only do it when you really need to
  // sol_log_pubkey(params.ka[0].key);
  // sol_log_64(params.ka[0].data[0], 0, 0, 0, 0);

  return SUCCESS;
}

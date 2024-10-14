LOCAL_PATH := ./solana-c-sdk/c/

.PHONY: all clean

SRC_DIR ?= ./counter/src
OUT_DIR ?= ./counter/out

all: $(OUT_DIR)/solana_program_rosetta_helloworld.so

clean:
	rm -rf $(OUT_DIR)

LLVM_DIR = $(LOCAL_PATH)../dependencies/platform-tools/llvm
LLVM_SYSTEM_INC_DIRS := $(LLVM_DIR)/lib/clang/17/include
STD_INC_DIRS := $(LLVM_DIR)/include
STD_LIB_DIRS := $(LLVM_DIR)/lib

CC := $(LLVM_DIR)/bin/clang
LLD := $(LLVM_DIR)/bin/ld.lld

SYSTEM_INC_DIRS := \
  $(LOCAL_PATH)inc \
  $(LLVM_SYSTEM_INC_DIRS) \

C_FLAGS := \
  -Werror \
  -O2 \
  -fno-builtin \
  -std=c17 \
  $(addprefix -isystem,$(SYSTEM_INC_DIRS)) \
  $(addprefix -I,$(STD_INC_DIRS)) \
  -target sbf \
  -fPIC

SBF_LLD_FLAGS := \
  -z notext \
  -shared \
  --Bdynamic \
  $(LOCAL_PATH)sbf.ld \
  --entry entrypoint \
  -L $(STD_LIB_DIRS) \
  -lc \

$(OUT_DIR)/main.o: $(SRC_DIR)/main.c
	mkdir -p $(OUT_DIR)
	$(CC) $(C_FLAGS) -o $(OUT_DIR)/main.o -c $(SRC_DIR)/main.c

$(OUT_DIR)/solana_program_rosetta_helloworld.so: $(OUT_DIR)/main.o
	$(LLD) $(SBF_LLD_FLAGS) -o $(OUT_DIR)/solana_program_rosetta_helloworld.so $(OUT_DIR)/main.o

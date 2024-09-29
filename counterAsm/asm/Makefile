.PHONY: all clean

OUT_DIR ?= ./out

all: $(OUT_DIR)/solana_program_rosetta_helloworld.so

clean:
	rm -rf $(OUT_DIR)

LLVM_DIR := ../solana-llvm
STD_LIB_DIRS := $(LLVM_DIR)/lib

LLVM_MC := $(LLVM_DIR)/bin/llvm-mc
LLD := $(LLVM_DIR)/bin/ld.lld

SBF_LLD_FLAGS := \
  -z notext \
  -shared \
  --Bdynamic \
  $(LLVM_DIR)/sbf.ld \
  --entry entrypoint \
  -L $(STD_LIB_DIRS) \

$(OUT_DIR)/main.o: ./main.s
	mkdir -p $(OUT_DIR)
	$(LLVM_MC) -triple sbf -filetype=obj -o $(OUT_DIR)/main.o main.s

$(OUT_DIR)/solana_program_rosetta_helloworld.so: $(OUT_DIR)/main.o
	$(LLD) $(SBF_LLD_FLAGS) -o $(OUT_DIR)/solana_program_rosetta_helloworld.so $(OUT_DIR)/main.o

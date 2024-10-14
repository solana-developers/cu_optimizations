
target/deploy/solana_program_rosetta_helloworld.so:	file format elf64-bpf

Sections:
Idx Name          Size     VMA              Type
  0               00000000 0000000000000000 
  1 .text         00000030 0000000000000120 TEXT
  2 .dynamic      00000070 0000000000000150 
  3 .dynsym       00000048 00000000000001c0 
  4 .dynstr       00000019 0000000000000208 
  5 .shstrtab     0000002a 0000000000000000 

Disassembly of section .text:

0000000000000120 <entrypoint>:
      36:	71 12 60 00 00 00 00 00	r2 = *(u8 *)(r1 + 0x60)
      37:	07 02 00 00 01 00 00 00	r2 += 0x1
      38:	73 21 60 00 00 00 00 00	*(u8 *)(r1 + 0x60) = r2
      39:	b7 00 00 00 00 00 00 00	r0 = 0x0
      40:	95 00 00 00 00 00 00 00	exit

0000000000000148 <custom_panic>:
      41:	95 00 00 00 00 00 00 00	exit

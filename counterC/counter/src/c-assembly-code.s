	.text
	.file	"main.c"
	.globl	entrypoint                      # -- Begin function entrypoint
	.p2align	3
	.type	entrypoint,@function
entrypoint:                             # @entrypoint
# %bb.0:
	r2 = *(u8 *)(r1 + 96)
	r2 += 1
	*(u8 *)(r1 + 96) = r2
	r0 = 0
	exit
.Lfunc_end0:
	.size	entrypoint, .Lfunc_end0-entrypoint
                                        # -- End function
	.addrsig

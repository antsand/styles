# LoRA backward walkthrough

Opt-in with `.lora-backprop[data-lora-backprop="1"]`, a `[data-bp-host]`
mount and a `[data-bp-fallback]` containing the static eight-step explanation.
The shared ES module initializes through antsand-v2.js. No inline article scripts.

The deterministic two-output rank-one linear projection uses X=[1,2],
W=[[.63,-.47],[.28,.91]], A=[.1,-.2] column, B=[0,0], scale=1 and target class 1.
It is not a full transformer execution. Optional toy INT4 reconstruction has
fixed scale .2 and is explicitly not NF4 or GGUF. SGD uses lr .1; AdamW uses
lr .01, betas .9/.999, eps 1e-8 and zero decay. Two successive steps preserve
moment state. Navigation never applies extra optimizer updates.

Native select/buttons, disabled endpoint buttons, a polite live step region,
no automatic animation, keyboard-scrollable diagrams and static no-JS content.
Numerical fixtures and finite differences are generated independently in NumPy.
`node --test scripts/tests/lora-backprop-contract.test.mjs` checks displayed
results against those fixtures and the shared publication boundary.

export const getMessage = async (id: string) => {
  const paywallConfig = {
    pessimistic: true,
    persistentCheckout: true,
    title: "Check for Unlock Community Membership",
    skipRecipient: true,
    locks: {
      "0xb77030a7e47a5eb942a4748000125e70be598632": {
        name: "Unlock Community",
        network: 137,
      },
    },
    metadataInputs: [{ name: "email", type: "email", required: true }],
  };

  return {
    id,
    body: `This is the body set in messages.ts
    `,
    title: "This is the title set in messages.ts",
    description: "This is the description set in messages.ts",
    gate: {
      contract: "0xb77030a7e47a5eb942a4748000125e70be598632",
      network: 137,
    },
    checkoutUrl: `https://app.unlock-protocol.com/checkout?paywallConfig=${encodeURIComponent(
      JSON.stringify(paywallConfig)
    )}`,
  };
};

export default {
  providers: [
    {
      domain: process.env.CLERK_ISSUER_URL || "https://ace-cicada-11.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
};

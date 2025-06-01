module.exports = {
  apps: [
    {
      name: "glamo-admin",
      script: "npx",
      args: ["serve", "-s", "dist", "--listen=5000"],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

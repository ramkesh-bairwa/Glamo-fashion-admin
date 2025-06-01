module.exports = {
  apps: [
    {
      name: "glamo-admin",
      script: "npx",
      args: ["serve", "-s", "dist", "-l", "3001"],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

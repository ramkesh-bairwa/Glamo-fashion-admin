module.exports = {
  apps: [
    {
      name: "glamo-admin",
      script: "serve",
      args: ["-s", "dist", "--listen=5000"],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

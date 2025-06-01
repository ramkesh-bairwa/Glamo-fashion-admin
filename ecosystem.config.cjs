module.exports = {
  apps: [
    {
      name: "glamo-admin",
      script: "serve",
      args: ["-s", "dist", "-l", "5000"],
      interpreter: "node", // VERY IMPORTANT!
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

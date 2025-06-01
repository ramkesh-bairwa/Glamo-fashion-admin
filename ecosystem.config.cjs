// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "glamo-admin",
      script: "npx",
      args: ["serve", "-s", "dist", "--listen=5000"],
      exec_mode: "fork",
      wait_ready: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

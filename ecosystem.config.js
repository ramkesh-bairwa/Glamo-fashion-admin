module.exports = {
  apps: [
    {
      name: "glamo-admin",
      script: "serve",
      args: "dist -l 5000 --single",
      interpreter: "bash",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

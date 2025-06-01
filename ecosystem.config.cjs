module.exports = {
  apps: [
    {
      name: "glamo-admin",
      script: "serve",
      args: "-s dist -l 3001",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

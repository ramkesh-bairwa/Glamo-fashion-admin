module.exports = {
  apps: [
    {
      name: "glamo-ad",
      script: "serve",
      args: "-s dist -l 8080",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
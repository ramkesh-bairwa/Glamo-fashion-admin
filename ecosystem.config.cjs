module.exports = {
  apps: [
    {
      name: "glamo-ad",
      script: "npx",
      args: ["serve", "-s", "dist", "-l", "8080"],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

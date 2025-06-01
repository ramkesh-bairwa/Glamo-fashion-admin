module.exports = {
  apps: [
    {
      name: "glamo-admin",
      script: "npx serve -s dist -l 5000",
      interpreter: "node", // Important: This runs 'serve' as a Node.js CLI tool
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

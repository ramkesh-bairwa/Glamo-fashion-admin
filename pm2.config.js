module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: './server.js',
      cwd: './.next/standalone',
      interpreter: 'node',
      env: {
        PORT: 5000,
      },
    },
  ],
};

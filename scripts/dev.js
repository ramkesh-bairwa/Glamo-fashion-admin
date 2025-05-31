const { exec } = require('child_process');

const port = process.env.PORT || 5000;

exec(`next dev -p ${port}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});


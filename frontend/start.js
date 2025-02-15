const { exec } = require('child_process');

// Start the Vite server
exec('vite', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting Vite: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Vite stderr: ${stderr}`);
    return;
  }
  console.log(`Vite stdout: ${stdout}`);
}); 
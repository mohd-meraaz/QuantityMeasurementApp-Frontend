const fs = require('fs');
const path = require('path');
require('dotenv').config();

// This targets your production environment file
const targetPath = path.join(__dirname, '../src/environments/environment.ts');

const envConfigFile = `export const environment = {
  production: true,
  gatewayUrl: '${process.env.GATEWAY_URL || 'http://localhost:8080'}',
  googleClientId: '${process.env.GOOGLE_CLIENT_ID || ''}',
  googleRedirectUri: '${process.env.GOOGLE_REDIRECT_URI || ''}'
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error('Error writing environment file:', err);
    process.exit(1);
  }
  console.log(`Environment variables injected into ${targetPath}`);
});
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
  console.warn('.env file not found or could not be read. Continuing with existing schema provider.');
  process.exit(0);
}

// Extract DB_TYPE
const dbTypeMatch = envContent.match(/^DB_TYPE=(.*)$/m);
if (!dbTypeMatch) {
  console.warn('DB_TYPE not found in .env. Continuing with existing schema provider.');
  process.exit(0);
}

let dbType = dbTypeMatch[1].replace(/["']/g, '').trim();

// Ensure it is a valid provider
const validProviders = ['postgresql', 'mysql', 'sqlite', 'sqlserver', 'mongodb', 'cockroachdb'];
if (!validProviders.includes(dbType)) {
  console.error(`Invalid DB_TYPE "${dbType}". Valid options are: ${validProviders.join(', ')}.`);
  process.exit(1);
}

// Read schema.prisma
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Replace provider in datasource block only
const datasourceProviderRegex = /(datasource\s+db\s*{[^}]*provider\s*=\s*)["'][^"']+["']/;
if (datasourceProviderRegex.test(schemaContent)) {
  schemaContent = schemaContent.replace(datasourceProviderRegex, `$1"${dbType}"`);
  fs.writeFileSync(schemaPath, schemaContent);
  console.log(`Successfully updated Prisma schema datasource provider to "${dbType}"`);
} else {
  console.warn('Could not find provider declaration in schema.prisma.');
}

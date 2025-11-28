import { runMigrations, closeDatabase } from './database.js';

// Run migrations from CLI
runMigrations();
closeDatabase();

console.log('✅ Migrations completed successfully');


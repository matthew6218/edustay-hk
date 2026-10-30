import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const migrations=readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort();
function execute(args){const r=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state',...args],{stdio:'inherit'});if(r.status!==0)throw new Error('Migration command failed.');}
// Wrangler tracks filenames in d1_migrations when using migrations apply.
// The explicit --file helper is for fresh installations only; never replay applied SQL.
if(!process.argv.includes('--fresh'))throw new Error('Use --fresh only for a newly created local database. See README for later migrations.');
for(const file of migrations)execute(['--file','drizzle/'+file]);
console.log('Local schema created. Start the app, then run npm run db:seed.');

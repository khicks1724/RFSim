const {query} = require('./src/db');
query('SELECT id, email, full_name, is_admin FROM app_user ORDER BY id')
  .then(r => { console.log(JSON.stringify(r.rows, null, 2)); process.exit(0); })
  .catch(e => { console.error(e.message); process.exit(1); });

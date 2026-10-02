const fs = require('fs'); 
let f = 'generate_pdf_all.js'; 
let c = fs.readFileSync(f, 'utf8'); 
c = c.replace(/"file":\s*"(\d+)_([a-zA-Z_]+)\.c"/g, (m, p1) => { 
  let n = p1 + '.c'; 
  return fs.existsSync(n) ? '"file": "' + n + '"' : m; 
}); 
fs.writeFileSync(f, c); 
console.log('Fixed generate_pdf_all.js');

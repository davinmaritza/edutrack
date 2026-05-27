const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./app/api');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  if (content.includes("role !== 'ADMIN'") || content.includes("role === 'ADMIN'")) {
    if (!content.includes('import { RBAC }')) {
      content = 'import { RBAC } from "@/lib/rbac"\n' + content;
    }
    content = content.replace(/role !== 'ADMIN' && role !== 'TEACHER'/g, '!RBAC.canAccessAdminDashboard(role)');
    content = content.replace(/role !== 'ADMIN'/g, '!RBAC.isAdminLevel(role)');
    content = content.replace(/role === 'ADMIN' \|\| role === 'TEACHER'/g, 'RBAC.canAccessAdminDashboard(role)');
    content = content.replace(/role === 'ADMIN'/g, 'RBAC.isAdminLevel(role)');
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
});

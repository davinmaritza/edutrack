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

  // Fix: (session.user as any).!RBAC.isAdminLevel(role) => !RBAC.isAdminLevel((session.user as any).role)
  content = content.replace(/\(session\.user as any\)\.!RBAC\.isAdminLevel\(role\)/g, '!RBAC.isAdminLevel((session.user as any).role)');
  content = content.replace(/\(session\.user as any\)\.!RBAC\.canAccessAdminDashboard\(role\)/g, '!RBAC.canAccessAdminDashboard((session.user as any).role)');

  // Fix: session.user.!RBAC.isAdminLevel(role) => !RBAC.isAdminLevel(session.user.role)
  content = content.replace(/session\.user\.!RBAC\.isAdminLevel\(role\)/g, '!RBAC.isAdminLevel(session.user.role)');
  
  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log('Fixed ' + f);
  }
});

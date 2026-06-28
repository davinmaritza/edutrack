const fs = require('fs');
const files = [
  'app/(dashboard)/student/exams/page.tsx',
  'app/(dashboard)/student/exams/[id]/ExamPlayer.tsx',
  'app/(dashboard)/student/finance/page.tsx',
  'app/(dashboard)/student/library/page.tsx'
];

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  // replace backslash followed by backtick with just backtick
  text = text.replace(/\\`/g, '`');
  fs.writeFileSync(f, text);
  console.log('Fixed', f);
});

const fs = require('fs');

let content = fs.readFileSync('src/components/SidebarRight.tsx', 'utf8');

// Add Tooltip import
if (!content.includes("import { Tooltip }")) {
  content = content.replace("import { TokenType } from '../types';", "import { TokenType } from '../types';\nimport { Tooltip } from './Tooltip';");
}

// Modify compactness
content = content.replace('p-2 bg-white/90', 'p-1 bg-white/90');
content = content.replace('gap-3 p-1', 'gap-1.5 p-1'); // Actually, let's just do a string replace on the container:
content = content.replace('className="flex flex-col gap-3 p-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm items-center w-12"',
'className="flex flex-col gap-1.5 p-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm items-center w-10 overflow-y-auto max-h-[80vh] no-scrollbar"');

content = content.replace(/gap-3 w-full/g, 'gap-2 w-full');
content = content.replace(/p-1\.5/g, 'p-1');
content = content.replace(/w-8 h-8/g, 'w-6 h-6');

// We need to wrap things with Tooltip that have a `title="..."` attribute.
const titleRegex = /<([a-zA-Z]+)([^>]*)title="([^"]+)"([^>]*)>/g;
let lastIndex = 0;
let newContent = '';

while (true) {
  const match = titleRegex.exec(content);
  if (!match) {
    newContent += content.substring(lastIndex);
    break;
  }
  newContent += content.substring(lastIndex, match.index);
  
  // Replace title attribute
  const openTag = `<${match[1]}${match[2]}${match[4]}>`;
  newContent += `<Tooltip content="${match[3]}" side="left">\n          ${openTag}`;
  
  // Find closing tag
  let endTag = `</${match[1]}>`;
  let endIndex = content.indexOf(endTag, titleRegex.lastIndex);
  if (endIndex !== -1) {
    newContent += content.substring(titleRegex.lastIndex, endIndex + endTag.length);
    newContent += `\n          </Tooltip>`;
    lastIndex = endIndex + endTag.length;
    titleRegex.lastIndex = lastIndex; // Update lastIndex to prevent infinite loops
  } else {
    // Self closing?
    if (openTag.endsWith('/>')) {
        newContent += `\n          </Tooltip>`;
        lastIndex = titleRegex.lastIndex;
    }
  }
}

// But wait, there are also buttons without title? No, we will add Tooltip to existing title attributes.
// Let's just do this string replace and see what happens.
fs.writeFileSync('src/components/SidebarRight.tsx', newContent);

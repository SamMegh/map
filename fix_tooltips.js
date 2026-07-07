import fs from 'fs';

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import if not present
  if (!content.includes('import { Tooltip }')) {
    if (content.includes("import { TokenType }")) {
      content = content.replace("import { TokenType } from '../types';", "import { TokenType } from '../types';\nimport { Tooltip } from './Tooltip';");
    } else if (content.includes("import { ToolType")) {
      content = content.replace("import { ToolType", "import { Tooltip } from './Tooltip';\nimport { ToolType");
    } else if (file.includes("Bars.tsx")) {
      content = content.replace("import { MapData, GameData }", "import { Tooltip } from './Tooltip';\nimport { MapData, GameData }");
    }
  }

  // Replace title attributes for specific tags
  const regex = /<(button|div|label)([^>]*)title="([^"]+)"([^>]*)>/g;
  
  let newContent = '';
  let lastIndex = 0;

  let side = 'bottom';
  if (file.includes('SidebarRight')) side = 'left';
  if (file.includes('SidebarLeft')) side = 'right';
  if (file.includes('Bars') && file.includes('TopBar')) side = 'bottom';
  if (file.includes('Bars') && file.includes('BottomBar')) side = 'top';

  let match;
  while ((match = regex.exec(content)) !== null) {
    newContent += content.substring(lastIndex, match.index);
    const tag = match[1];
    const before = match[2];
    const title = match[3];
    const after = match[4];
    
    // Check if it's self closing
    if (after.trim().endsWith('/>')) {
      newContent += `<Tooltip content="${title}" side="${side}">\n<${tag}${before}${after.replace('/>', ' />')}\n</Tooltip>`;
      lastIndex = regex.lastIndex;
      continue;
    }

    newContent += `<Tooltip content="${title}" side="${side}">\n<${tag}${before}${after}>`;
    
    // find closing tag
    const closeTag = `</${tag}>`;
    let closeIdx = content.indexOf(closeTag, regex.lastIndex);
    if (closeIdx !== -1) {
      newContent += content.substring(regex.lastIndex, closeIdx + closeTag.length);
      newContent += `\n</Tooltip>`;
      lastIndex = closeIdx + closeTag.length;
      regex.lastIndex = lastIndex;
    } else {
      lastIndex = regex.lastIndex;
    }
  }
  newContent += content.substring(lastIndex);

  // If SidebarRight, let's also fix some styles
  if (file.includes('SidebarRight')) {
    newContent = newContent.replace('p-2 bg-white/90', 'p-1 bg-white/90');
    newContent = newContent.replace('gap-3 p-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm items-center w-12', 'gap-1.5 p-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm items-center w-10 overflow-y-auto max-h-[80vh] no-scrollbar');
    newContent = newContent.replace(/gap-3 w-full/g, 'gap-1.5 w-full');
    newContent = newContent.replace(/p-1\.5/g, 'p-1');
  }

  // If SidebarLeft, let's also fix some styles
  if (file.includes('SidebarLeft')) {
    newContent = newContent.replace('p-2 rounded-md transition-colors', 'p-1.5 rounded-md transition-colors');
    newContent = newContent.replace('w-5 h-5', 'w-4 h-4'); // button icons slightly smaller
    newContent = newContent.replace('w-12 items-center', 'w-10 items-center overflow-y-auto max-h-[80vh] no-scrollbar');
  }

  fs.writeFileSync(file, newContent);
}

fixFile('src/components/SidebarRight.tsx');
fixFile('src/components/SidebarLeft.tsx');
fixFile('src/components/Bars.tsx');

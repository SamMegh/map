import re
import os

def fix_file(filepath, side):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'import { Tooltip }' not in content:
        if 'import { TokenType' in content:
            content = content.replace("import { TokenType", "import { Tooltip } from './Tooltip';\nimport { TokenType")
        elif 'import { ToolType' in content:
            content = content.replace("import { ToolType", "import { Tooltip } from './Tooltip';\nimport { ToolType")
        elif 'import { MapData' in content:
            content = content.replace("import { MapData", "import { Tooltip } from './Tooltip';\nimport { MapData")
        elif 'import { Stage' in content:
            content = content.replace("import { Stage", "import { Tooltip } from './Tooltip';\nimport { Stage")

    def replacer(match):
        tag = match.group(1)
        before = match.group(2)
        title = match.group(3)
        after = match.group(4)
        
        # Determine side for Bars.tsx
        s = side
        if filepath.endswith('Bars.tsx'):
            # simple heuristic: if it's in TopBar, bottom. BottomBar, top.
            s = 'bottom' # just use bottom as default for now
            
        if after.strip().endswith('/>'):
            after = after.replace('/>', ' />')
            return f'<Tooltip content="{title}" side="{s}">\n<{tag}{before}{after[:-3]} />\n</Tooltip>'
        
        return f'<Tooltip content="{title}" side="{s}">\n<{tag}{before}{after}>'

    # we need to find closing tags... actually regex isn't great for nested closing tags, 
    # but for these simple buttons it's fine if we do it carefully.
    # Instead, let's just do it directly with a simpler regex that matches the whole tag up to its closing tag.
    # Because most of our buttons are simple <button...> ... </button>
    
    # We will use re.sub with a custom function
    # Match <tag ... title="something" ...> ... </tag>
    # This regex matches the open tag, and then we find the matching close tag.
    
    pattern = re.compile(r'<(button|div|label)([^>]*)title="([^"]+)"([^>]*)>')
    
    parts = []
    last_idx = 0
    for match in pattern.finditer(content):
        parts.append(content[last_idx:match.start()])
        
        tag = match.group(1)
        before = match.group(2)
        title = match.group(3)
        after = match.group(4)
        
        s = side
        if after.strip().endswith('/>'):
            parts.append(f'<Tooltip content="{title}" side="{s}">\n<{tag}{before}{after.replace("/>", " />")}\n</Tooltip>')
            last_idx = match.end()
            continue
            
        parts.append(f'<Tooltip content="{title}" side="{s}">\n<{tag}{before}{after}>')
        
        # find closing tag
        closing = f'</{tag}>'
        close_idx = content.find(closing, match.end())
        if close_idx != -1:
            parts.append(content[match.end():close_idx + len(closing)])
            parts.append(f'\n</Tooltip>')
            last_idx = close_idx + len(closing)
        else:
            last_idx = match.end()
            
    parts.append(content[last_idx:])
    new_content = "".join(parts)
    
    with open(filepath, 'w') as f:
        f.write(new_content)

fix_file('src/components/SidebarRight.tsx', 'left')
fix_file('src/components/Bars.tsx', 'bottom')
fix_file('src/components/TacMap.tsx', 'left')


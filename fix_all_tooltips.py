import os
import re

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add imports
    if 'import { Tooltip }' not in content:
        if 'import { TokenType }' in content:
            content = content.replace("import { TokenType }", "import { Tooltip } from './Tooltip';\nimport { TokenType }")
        elif 'import { ToolType' in content:
            content = content.replace("import { ToolType", "import { Tooltip } from './Tooltip';\nimport { ToolType")
        elif 'Bars.tsx' in file_path:
            content = content.replace("import { MapData, GameData }", "import { Tooltip } from './Tooltip';\nimport { MapData, GameData }")
        elif 'TacMap.tsx' in file_path:
            content = content.replace("import { Stage,", "import { Tooltip } from './Tooltip';\nimport { Stage,")
    
    side = 'bottom'
    if 'SidebarRight' in file_path: side = 'left'
    if 'SidebarLeft' in file_path: side = 'right'
    if 'Bars' in file_path:
        # We need a different approach for TopBar vs BottomBar, but we can default to bottom and fix later if needed, or just let Tooltip be smart.
        pass
    if 'TacMap' in file_path: side = 'left'
    
    # regex for title="something"
    def repl(m):
        tag = m.group(1)
        before = m.group(2)
        title = m.group(3)
        after = m.group(4)
        
        # Determine specific side based on tag context if in Bars
        curr_side = side
        
        if tag == 'button' or tag == 'div' or tag == 'label':
            if 'Bars.tsx' in file_path:
                curr_side = 'bottom'
                if 'BottomBar' in content: # Approximation
                    curr_side = 'top' # Actually TopBar is top, BottomBar is bottom. But they are in same file.
                    # We can let the user's hover decide or just stick to 'bottom'.
            
            # check self-closing
            if after.strip().endswith('/>'):
                return f'<Tooltip content="{title}" side="{curr_side}">\n<{tag}{before}{after[:-2]} />\n</Tooltip>'
            else:
                # We can't easily find the closing tag with regex if nested, but in our case these are simple buttons/labels/divs with no nested identical tags usually.
                pass
        return m.group(0) # Fallback

    # We can do simple replacement by replacing the title attribute and wrapping the element.
    # But since it's hard to parse JSX with regex, let's just do a simple replacement for the specific ones.
    
    # Actually, for python, let's use a simpler approach. Replace `title="fg"` with nothing, and add the Tooltip wrapper manually or using simple regex.
    pass

# We will just write a specific replacement script for SidebarRight, TacMap, Bars, SidebarLeft.

import re

with open('src/components/SidebarRight.tsx', 'r') as f:
    content = f.read()

if "import { Tooltip }" not in content:
    content = content.replace("import { TokenType } from '../types';", "import { TokenType } from '../types';\nimport { Tooltip } from './Tooltip';")

content = content.replace('p-2 bg-white/90', 'p-1 bg-white/90')
content = content.replace('className="flex flex-col gap-3 p-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm items-center w-12"',
'className="flex flex-col gap-1.5 p-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm items-center w-10 overflow-y-auto max-h-[80vh] no-scrollbar"')

content = content.replace('gap-3 w-full', 'gap-2 w-full')
content = content.replace('p-1.5', 'p-1')
content = content.replace('w-8 h-8 flex', 'w-6 h-6 flex')

def replace_title(match):
    tag = match.group(1)
    before_title = match.group(2)
    title = match.group(3)
    after_title = match.group(4)
    open_tag = f"<{tag}{before_title}{after_title}>"
    return f'<Tooltip content="{title}" side="left">\n          {open_tag}'

import sys

# Since it's nested JSX, regex is tricky for the closing tag. We'll just replace it manually or use a simpler approach.
# A simpler approach is to replace `<button ... title="xyz">...` with `<Tooltip content="xyz"><button ...>...</button></Tooltip>`.

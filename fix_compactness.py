import re
import os

with open('src/components/SidebarRight.tsx', 'r') as f:
    content = f.read()

content = content.replace('p-2 bg-white/90', 'p-1 bg-white/90')
content = content.replace('className="flex flex-col gap-3 p-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm items-center w-12"', 'className="flex flex-col gap-1.5 p-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm items-center w-10 overflow-y-auto max-h-[80vh] no-scrollbar"')
content = content.replace('gap-3 w-full', 'gap-1.5 w-full')
content = content.replace('p-1.5 rounded-md', 'p-1 rounded-md')
content = content.replace('w-8 h-8 flex', 'w-6 h-6 flex')
content = content.replace('w-6 h-6 rounded-md border', 'w-5 h-5 rounded-md border')
content = content.replace('w-6 h-6 rounded-md border border-neutral-300', 'w-5 h-5 rounded-md border border-neutral-300')
content = content.replace('w-[10px]', 'w-[8px]')
content = content.replace('border-l-[10px] border-r-[10px]', 'border-l-[8px] border-r-[8px]')
content = content.replace('border-t-[16px]', 'border-t-[12px]')
content = content.replace('border-b-[16px]', 'border-b-[12px]')

with open('src/components/SidebarRight.tsx', 'w') as f:
    f.write(content)

import fs from 'fs';

let content = fs.readFileSync('src/components/SidebarLeft.tsx', 'utf8');

content = content.replace(
  /const Button = \(\{ tool, icon: Icon \}: \{ tool: ToolType, icon: any \}\) => \([\s\S]*?<\/button>\n  \);/,
`  const Button = ({ tool, icon: Icon, shortcut }: { tool: ToolType, icon: any, shortcut?: string }) => {
    let title = tool.charAt(0).toUpperCase() + tool.slice(1);
    if (shortcut) title += \` (\${shortcut})\`;
    return (
      <Tooltip content={title} side="right">
        <button
          onClick={() => setActiveTool(tool)}
          className={\`p-1.5 rounded-md transition-colors \${
            activeTool === tool
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 ring-2 ring-blue-500'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }\`}
        >
          <Icon className="w-4 h-4" />
        </button>
      </Tooltip>
    );
  };`
);

content = content.replace('<Button tool="select" icon={MousePointer2} />', '<Button tool="select" icon={MousePointer2} shortcut="S" />');
content = content.replace('<Button tool="pen" icon={Pen} />', '<Button tool="pen" icon={Pen} shortcut="P" />');
content = content.replace('<Button tool="eraser" icon={Eraser} />', '<Button tool="eraser" icon={Eraser} shortcut="E" />');
content = content.replace('<Button tool="arrow" icon={ArrowUpRight} />', '<Button tool="arrow" icon={ArrowUpRight} shortcut="A" />');
content = content.replace('<Button tool="text" icon={Type} />', '<Button tool="text" icon={Type} shortcut="T" />');
content = content.replace('<Button tool="ruler" icon={Ruler} />', '<Button tool="ruler" icon={Ruler} shortcut="R" />');

// also replace multiple overflow-y-auto no-scrollbar
content = content.replace('overflow-y-auto max-h-[80vh] no-scrollbar overflow-y-auto no-scrollbar', 'overflow-y-auto max-h-[80vh] no-scrollbar');

fs.writeFileSync('src/components/SidebarLeft.tsx', content);

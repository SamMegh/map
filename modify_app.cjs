const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /import \{ SidebarLeft \} from '\.\/components\/SidebarLeft';/,
  "import { SidebarLeft } from './components/SidebarLeft';\nimport { FloatingControlBar } from './components/FloatingControlBar';"
);

const stateInsert = `
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [showTopBar, setShowTopBar] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [showSidebarLeft, setShowSidebarLeft] = useState(true);
  const [showSidebarRight, setShowSidebarRight] = useState(true);
`;

code = code.replace(
  /const \[showShortcutsModal, setShowShortcutsModal\] = useState\(false\);\s*const \[showSettingsModal, setShowSettingsModal\] = useState\(false\);/,
  stateInsert
);

code = code.replace(
  /<TopBar/,
  '{showTopBar && <TopBar'
);

code = code.replace(
  /setAutoSaveFrequency={setAutoSaveFrequency}\s*\/>/,
  'setAutoSaveFrequency={setAutoSaveFrequency}\n      />}'
);

code = code.replace(
  /<SidebarLeft/,
  '{showSidebarLeft && <SidebarLeft'
);

code = code.replace(
  /setIsLocked={setIsLocked}\s*\/>/,
  'setIsLocked={setIsLocked}\n      />}'
);

code = code.replace(
  /<SidebarRight/,
  '{showSidebarRight && <SidebarRight'
);

code = code.replace(
  /showLines={showLines}\s*setShowLines={setShowLines}\s*gameMode={gameMode}\s*\/>/,
  'showLines={showLines}\n        setShowLines={setShowLines}\n        gameMode={gameMode}\n      />}'
);

code = code.replace(
  /<BottomBar/,
  '{showBottomBar && <BottomBar'
);

code = code.replace(
  /onShowSettings=\{\(\) => setShowSettingsModal\(true\)\}\s*\/>/,
  'onShowSettings={() => setShowSettingsModal(true)}\n      />}'
);

const controlBar = `
      <FloatingControlBar
        showTop={showTopBar}
        setShowTop={setShowTopBar}
        showBottom={showBottomBar}
        setShowBottom={setShowBottomBar}
        showLeft={showSidebarLeft}
        setShowLeft={setShowSidebarLeft}
        showRight={showSidebarRight}
        setShowRight={setShowSidebarRight}
      />
`;

code = code.replace(/\{showTopBar && <TopBar/, controlBar + '      {showTopBar && <TopBar');

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx");

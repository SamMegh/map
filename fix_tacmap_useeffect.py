import re

with open('src/components/TacMap.tsx', 'r') as f:
    content = f.read()

content = content.replace('''    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };''', '''    const handleResize = () => {
      if (containerRef.current) {
        setDimensions(prev => {
          if (prev.width === window.innerWidth && prev.height === window.innerHeight) return prev;
          return {
            width: window.innerWidth,
            height: window.innerHeight
          };
        });
      }
    };''')

with open('src/components/TacMap.tsx', 'w') as f:
    f.write(content)


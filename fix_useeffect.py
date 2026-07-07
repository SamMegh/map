import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Extract the useEffect
start_marker = "  useEffect(() => {\n    const handleKeyDown = (e: KeyboardEvent) => {"
end_marker = "  }, [history, historyIndex, undo, redo, frames, saveStrategy, currentFrameIndex, lines, addFrame]);"

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Could not find start_marker")
else:
    end_idx = content.find(end_marker, start_idx) + len(end_marker)
    use_effect_block = content[start_idx:end_idx]
    
    # Remove from original place
    content = content[:start_idx] + content[end_idx:]
    
    # Insert before "  const activeMap ="
    insert_marker = "  const activeMap = filteredMaps.find(m => m.id === activeMapId) || filteredMaps[0] || defaultMaps[0];\n\n  return ("
    insert_idx = content.find(insert_marker)
    
    if insert_idx != -1:
        content = content[:insert_idx] + use_effect_block + "\n\n" + content[insert_idx:]
        with open('src/App.tsx', 'w') as f:
            f.write(content)
        print("Success")
    else:
        print("Could not find insert_marker")

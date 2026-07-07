import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { defaultMaps, gamesData } from './data/maps';", "import { defaultMaps, gamesData, MapData } from './data/maps';")

with open('src/App.tsx', 'w') as f:
    f.write(content)

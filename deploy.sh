#!/bin/bash
cd "$(dirname "$0")" && python3 - <<'P'
import json
html=open('src/page.html').read()
js=open('src/index.js').read().replace("import HTML from './page.html';","const HTML = "+json.dumps(html)+";")
import time
B=str(int(time.time()))
open('pages/dist/_worker.js','w').write(js.replace('__BUILD__',B).replace('const HTML = '+json.dumps(html),'const HTML = '+json.dumps(html.replace('__BUILD__',B))))
P
cd pages && npx wrangler pages deploy dist --project-name YOUR-PROJECT-NAME --branch main 2>&1 | tail -3

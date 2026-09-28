#!/usr/bin/env bash
# bash score.sh <round> — render shot-<round>.png, then have Codex score it → review-<round>.md
set -e
cd "$(dirname "$0")"
R="$1"
NODE_PATH="c:/Users/aaron/OneDrive/Honest Echo LLC/Antigravity/HE-Pursuit/dashboard/node_modules" node capture.cjs "$R"
python -c "
import json,sys
r=sys.argv[1]; c=json.load(open(f'copy-{r}.json',encoding='utf-8'))
p=open('taste-prompt.txt',encoding='utf-8').read().replace('{{COPY}}', f'TITLE ({len(c[\"title\"])} chars): {c[\"title\"]}\nDESCRIPTION ({len(c[\"description\"])} chars): {c[\"description\"]}')
import os
prev=f'review-{int(r)-1}.md'
if os.path.exists(prev): p+='\n\nYour previous round review (the copy above is the revision; do not reverse a fix you asked for unless it made things worse):\n'+open(prev,encoding='utf-8').read()
open(f'prompt-{r}.txt','w',encoding='utf-8').write(p)
" "$R"
codex exec --skip-git-repo-check -i "shot-$R.png" - < "prompt-$R.txt" > "review-$R.raw" 2> "codex-stderr-$R.txt"
python -c "
import sys,re; s=open(sys.argv[1],encoding='utf-8').read(); open(sys.argv[2],'w',encoding='utf-8').write(s.strip())
print(s.strip()[-1500:])" "review-$R.raw" "review-$R.md"

cd workspace
git reflog expire --all --expire=now
git gc --prune=now --aggressive
cd ..

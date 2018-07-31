git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch include\DBConfig.php' \
--prune-empty --tag-name-filter cat -- --all

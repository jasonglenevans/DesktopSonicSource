git init
git rm -r --cached node_modules
git add .
git commit -m "upload"
git branch -M main
git remote add origin https://github.com/jasonglenevans/DesktopSonicSource.git
git push -u origin main
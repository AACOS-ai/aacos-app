#!/bin/bash
echo "Cleaning Python/Node.js/Editor artifacts..."
rm -rf __pycache__/ node_modules/ .next/ out/ test-results/ coverage/ dist/ build/
rm -f *.py[cod] *.pyo *.env *.sqlite3 *.log package-lock.json yarn.lock npm-debug.log*
rm -f .DS_Store .idea/ .vscode/ *.swp *.bak *.test.js *.test.ts *.tgz
rm -rf frontend/.env backend/.env frontend/test-results/ backend/test-results/
echo "Done. You can now git status to see a clean tree!"

#!/bin/bash
cd /home/kavia/workspace/code-generation/fairyfinance--magicmetrics-64825-96545db0/fairyfinance_magicmetrics
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


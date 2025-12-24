#!/bin/bash

# Define the folders and files that should trigger a rebuild
# Vercel will skip the build if this command returns 0 (success/no diff)
# Vercel will proceed with the build if this command returns 1 (failure/diff found)

git diff --quiet HEAD^ HEAD -- \
  app/ \
  components/ \
  hooks/ \
  lib/ \
  public/ \
  styles/ \
  types/ \
  package.json \
  tailwind.config.ts \
  postcss.config.js \
  tsconfig.json \
  next.config.mjs

# If git diff --quiet finds changes in these paths, it returns 1 (proceed build)
# If it finds NO changes, it returns 0 (ignore build)

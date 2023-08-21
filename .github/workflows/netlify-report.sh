#!/usr/bin/env bash

set -e

OUTPUT=$(npx netlify-cli@15.11.0 deploy --site $NETLIFY_SITE_ID --dir report --auth $NETLIFY_DEPLOY_TOKEN)
NETLIFY_DEPLOY_PREVIEW_URL=$(echo $OUTPUT | grep "Website [Dd]raft URL:" | sed -E 's/(.*)Website [Dd]raft URL: //g' | sed -E 's/ If everything looks(.*)//g')/report.html
echo "✅ Site deployed to: $NETLIFY_DEPLOY_PREVIEW_URL"

echo "NETLIFY_PREVIEW_URL=$NETLIFY_DEPLOY_PREVIEW_URL" >> $GITHUB_ENV

#!/bin/bash

# Create new session context
# Usage: ./create-session.sh [user_id] [project] [primary_objective]

set -e

# Configuration
CONTEXT_DIR=".agent-os/context/sessions"
TEMPLATE_FILE=".agent-os/context/sessions/session-template.yml"

# Default values
USER_ID=${1:-"default-user"}
PROJECT=${2:-"agent-os-v2"}
PRIMARY_OBJECTIVE=${3:-"General development work"}

# Generate session ID
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H%M%S)
SESSION_ID="session-${DATE}-${TIME}"

# Generate timestamp
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Create session file
SESSION_FILE="${CONTEXT_DIR}/${SESSION_ID}.yml"

echo "Creating new session: ${SESSION_ID}"
echo "User: ${USER_ID}"
echo "Project: ${PROJECT}"
echo "Objective: ${PRIMARY_OBJECTIVE}"

# Copy template and substitute variables
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Error: Template file not found at $TEMPLATE_FILE"
    exit 1
fi

cp "$TEMPLATE_FILE" "$SESSION_FILE"

# Substitute template variables
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/{{DATE}}/${DATE}/g" "$SESSION_FILE"
    sed -i '' "s/{{TIME}}/${TIME}/g" "$SESSION_FILE"
    sed -i '' "s/{{TIMESTAMP}}/${TIMESTAMP}/g" "$SESSION_FILE"
    sed -i '' "s/{{USER_ID}}/${USER_ID}/g" "$SESSION_FILE"
    sed -i '' "s/{{PRIMARY_OBJECTIVE}}/${PRIMARY_OBJECTIVE}/g" "$SESSION_FILE"
else
    # Linux
    sed -i "s/{{DATE}}/${DATE}/g" "$SESSION_FILE"
    sed -i "s/{{TIME}}/${TIME}/g" "$SESSION_FILE"
    sed -i "s/{{TIMESTAMP}}/${TIMESTAMP}/g" "$SESSION_FILE"
    sed -i "s/{{USER_ID}}/${USER_ID}/g" "$SESSION_FILE"
    sed -i "s/{{PRIMARY_OBJECTIVE}}/${PRIMARY_OBJECTIVE}/g" "$SESSION_FILE"
fi

echo "Session created: ${SESSION_FILE}"

# Set current session symlink
cd "$(dirname "$0")/.."
ln -sf "sessions/${SESSION_ID}.yml" current-session.yml

echo "Current session set to: ${SESSION_ID}"

# Create basic user profile if it doesn't exist
USER_FILE="users/${USER_ID}.yml"
if [ ! -f "$USER_FILE" ]; then
    echo "Creating user profile: ${USER_FILE}"
    cp "users/user-template.yml" "$USER_FILE"
    
    # Basic substitutions for user template
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/{{USER_ID}}/${USER_ID}/g" "$USER_FILE"
        sed -i '' "s/{{USER_NAME}}/${USER_ID}/g" "$USER_FILE"
        sed -i '' "s/{{CREATED_DATE}}/${TIMESTAMP}/g" "$USER_FILE"
        sed -i '' "s/{{LAST_ACTIVE}}/${TIMESTAMP}/g" "$USER_FILE"
    else
        sed -i "s/{{USER_ID}}/${USER_ID}/g" "$USER_FILE"
        sed -i "s/{{USER_NAME}}/${USER_ID}/g" "$USER_FILE"
        sed -i "s/{{CREATED_DATE}}/${TIMESTAMP}/g" "$USER_FILE"
        sed -i "s/{{LAST_ACTIVE}}/${TIMESTAMP}/g" "$USER_FILE"
    fi
fi

echo ""
echo "Session setup complete!"
echo "Session ID: ${SESSION_ID}"
echo "Session file: ${SESSION_FILE}"
echo "To resume this session later, run: ./resume-session.sh ${SESSION_ID}"
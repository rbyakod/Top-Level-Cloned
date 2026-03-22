#!/bin/bash

# Resume existing session context
# Usage: ./resume-session.sh [session_id]

set -e

# Configuration
CONTEXT_DIR=".agent-os/context/sessions"

# Get session ID
SESSION_ID=${1}

if [ -z "$SESSION_ID" ]; then
    echo "Usage: ./resume-session.sh [session_id]"
    echo ""
    echo "Available sessions:"
    ls -1 "${CONTEXT_DIR}/"*.yml 2>/dev/null | sed 's/.*\///' | sed 's/\.yml$//' | grep -v template || echo "No sessions found"
    exit 1
fi

SESSION_FILE="${CONTEXT_DIR}/${SESSION_ID}.yml"

# Check if session exists
if [ ! -f "$SESSION_FILE" ]; then
    echo "Error: Session file not found: $SESSION_FILE"
    echo ""
    echo "Available sessions:"
    ls -1 "${CONTEXT_DIR}/"*.yml 2>/dev/null | sed 's/.*\///' | sed 's/\.yml$//' | grep -v template || echo "No sessions found"
    exit 1
fi

# Load session context
echo "Resuming session: ${SESSION_ID}"
echo "Loading session context..."

# Extract key information from session file
USER_ID=$(grep "^user_id:" "$SESSION_FILE" | cut -d'"' -f2)
PROJECT=$(grep "^project:" "$SESSION_FILE" | cut -d'"' -f2)
STATUS=$(grep "^status:" "$SESSION_FILE" | awk '{print $2}')
START_TIME=$(grep "^start_time:" "$SESSION_FILE" | cut -d'"' -f2)

echo "User: ${USER_ID}"
echo "Project: ${PROJECT}"
echo "Status: ${STATUS}"
echo "Started: ${START_TIME}"

# Check for active workflow
CURRENT_WORKFLOW=$(grep "^current_workflow:" "$SESSION_FILE" | awk '{print $2}')
if [ "$CURRENT_WORKFLOW" != "null" ] && [ -n "$CURRENT_WORKFLOW" ]; then
    echo "Active workflow: ${CURRENT_WORKFLOW}"
    WORKFLOW_STATE=$(grep "^workflow_state:" "$SESSION_FILE" | awk '{print $2}')
    echo "Workflow state: ${WORKFLOW_STATE}"
fi

# Set current session symlink
cd "$(dirname "$0")/.."
ln -sf "sessions/${SESSION_ID}.yml" current-session.yml

# Update last active time for user
USER_FILE="users/${USER_ID}.yml"
if [ -f "$USER_FILE" ]; then
    TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/^last_active:.*/last_active: \"${TIMESTAMP}\"/" "$USER_FILE"
    else
        sed -i "s/^last_active:.*/last_active: \"${TIMESTAMP}\"/" "$USER_FILE"
    fi
fi

# Show recent session activity
echo ""
echo "Recent session activity:"
echo "========================"

# Show decisions made
DECISIONS=$(grep -A 5 "^decisions:" "$SESSION_FILE" | grep -E "^\s*-" | head -3)
if [ -n "$DECISIONS" ]; then
    echo "Recent decisions:"
    echo "$DECISIONS"
else
    echo "No decisions recorded yet"
fi

# Show problems encountered
echo ""
PROBLEMS=$(grep -A 5 "^problems:" "$SESSION_FILE" | grep -E "^\s*-" | head -3)
if [ -n "$PROBLEMS" ]; then
    echo "Problems encountered:"
    echo "$PROBLEMS"
else
    echo "No problems recorded"
fi

# Show continuation context
echo ""
echo "Continuation context:"
echo "===================="
PENDING_TASKS=$(grep -A 10 "continuation_context:" "$SESSION_FILE" | grep -A 5 "pending_tasks:" | grep -E "^\s*-")
if [ -n "$PENDING_TASKS" ]; then
    echo "Pending tasks:"
    echo "$PENDING_TASKS"
fi

NEXT_PRIORITIES=$(grep -A 10 "continuation_context:" "$SESSION_FILE" | grep -A 5 "next_priorities:" | grep -E "^\s*-")
if [ -n "$NEXT_PRIORITIES" ]; then
    echo "Next priorities:"
    echo "$NEXT_PRIORITIES"
fi

echo ""
echo "Session resumed successfully!"
echo "Session file: ${SESSION_FILE}"
echo "Continue your work where you left off."
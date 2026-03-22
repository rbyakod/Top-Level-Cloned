# Agent OS Context Management

## Overview
Context preservation system for maintaining state across sessions, users, and workflows in Agent OS v2.0.

## Directory Structure
```
context/
├── sessions/     # Individual work sessions and continuity
├── users/        # User preferences and history
└── workflows/    # Workflow state and progress tracking
```

## Session Context Management

### Session Files
Each session creates a context file:
```yaml
# sessions/session-2025-09-01-1234.yml
session_id: session-2025-09-01-1234
start_time: 2025-09-01T12:34:56Z
user_id: developer-1
project: agent-os-v2
status: active

# Active workflow context
current_workflow: /fix-bug
workflow_state: in_progress
step: 3_of_5
agents_active: [qa-engineer, backend-engineer]

# Decisions made this session
decisions:
  - timestamp: 2025-09-01T12:35:00Z
    type: technology_choice
    choice: use_postgresql
    reasoning: matches existing stack

# Problems encountered
problems:
  - timestamp: 2025-09-01T12:40:00Z
    type: dependency_conflict
    description: jest version mismatch
    resolution: updated to latest compatible version

# Knowledge captured
learned:
  - pattern: rapid-test-fix
    success: true
    time_saved: 10_minutes
```

### Session Continuity
```bash
# Resume from previous session
./resume-session.sh session-2025-09-01-1234

# Start new session with context
./start-session.sh --continue-from session-2025-09-01-1234
```

## User Context Management

### User Profile
```yaml
# users/developer-1.yml
user_id: developer-1
name: Developer One
created: 2025-09-01T10:00:00Z
preferences:
  default_stack: next.js
  testing_framework: jest
  deployment: vercel
  database: postgresql
  
# Learning from this user
success_patterns:
  - workflow: /fix-bug
    average_time: 12_minutes
    success_rate: 95%
  - workflow: /build-mvp
    average_time: 3.5_hours
    success_rate: 90%

# User feedback history
feedback_given:
  positive: 47
  negative: 3
  suggestions: 12

# Preferred agents
favorite_agents:
  - frontend-engineer: 89% satisfaction
  - qa-engineer: 85% satisfaction
  - ui-designer: 82% satisfaction
```

### User Personalization
- Agents adapt communication style to user preferences
- Workflows optimize for user's typical patterns
- Technology choices align with user's stack
- Time estimates based on user's historical performance

## Workflow Context Management

### Workflow State Tracking
```yaml
# workflows/fix-login-bug-20250901.yml
workflow_id: fix-login-bug-20250901
type: /fix-bug
started: 2025-09-01T12:30:00Z
estimated_completion: 2025-09-01T12:45:00Z
status: in_progress

# Step progression
steps:
  - step: 1
    name: rapid_diagnosis
    agent: qa-engineer
    status: completed
    duration: 3_minutes
  - step: 2
    name: fix_implementation
    agent: backend-engineer
    status: in_progress
    started: 2025-09-01T12:33:00Z

# Context preservation
artifacts:
  - type: problem_analysis
    path: /tmp/bug-analysis.md
  - type: fix_implementation
    path: src/auth/login.ts
  - type: test_results
    path: /tmp/test-results.json

# Inter-step context
context_variables:
  bug_location: src/auth/login.ts:42
  root_cause: timeout_too_short
  fix_approach: increase_timeout_add_retry
  testing_strategy: unit_and_integration
```

### Workflow Recovery
If a workflow is interrupted:
1. Context file preserves current state
2. Agents can resume from last completed step
3. Artifacts and variables are restored
4. Time tracking continues accurately

## Context Integration

### With Smart Router
- Router uses context to make better routing decisions
- Historical success patterns influence agent selection
- User preferences guide technology choices
- Session continuity enables complex workflows

### With Learning Engine
- Context feeds learning algorithms
- User patterns improve personalization
- Workflow success rates optimize routing
- Problem-solution mappings build knowledge base

### With Agents
- Agents receive relevant context at startup
- Context influences agent decision making
- Agents contribute context updates during work
- Context enables coordination between agents

## Context Lifecycle

### Creation
- Sessions create context automatically
- Users establish preferences through usage
- Workflows generate context during execution
- Context accumulates through system interaction

### Maintenance
- Daily: Archive completed sessions
- Weekly: Update user preference models
- Monthly: Analyze workflow pattern changes
- Quarterly: Optimize context structure

### Cleanup
- Archive old sessions after 30 days
- Maintain user profiles indefinitely
- Keep successful workflow patterns
- Remove failed workflow contexts

## Privacy and Security

### Data Protection
- User context encrypted at rest
- Session data includes no sensitive information
- Workflow context sanitizes secrets
- Context access requires user authorization

### Data Retention
- Sessions: 30 days
- User preferences: Until user deletion
- Workflow patterns: 1 year
- Success metrics: Indefinitely (anonymized)

## API Integration

### Context Queries
```bash
# Get user context
curl /api/context/users/developer-1

# Get session history
curl /api/context/sessions?user=developer-1&limit=10

# Get workflow patterns
curl /api/context/workflows/patterns?type=fix-bug
```

### Context Updates
```bash
# Update user preferences
curl -X POST /api/context/users/developer-1/preferences \
  -d '{"default_stack": "next.js"}'

# Record workflow completion
curl -X POST /api/context/workflows/fix-login-bug-20250901/complete \
  -d '{"success": true, "duration": "12_minutes"}'
```
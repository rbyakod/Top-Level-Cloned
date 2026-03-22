# File-Based API Specification

This is the file-based API specification for the spec detailed in @.agent-os/specs/2025-08-27-smart-router-orchestration/spec.md

## File-Based Communication Architecture

The Smart Router uses Agent OS's existing file-based state management for seamless integration with current workflows.

### File Structure
```
.agent-os/
├── routing/
│   ├── requests/           # Incoming routing requests
│   ├── status/            # Active routing status
│   ├── history/           # Completed routing history
│   └── registry.yml       # Agent availability registry
```

## File-Based Operations

### Route Request Processing

**File:** `.agent-os/routing/requests/{timestamp}-{command-hash}.yml`
**Purpose:** Submit user command for agent routing
**Format:**
```yaml
routing_id: "2025-08-27-143052-fix-bug-payment"
timestamp: "2025-08-27T14:30:52Z"
command: "/fix-bug payment button not working"
context:
  git_status: "clean"
  current_branch: "main" 
  recent_changes: ["checkout.js", "payment.service.js"]
  project_type: "web_app"
user_preferences:
  preferred_speed: "rapid"
  previous_success: ["backend-engineer", "qa-engineer"]
status: "pending"
```

**Processing:** Smart Router monitors `.agent-os/routing/requests/` directory and processes new files automatically

### Routing Status Tracking

**File:** `.agent-os/routing/status/{routing_id}.yml`
**Purpose:** Real-time status of multi-agent workflow execution
**Format:**
```yaml
routing_id: "2025-08-27-143052-fix-bug-payment"
status: "in_progress"
progress: 60
workflow_type: "rapid_response"
estimated_time: "15 minutes"
start_time: "2025-08-27T14:30:52Z"
selected_agents: ["backend-engineer", "qa-engineer"]
execution_plan:
  - agent: "backend-engineer"
    task: "diagnose payment issue"  
    status: "completed"
    duration: "8 minutes"
    dependencies: []
  - agent: "qa-engineer"
    task: "verify fix"
    status: "in_progress" 
    estimated_completion: "3 minutes"
    dependencies: ["backend-engineer"]
```

**Usage:** CLI and UI poll this file for real-time progress updates

### Agent Registry Management

**File:** `.agent-os/routing/registry.yml`
**Purpose:** Central registry of all agents with capabilities and availability
**Format:**
```yaml
registry_version: "v1.2.3"
last_updated: "2025-08-27T14:30:52Z"
agents:
  backend-engineer:
    team: "engineering"
    specializations: ["apis", "databases", "debugging"]
    availability: "available"
    success_rate: 0.94
    avg_response_time: "2.3 minutes"
    current_workload: 2
    last_seen: "2025-08-27T14:25:00Z"
  qa-engineer:
    team: "quality"
    specializations: ["testing", "validation", "debugging"]
    availability: "busy"
    success_rate: 0.91
    current_task: "2025-08-27-143052-fix-bug-payment"
```

**Updates:** Agents update their status by modifying their section in this file

### Agent Communication Protocol

**File:** `.agent-os/routing/messages/{routing_id}-{agent_id}-{timestamp}.md`
**Purpose:** Inter-agent communication and coordination
**Format:**
```markdown
# Agent Message

**From:** backend-engineer
**To:** qa-engineer
**Routing ID:** 2025-08-27-143052-fix-bug-payment
**Timestamp:** 2025-08-27T14:38:15Z
**Type:** task_handoff

## Message

I've identified and fixed the payment button issue. The problem was in `checkout.js` line 47 - missing event listener binding.

**Changes Made:**
- Fixed event listener in checkout.js:47
- Updated payment.service.js validation

**Ready for Testing:**
- Test payment flow on staging environment
- Verify button click handlers work correctly
- Check payment success/error handling

**Dependencies Resolved:** All backend work complete
**Next Agent:** Ready for QA validation
```

### Workflow Feedback System  

**File:** `.agent-os/routing/feedback/{routing_id}.yml`
**Purpose:** User feedback for adaptive learning
**Format:**
```yaml
feedback_id: "fb-2025-08-27-143052"
routing_id: "2025-08-27-143052-fix-bug-payment"
timestamp: "2025-08-27T14:45:30Z"
user_feedback:
  satisfaction_score: 5
  feedback_text: "Perfect routing - exactly the right agents for the job"
  completion_rating: 5
success_metrics:
  actual_completion_time: "12 minutes"
  estimated_completion_time: "15 minutes"
  user_satisfaction: "very_satisfied"
  solution_quality: "excellent"
learning_impact: "routing accuracy improved by 0.2%"
```

## File-Based Integration with Existing Workflows

### Command Integration
```yaml
# Existing rapid commands automatically create routing files
/fix-bug "payment issue" → .agent-os/routing/requests/2025-08-27-fix-bug-payment.yml
/build-mvp "dark mode" → .agent-os/routing/requests/2025-08-27-build-mvp-dark.yml
/validate "user problem" → .agent-os/routing/requests/2025-08-27-validate-user.yml
```

### Git Integration
```yaml
# All routing files are version controlled with existing Agent OS state
git add .agent-os/routing/
git commit -m "Smart router state: completed payment fix routing"
```

### Existing Workflow Compatibility
- **YAML Configuration**: Seamlessly integrates with existing `.agent-os/` structure
- **Markdown Communication**: Uses established inter-agent markdown format
- **File Monitoring**: Leverages existing file-based state management patterns
- **Team Structure**: Works with current 35+ agent definitions in `/agents/` directory

## Performance Requirements

### File-Based Performance
- **File Processing**: Process new routing requests within 2 seconds
- **Status Updates**: Update status files within 500ms of agent changes  
- **Concurrent Routing**: Support 50 concurrent workflows via file-based queuing
- **File System Load**: Optimized for local file system with minimal I/O overhead

### Integration Performance
- **Command Response**: Rapid commands create routing files instantly
- **Agent Coordination**: File-based message passing with sub-second latency
- **Status Polling**: Real-time updates via efficient file monitoring
- **Scalability**: Handles 1000 routing operations per hour with file-based architecture
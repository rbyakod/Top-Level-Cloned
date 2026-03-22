# Agent OS Project-Specific Commands

## Overview
Custom commands and aliases tailored specifically for Agent OS development, testing, and deployment.

## Agent OS Development Commands

### `/test-agents`
**Purpose**: Test all 39 agents for functionality  
**Time**: 15 minutes  
**Example**: `/test-agents`

```bash
# What happens:
1. Load all agent files from ~/.claude/agents/
2. Validate agent structure and configuration
3. Test agent communication protocols
4. Check integration points
5. Generate agent performance report
```

### `/validate-workflows`
**Purpose**: Test all enhanced workflows  
**Time**: 30 minutes  
**Example**: `/validate-workflows`

```bash
# What happens:
1. Test /fix-bug workflow (15-minute SLA)
2. Test /build-mvp workflow (4-hour SLA)  
3. Test /validate workflow (2-hour SLA)
4. Test /ultrathink workflow (1-day SLA)
5. Validate agent coordination
```

### `/sync-knowledge`
**Purpose**: Update knowledge base with latest learnings  
**Time**: 10 minutes  
**Example**: `/sync-knowledge`

```bash
# What happens:
1. Collect new problems from recent workflows
2. Document successful solutions
3. Identify emerging patterns
4. Update decision records
5. Generate learning report
```

### `/optimize-routing`
**Purpose**: Optimize Smart Router performance  
**Time**: 1 hour  
**Example**: `/optimize-routing`

```bash
# What happens:
1. Analyze agent performance metrics
2. Update load balancing algorithms
3. Optimize agent selection logic
4. Test routing improvements
5. Deploy optimizations
```

## Setup and Configuration Commands

### `/setup-project`
**Purpose**: Initialize Agent OS for new project  
**Time**: 5 minutes  
**Example**: `/setup-project my-saas-app`

```bash
# What happens:
1. Create project-specific configuration
2. Set up custom agent preferences
3. Initialize knowledge base structure
4. Configure workflow templates
5. Create project context
```

### `/config-stack [stack-name]`
**Purpose**: Configure technology stack preferences  
**Time**: 2 minutes  
**Example**: `/config-stack nextjs-postgres`

```bash
# Available stacks:
# - nextjs-postgres (Next.js + PostgreSQL + Prisma)
# - react-firebase (React + Firebase + Firestore)
# - node-mongo (Node.js + Express + MongoDB)
# - python-django (Python + Django + PostgreSQL)
# - rails-postgres (Ruby on Rails + PostgreSQL)
```

### `/update-agents`
**Purpose**: Update all agents to latest version  
**Time**: 5 minutes  
**Example**: `/update-agents`

```bash
# What happens:
1. Backup current agent configurations
2. Pull latest agent templates
3. Update agent capabilities
4. Test agent compatibility
5. Deploy updated agents
```

## Monitoring and Analytics Commands

### `/health-check`
**Purpose**: Check Agent OS system health  
**Time**: 2 minutes  
**Example**: `/health-check`

```bash
# What happens:
1. Test Smart Router connectivity
2. Verify agent availability
3. Check knowledge base integrity
4. Test workflow execution
5. Generate health report
```

### `/performance-report`
**Purpose**: Generate system performance analysis  
**Time**: 5 minutes  
**Example**: `/performance-report --last-week`

```bash
# What happens:
1. Analyze workflow completion times
2. Calculate agent efficiency metrics
3. Measure SLA compliance
4. Generate optimization recommendations
5. Create performance dashboard
```

### `/usage-metrics`
**Purpose**: Analyze Agent OS usage patterns  
**Time**: 3 minutes  
**Example**: `/usage-metrics --monthly`

```bash
# What happens:
1. Count workflow executions by type
2. Track most used agents
3. Measure user satisfaction scores
4. Identify optimization opportunities
5. Generate usage insights
```

## Knowledge Management Commands

### `/document-pattern [pattern-name]`
**Purpose**: Document a new successful pattern  
**Time**: 5 minutes  
**Example**: `/document-pattern rapid-api-integration`

```bash
# What happens:
1. Capture pattern details and steps
2. Record success metrics and timing
3. Identify reusable components
4. Add to pattern knowledge base
5. Update relevant workflows
```

### `/learn-from-failure [session-id]`
**Purpose**: Extract lessons from failed workflows  
**Time**: 10 minutes  
**Example**: `/learn-from-failure session-2025-09-01-1234`

```bash
# What happens:
1. Analyze failure points in workflow
2. Identify root causes
3. Document prevention strategies
4. Update agent decision logic
5. Improve workflow robustness
```

### `/export-knowledge`
**Purpose**: Export knowledge base for backup/sharing  
**Time**: 2 minutes  
**Example**: `/export-knowledge --format json`

```bash
# What happens:
1. Package problems, solutions, patterns
2. Include decision records
3. Add usage statistics
4. Create portable knowledge export
5. Generate import instructions
```

## Project-Specific Aliases

### Development Aliases
```bash
# Quick development workflow
/dev = /validate --quick && /build-mvp --today

# Agent testing
/test = /test-agents && /validate-workflows

# Daily maintenance  
/daily = /health-check && /sync-knowledge

# Performance optimization
/optimize = /performance-report && /optimize-routing

# Knowledge sync
/learn = /sync-knowledge && /document-pattern latest
```

### Emergency Aliases
```bash
# Critical system issue
/crisis = /emergency system-critical && /incident all-hands

# Agent system down
/agent-down = /incident agent-system-failure --priority critical

# Knowledge corruption
/kb-restore = /export-knowledge --backup && /restore-knowledge --latest

# Performance degradation
/slow-system = /performance-report --immediate && /optimize-routing --urgent
```

### Productivity Aliases
```bash
# Start productive session
/start = /setup-session && /health-check && /sync-knowledge

# End session with learning capture
/end = /document-session && /learn-from-session && /cleanup-session

# Weekly review
/review = /usage-metrics --weekly && /performance-report --weekly

# Monthly optimization
/monthly = /optimize-routing && /update-agents && /export-knowledge
```

## Custom Workflow Commands

### `/agent-os-deploy`
**Purpose**: Deploy Agent OS updates to production  
**Time**: 15 minutes  
**Example**: `/agent-os-deploy v2.1.0`

```bash
# What happens:
1. Run comprehensive test suite
2. Backup current configuration
3. Deploy new agent versions
4. Update Smart Router logic
5. Validate deployment success
```

### `/onboard-user [user-type]`
**Purpose**: Set up Agent OS for new user  
**Time**: 10 minutes  
**Example**: `/onboard-user startup-founder`

```bash
# User types:
# - startup-founder: Focus on MVP and validation
# - enterprise-dev: Focus on scalability and compliance
# - consultant: Focus on rapid delivery and documentation
# - student: Focus on learning and experimentation
```

### `/benchmark-performance`
**Purpose**: Benchmark Agent OS against performance targets  
**Time**: 30 minutes  
**Example**: `/benchmark-performance`

```bash
# What happens:
1. Run standardized workflow tests
2. Measure against SLA targets (15min, 2hr, 4hr)
3. Compare with baseline performance
4. Identify performance regressions
5. Generate benchmark report
```

## Integration Commands

### `/integrate-tools [tool-list]`
**Purpose**: Integrate external tools with Agent OS  
**Time**: 1 hour  
**Example**: `/integrate-tools slack,jira,github`

```bash
# Available integrations:
# - slack: Workflow notifications
# - jira: Issue tracking integration  
# - github: Code repository sync
# - figma: Design asset integration
# - notion: Documentation sync
```

### `/sync-codebase`
**Purpose**: Sync Agent OS with project codebase  
**Time**: 5 minutes  
**Example**: `/sync-codebase`

```bash
# What happens:
1. Analyze project structure
2. Update agent technology preferences
3. Customize workflow templates
4. Sync design system components
5. Update knowledge base context
```

## Command Configuration Files

### Project Defaults
```yaml
# .agent-os/commands/project-config.yml
project_name: "agent-os-v2"
default_stack: "typescript-node-postgres"
default_deployment: "vercel-railway"
sla_targets:
  fix_bug: "15_minutes"
  validate: "2_hours" 
  build_mvp: "4_hours"
  ultrathink: "1_day"

team_preferences:
  backend: ["backend-engineer", "api-designer", "database-architect"]
  frontend: ["frontend-engineer", "ui-designer", "ux-researcher"]
  quality: ["qa-engineer", "test-automation", "performance-engineer"]
```

### Custom Shortcuts
```yaml
# .agent-os/commands/shortcuts.yml
shortcuts:
  # Development shortcuts
  /quick-fix: "/fix-bug --urgent --mvp"
  /feature-complete: "/spec && /build-mvp && /test --production"
  /ship-fast: "/validate --quick && /build-mvp --today"
  
  # Agent OS specific
  /test-all: "/test-agents && /validate-workflows && /health-check"
  /optimize-all: "/optimize-routing && /performance-report && /sync-knowledge"
  /daily-ops: "/health-check && /usage-metrics && /sync-knowledge"
  
  # Emergency responses
  /agent-crisis: "/incident agent-system-failure && /health-check --emergency"
  /knowledge-backup: "/export-knowledge --emergency && /validate-backup"
```

## Command Monitoring

### Success Tracking
- Track command completion times vs SLAs
- Monitor agent performance during commands  
- Measure user satisfaction with command outcomes
- Identify most/least successful command patterns

### Usage Analytics
- Most frequently used commands
- Commands with highest success rates
- Optimal command sequencing patterns
- User preference learning for command suggestions

## Best Practices for Agent OS Commands

### Command Sequencing
1. Always start with `/health-check` for system status
2. Use `/validate` before any building commands
3. Follow up building with `/test` commands
4. End sessions with `/sync-knowledge` for learning

### Performance Optimization
- Use specific agents for focused tasks
- Leverage parallel execution for independent work
- Cache frequently accessed knowledge base entries
- Optimize agent selection based on historical performance

### Quality Assurance
- Always include testing in workflow chains
- Use `--production` modifier for user-facing changes
- Validate changes with real user scenarios
- Maintain audit trail through command history

## Command Evolution

### Learning Integration
- Commands learn from usage patterns
- Success/failure rates influence command optimization
- User feedback shapes command behavior
- Knowledge base informs command decision making

### Continuous Improvement
- Monthly command performance review
- Quarterly command catalog updates
- Annual command strategy revision
- User feedback integration cycles
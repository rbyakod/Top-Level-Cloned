# Agent OS v2.0 Rapid Commands

## Overview
Quick commands to trigger workflows, validate problems, and ship features fast.

## Command Reference

### 🚀 Speed Commands (Ship in Hours)

#### `/validate [problem]`
**Purpose**: Validate a user problem in 2 hours  
**Workflow**: rapid-validation  
**Time**: 2 hours  
**Example**: `/validate users can't export their data to CSV`

```bash
# What happens:
1. UX researcher interviews 3-5 users (30 min)
2. Product owner prioritizes (10 min)
3. UI designer creates prototype (30 min)
4. Architect designs approach (20 min)
5. Build MVP (60 min)
6. Test with users (30 min)
```

#### `/fix-bug [description]`
**Purpose**: Fix critical user-facing bug in 15 minutes  
**Workflow**: fast-track-bug-fix  
**Time**: 15 minutes  
**Example**: `/fix-bug payment button not working on checkout`

```bash
# What happens:
1. Incident commander acknowledges (2 min)
2. Engineer reproduces bug (5 min)
3. Implement fix (5 min)
4. Test and deploy (3 min)
```

#### `/build-mvp [validated-problem]`
**Purpose**: Build MVP in 4 hours  
**Workflow**: mvp-builder  
**Time**: 4 hours  
**Example**: `/build-mvp dark mode for reading at night`

```bash
# What happens:
1. Define MVP scope (30 min)
2. Design simple UI (45 min)
3. Parallel development (2 hours)
4. Test core workflow (30 min)
5. User validation (45 min)
```

#### `/ship-today [feature]`
**Purpose**: Ship a feature by end of day  
**Workflow**: rapid-feature  
**Time**: 1 day  
**Example**: `/ship-today user profile customization`

```bash
# What happens:
1. Morning: Validate and design
2. Midday: Build and test
3. Afternoon: Deploy and monitor
```

### 🧠 Intelligent Commands (Multi-Agent Coordination)

#### `/ultrathink [complex-problem]`
**Purpose**: Solve complex problems with all teams  
**Workflow**: ultrathink-development  
**Time**: 1 day  
**Example**: `/ultrathink redesign API for 10x scale`

```bash
# What happens:
1. Architect designs solution
2. AI researcher finds best practices
3. Security reviews approach
4. Parallel implementation by teams
5. Integration testing
6. Coordinated deployment
```

#### `/team-build [feature]`
**Purpose**: Coordinate multiple teams to build feature  
**Workflow**: team-coordination  
**Time**: Variable  
**Example**: `/team-build real-time collaboration feature`

#### `/research [topic]`
**Purpose**: Research market, users, or technology  
**Teams**: Growth + Product + Design  
**Time**: 2 hours  
**Example**: `/research competitor pricing strategies`

### 📋 Specification Commands

#### `/spec [feature-name]`
**Purpose**: Create enhanced specification  
**Workflow**: enhanced-create-spec  
**Time**: 90 minutes  
**Example**: `/spec user-notifications`

#### `/refine-spec [spec-name]`
**Purpose**: Improve existing specification  
**Workflow**: refine-spec  
**Time**: 1 hour  
**Example**: `/refine-spec payment-integration`

#### `/execute [spec-name]`
**Purpose**: Execute tasks from specification  
**Workflow**: execute-tasks  
**Time**: Variable  
**Example**: `/execute dark-mode-spec`

### 🎯 Product Commands

#### `/user-interview [topic]`
**Purpose**: Conduct user research  
**Agent**: ux-researcher  
**Time**: 1 hour  
**Example**: `/user-interview onboarding experience`

#### `/market-analysis [segment]`
**Purpose**: Analyze market opportunity  
**Agent**: market-researcher  
**Time**: 2 hours  
**Example**: `/market-analysis SMB productivity tools`

#### `/prioritize [backlog]`
**Purpose**: Prioritize features by ROI  
**Agent**: product-owner  
**Time**: 30 minutes  
**Example**: `/prioritize Q1-features`

### 🛠️ Engineering Commands

#### `/api-design [service]`
**Purpose**: Design API contracts  
**Agent**: api-designer  
**Time**: 1 hour  
**Example**: `/api-design notification-service`

#### `/architecture [system]`
**Purpose**: Design system architecture  
**Agent**: architect  
**Time**: 2 hours  
**Example**: `/architecture real-time-messaging`

#### `/security-review [component]`
**Purpose**: Security audit  
**Agent**: security-engineer  
**Time**: 1 hour  
**Example**: `/security-review authentication-flow`

### 🎨 Design Commands

#### `/design [feature]`
**Purpose**: Create UI/UX design  
**Team**: Design  
**Time**: 2 hours  
**Example**: `/design user-dashboard`

#### `/prototype [idea]`
**Purpose**: Quick interactive prototype  
**Agent**: ui-designer  
**Time**: 1 hour  
**Example**: `/prototype drag-drop-interface`

#### `/design-system [component]`
**Purpose**: Add to design system  
**Agent**: design-systems-architect  
**Time**: 2 hours  
**Example**: `/design-system notification-toast`

### 🧪 Quality Commands

#### `/test [feature]`
**Purpose**: Comprehensive testing  
**Team**: Quality  
**Time**: 1 hour  
**Example**: `/test checkout-flow`

#### `/automate-test [workflow]`
**Purpose**: Create automated tests  
**Agent**: test-automation  
**Time**: 2 hours  
**Example**: `/automate-test user-registration`

#### `/performance-test [endpoint]`
**Purpose**: Load and performance testing  
**Agent**: performance-engineer  
**Time**: 1 hour  
**Example**: `/performance-test /api/search`

### 📊 Data & Analytics Commands

#### `/analyze [metrics]`
**Purpose**: Analyze data and metrics  
**Agent**: data-scientist  
**Time**: 1 hour  
**Example**: `/analyze user-retention`

#### `/ml-model [use-case]`
**Purpose**: Build ML model  
**Agent**: ml-engineer  
**Time**: 4 hours  
**Example**: `/ml-model churn-prediction`

#### `/dashboard [metrics]`
**Purpose**: Create analytics dashboard  
**Agent**: analytics-engineer  
**Time**: 2 hours  
**Example**: `/dashboard product-metrics`

### 🚨 Emergency Commands

#### `/emergency [issue]`
**Purpose**: All-hands emergency response  
**Team**: All available  
**Time**: Immediate  
**Example**: `/emergency site is down`

#### `/rollback [deployment]`
**Purpose**: Emergency rollback  
**Agent**: devops-engineer  
**Time**: 5 minutes  
**Example**: `/rollback v2.1.0`

#### `/incident [description]`
**Purpose**: Start incident response  
**Agent**: incident-commander  
**Time**: Immediate  
**Example**: `/incident database connection issues`

## Command Modifiers

### Time Modifiers
- `--urgent`: Prioritize over other work
- `--today`: Must ship today
- `--this-week`: Can wait until this week
- `--backlog`: Add to backlog

### Quality Modifiers
- `--mvp`: Minimum viable solution
- `--polished`: Full quality implementation
- `--prototype`: Quick and dirty prototype
- `--production`: Production-ready quality

### Team Modifiers
- `--solo`: Single agent execution
- `--parallel`: Parallel team execution
- `--sequential`: Step-by-step execution
- `--all-teams`: Involve all teams

## Command Combinations

### Rapid Development Flow
```bash
/validate new feature idea --urgent
/build-mvp validated-problem --today
/ship-today mvp-feature --production
```

### Bug Fix Flow
```bash
/incident user reports issue
/fix-bug identified-problem --urgent
/test fixed-feature --production
```

### Feature Development Flow
```bash
/research market-opportunity
/spec new-feature --this-week
/team-build specified-feature --parallel
/test built-feature --polished
```

## Command Aliases

### Short Aliases
- `/v` → `/validate`
- `/fb` → `/fix-bug`
- `/mvp` → `/build-mvp`
- `/s` → `/spec`
- `/e` → `/execute`
- `/t` → `/test`
- `/d` → `/design`
- `/a` → `/analyze`

### Workflow Aliases
- `/quick` → `/build-mvp --mvp --today`
- `/hotfix` → `/fix-bug --urgent --production`
- `/research-build` → `/validate && /build-mvp`
- `/full-cycle` → `/spec && /execute && /test`

## Command Configuration

### Setting Defaults
```yaml
# .agent-os/commands/config.yml
defaults:
  time_limit: "4_hours"
  quality: "mvp"
  teams: "auto-select"
  
shortcuts:
  daily: "/validate --today && /build-mvp --today"
  weekly: "/spec --this-week && /team-build"
```

### Custom Commands
```yaml
# .agent-os/commands/custom.yml
custom_commands:
  /my-workflow:
    description: "Custom workflow for my project"
    workflow: "custom-workflow"
    agents: ["product-owner", "backend-engineer"]
    time: "2_hours"
```

## Interactive Mode

### Command Wizard
```bash
/wizard
# Asks questions to determine the right command:
# 1. What do you want to do? (build/fix/research/test)
# 2. How urgent is it? (15min/2hr/4hr/1day)
# 3. What's the user problem?
# → Suggests: /validate problem --urgent
```

### Command Builder
```bash
/build-command
# Interactive command builder:
# - Select workflow type
# - Choose agents/teams
# - Set time constraints
# - Add modifiers
# → Generates: /team-build feature --parallel --today
```

## Command Scheduling

### Scheduled Commands
```bash
/schedule daily /analyze user-metrics
/schedule weekly /test all-features
/schedule monthly /market-analysis competitors
```

### Command Chains
```bash
/chain [
  /validate problem,
  /build-mvp if-validated,
  /test mvp,
  /ship-today if-passing
]
```

## Command Output

### Standard Output Format
```yaml
command: /validate user-problem
status: completed
duration: 1h 45m
team: [product, design]
agents: [ux-researcher, product-owner, ui-designer]
output:
  validation: ~/.agent-os/validation/2024-01-27/problem.md
  decision: proceed with MVP
  next_step: /build-mvp validated-problem
```

### Notification Preferences
```yaml
notifications:
  on_start: true
  on_progress: "every 30 minutes"
  on_complete: true
  on_error: immediate
  channels: ["terminal", "web", "email"]
```

## Command History

### View History
```bash
/history                  # Show all commands
/history --today         # Today's commands
/history --successful    # Successful commands only
/history --failed        # Failed commands
```

### Replay Commands
```bash
/replay [command-id]     # Replay specific command
/replay --last          # Replay last command
/replay --last-successful # Replay last successful
```

## Error Handling

### Common Error Commands
```bash
/debug [session-id]      # Debug failed session
/logs [agent-name]       # View agent logs
/retry [command]         # Retry failed command
/recover [session]       # Recover from failure
```

### Help Commands
```bash
/help                    # General help
/help [command]         # Specific command help
/examples [workflow]    # Show workflow examples
/docs [topic]          # Open documentation
```

## Best Practices

### Command Usage Guidelines
1. **Start with validation**: Always `/validate` before building
2. **Use time modifiers**: Be explicit about urgency
3. **Chain related commands**: Use chains for workflows
4. **Monitor progress**: Check status regularly
5. **Document decisions**: Commands create audit trail

### Speed Optimization
- Use `/fix-bug` for urgent fixes (15 min)
- Use `/validate` before building (2 hours)
- Use `/build-mvp` for quick features (4 hours)
- Use `/ship-today` for same-day delivery

### Quality Balance
- `--mvp` for validation and learning
- `--polished` for user-facing features
- `--production` for critical systems
- `--prototype` for experiments

## References
- Commands trigger workflows in @.agent-os/instructions/
- Agents defined in @~/.claude/agents/
- Configuration in @.agent-os/config.yml
- Standards in @.agent-os/standards/
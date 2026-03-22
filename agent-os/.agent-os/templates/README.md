# Agent OS Template System

## Overview
Templates for rapidly creating new agents, workflows, and specifications following Agent OS v2.0 standards.

## Directory Structure
```
templates/
├── agents/           # Agent templates by team
│   ├── product/     # Product team agent templates
│   ├── engineering/ # Engineering team agent templates
│   ├── design/      # Design team agent templates
│   └── base.md      # Base agent template
├── workflows/        # Workflow templates by type
│   ├── rapid/       # Fast execution workflows (15min-4hr)
│   ├── standard/    # Standard workflows (1-2 days)
│   ├── complex/     # Complex multi-agent workflows
│   └── base.md      # Base workflow template
└── specs/           # Specification templates
    ├── feature/     # Feature spec templates
    ├── bug/         # Bug fix spec templates
    ├── research/    # Research spec templates
    └── base.md      # Base spec template
```

## Quick Start

### Creating a New Agent
```bash
# Copy the base template
cp templates/agents/base.md ~/.claude/agents/new-agent.md

# Or use a team-specific template
cp templates/agents/engineering/backend-service.md ~/.claude/agents/payment-service.md
```

### Creating a New Workflow
```bash
# Copy the appropriate workflow template
cp templates/workflows/rapid/validation-template.md ~/.agent-os/instructions/validate-feature-x.md

# Customize the template with your specific requirements
```

### Creating a New Spec
```bash
# Use the feature template for new features
cp templates/specs/feature/user-story-template.md ~/.agent-os/specs/dark-mode/spec.md
```

## Template Variables

All templates use variable substitution for quick customization:

- `{{AGENT_NAME}}` - The name of the agent
- `{{TEAM_NAME}}` - The team this agent belongs to
- `{{WORKFLOW_NAME}}` - The workflow identifier
- `{{TIME_LIMIT}}` - SLA or time constraint
- `{{USER_PROBLEM}}` - The validated user problem
- `{{TECH_STACK}}` - Technology choices
- `{{SUCCESS_CRITERIA}}` - Measurable success metrics

## Usage Examples

### Example 1: Creating a New API Service Agent
```markdown
1. Copy template: `cp templates/agents/engineering/backend-service.md ~/.claude/agents/payment-api.md`
2. Replace variables:
   - {{AGENT_NAME}} → payment-api
   - {{SERVICE_DOMAIN}} → payments, subscriptions, invoices
   - {{DATABASE}} → PostgreSQL with Stripe integration
3. Save and reference in workflows
```

### Example 2: Creating a Rapid Bug Fix Workflow
```markdown
1. Copy template: `cp templates/workflows/rapid/bug-fix-template.md ~/.agent-os/instructions/fix-login-bug.md`
2. Replace variables:
   - {{BUG_DESCRIPTION}} → Users can't log in with Google
   - {{TIME_LIMIT}} → 15_minutes
   - {{AFFECTED_USERS}} → 30% of users
3. Execute with: `/fix-bug fix-login-bug`
```

## Best Practices

### When to Create New Templates
- Repeated patterns across multiple agents/workflows
- New team or domain being added
- Optimization opportunity identified
- Common user problems emerge

### Template Maintenance
- Review templates monthly for updates
- Incorporate lessons learned from usage
- Keep templates aligned with standards
- Version templates when making breaking changes

### Template Composition
- Templates can include other templates
- Use modular sections for reusability
- Keep templates focused and single-purpose
- Document all variables and options

## Template Categories

### Agent Templates
- **Base**: Minimal agent with core capabilities
- **Specialist**: Domain-specific expertise
- **Coordinator**: Multi-agent orchestration
- **Validator**: Quality gates and testing

### Workflow Templates
- **Rapid**: 15-minute to 4-hour execution
- **Standard**: 1-2 day development cycles
- **Complex**: Multi-team coordination
- **Emergency**: Critical issue response

### Spec Templates
- **Feature**: User stories and requirements
- **Bug**: Issue reproduction and fixes
- **Research**: Investigation and validation
- **Architecture**: System design decisions
---
description: Intelligent routing system for directing tasks to appropriate teams and workflows
globs:
alwaysApply: true
version: 2.0
encoding: UTF-8
---

# Smart Router & Orchestration System

## Overview
Intelligently route user requests to the right teams, agents, and workflows based on request analysis and context.

<router_process>

<step number="1" name="request_analysis" time_limit="30_seconds">

### Step 1: Request Analysis

Analyze the user's request to determine intent, complexity, and urgency.

<analysis_dimensions>
  <intent_detection>
    - Problem validation request
    - Bug report or error
    - Feature development
    - Research or investigation
    - Performance optimization
    - User experience improvement
    - Architecture decision
    - Documentation need
  </intent_detection>
  
  <complexity_assessment>
    - Simple: Single agent, <1 hour
    - Medium: 2-3 agents, 1-4 hours  
    - Complex: Multiple teams, >4 hours
    - Critical: Urgent, user-blocking
  </complexity_assessment>
  
  <urgency_detection>
    - Critical: User blocked, production issue
    - High: Business-critical feature
    - Normal: Standard development
    - Low: Nice-to-have improvements
  </urgency_detection>
</analysis_dimensions>

<pattern_matching>
  # Critical patterns (15-minute response)
  critical_patterns:
    - "users can't|customers unable|broken|down|critical|urgent|asap|emergency"
    - "payment|checkout|login|signup|data loss|security breach"
    - "production|live site|all users|nobody can"
  
  # Validation patterns (2-hour cycle)
  validation_patterns:
    - "validate|research|users want|problem|need|request|feedback"
    - "should we|worth building|makes sense|good idea"
    - "market|competitors|alternatives"
  
  # Development patterns (4-hour MVP)
  development_patterns:
    - "build|create|implement|develop|add feature|new capability"
    - "mvp|prototype|proof of concept|test idea"
    
  # Complex patterns (1-day ultrathink)
  complex_patterns:
    - "architecture|system design|refactor|migration"
    - "multiple components|integrate|complex workflow"
    - "performance at scale|optimization"
</pattern_matching>

</step>

<step number="2" name="workflow_selection" time_limit="10_seconds">

### Step 2: Workflow Selection

Select the optimal workflow based on request analysis.

<workflow_decision_tree>
  IF critical_bug_detected:
    WORKFLOW: fast-track-bug-fix
    TEAM: rapid_response
    SLA: 15 minutes
    
  ELIF user_problem_validation:
    WORKFLOW: rapid-validation
    TEAM: product + design
    SLA: 2 hours
    
  ELIF simple_feature_request AND validated_problem:
    WORKFLOW: mvp-builder
    TEAM: engineering + design
    SLA: 4 hours
    
  ELIF complex_architecture:
    WORKFLOW: ultrathink-development
    TEAM: all
    SLA: 1 day
    
  ELIF standard_feature:
    WORKFLOW: enhanced-create-spec
    TEAM: product + engineering + design
    SLA: 90 minutes
    
  ELSE:
    WORKFLOW: create-spec
    TEAM: engineering
    SLA: standard
</workflow_decision_tree>

<routing_rules>
  # Team assignment based on domain
  engineering_triggers:
    keywords: ["api", "backend", "database", "performance", "infrastructure"]
    agents: [architect, backend-engineer, devops-engineer]
    
  design_triggers:
    keywords: ["ui", "ux", "design", "user experience", "interface", "mockup"]
    agents: [ux-designer, ui-designer, ux-researcher]
    
  product_triggers:
    keywords: ["feature", "requirement", "user story", "roadmap", "prioritize"]
    agents: [product-owner, product-analyst, requirements-writer]
    
  quality_triggers:
    keywords: ["test", "bug", "qa", "quality", "regression", "automation"]
    agents: [qa-engineer, qa-lead, test-automation]
    
  data_triggers:
    keywords: ["analytics", "metrics", "ml", "ai", "data", "insights"]
    agents: [data-scientist, ai-researcher, analytics-engineer]
</routing_rules>

</step>

<step number="3" name="team_orchestration" time_limit="20_seconds">

### Step 3: Team Orchestration

Orchestrate the selected teams and agents for optimal execution.

<orchestration_patterns>
  
  <parallel_execution>
    # Teams that can work in parallel
    parallel_compatible:
      - [design, backend] # UI design while API development
      - [product, qa] # Requirements while test planning
      - [frontend, mobile] # Web and mobile simultaneously
      
    coordination_points:
      - API contracts between frontend/backend
      - Design tokens between design/engineering
      - Test scenarios between product/qa
  </parallel_execution>
  
  <sequential_execution>
    # Teams that must work in sequence
    sequential_required:
      - product -> design -> engineering
      - engineering -> qa -> deployment
      - research -> architecture -> implementation
      
    handoff_protocols:
      - Clear deliverables at each stage
      - Context preservation in files
      - Validation gates between stages
  </sequential_execution>
  
  <hybrid_execution>
    # Mixed parallel and sequential
    initial_parallel:
      - User research + Technical research
      - Problem validation + Architecture planning
      
    then_sequential:
      - Design -> Implementation -> Testing
      
    final_parallel:
      - Documentation + User communication
      - Monitoring setup + Performance testing
  </hybrid_execution>
  
</orchestration_patterns>

<team_coordination>
  <context_sharing>
    method: "File-based in .agent-os directory"
    format: "Markdown with YAML frontmatter"
    location: "@.agent-os/context/[session]/"
  </context_sharing>
  
  <conflict_resolution>
    technical: "Architect agent decides"
    user_experience: "UX-designer agent decides"
    business: "Product-owner agent decides"
    security: "Security-engineer agent decides"
  </conflict_resolution>
  
  <progress_tracking>
    updates: "Every 30 minutes for long tasks"
    format: "Status + blockers + next steps"
    visibility: "User-visible progress indicators"
  </progress_tracking>
</team_coordination>

</step>

<step number="4" name="execution_monitoring" continuous="true">

### Step 4: Execution Monitoring

Monitor execution and adjust routing as needed.

<monitoring_dimensions>
  <sla_tracking>
    - Start time for each workflow
    - Progress checkpoints
    - Alert if approaching SLA limit
    - Escalation if SLA breached
  </sla_tracking>
  
  <quality_gates>
    - User problem validated before building
    - Design approved before implementation
    - Tests passing before deployment
    - User confirmation after deployment
  </quality_gates>
  
  <adaptive_routing>
    IF task_blocked:
      - Identify blocking issue
      - Route to specialist agent
      - Escalate if unresolved
      
    IF complexity_increases:
      - Upgrade to more comprehensive workflow
      - Add additional agents
      - Extend SLA appropriately
      
    IF user_priority_changes:
      - Re-evaluate urgency
      - Adjust team allocation
      - Communicate timeline changes
  </adaptive_routing>
</monitoring_dimensions>

<continuous_improvement>
  <pattern_learning>
    - Track successful routing decisions
    - Identify new patterns from user requests
    - Update routing rules based on outcomes
  </pattern_learning>
  
  <performance_optimization>
    - Measure actual vs estimated times
    - Identify bottleneck agents/teams
    - Optimize parallel execution opportunities
  </performance_optimization>
</continuous_improvement>

</step>

</router_process>

## Routing Examples

### Example 1: Critical Bug Report
```yaml
user_request: "Users can't complete checkout - payment button not working!"
analysis:
  intent: bug_fix
  complexity: simple
  urgency: critical
routing:
  workflow: fast-track-bug-fix
  team: rapid_response
  agents: [incident-commander, backend-engineer, qa-engineer]
  sla: 15_minutes
  execution: parallel_diagnosis_and_fix
```

### Example 2: New Feature Validation
```yaml
user_request: "Users are asking for dark mode. Should we build it?"
analysis:
  intent: problem_validation
  complexity: medium
  urgency: normal
routing:
  workflow: rapid-validation
  team: [product, design]
  agents: [ux-researcher, ui-designer, product-owner]
  sla: 2_hours
  execution: sequential_validation_then_prototype
```

### Example 3: Complex System Design
```yaml
user_request: "Need to redesign our API to handle 10x traffic"
analysis:
  intent: architecture
  complexity: complex
  urgency: high
routing:
  workflow: ultrathink-development
  team: all
  agents: [architect, backend-engineer, performance-engineer, devops-engineer]
  sla: 1_day
  execution: parallel_research_then_coordinated_design
```

## Smart Routing Rules

### Priority Matrix
```yaml
priority_calculation:
  factors:
    user_impact:
      weight: 40%
      levels:
        all_users: 10
        many_users: 7
        some_users: 5
        few_users: 3
        
    business_impact:
      weight: 30%
      levels:
        revenue_critical: 10
        growth_critical: 8
        retention_important: 6
        nice_to_have: 3
        
    technical_complexity:
      weight: 20%
      levels:
        trivial: 10  # (inverse - simple = higher priority)
        simple: 8
        moderate: 5
        complex: 3
        
    time_sensitivity:
      weight: 10%
      levels:
        immediate: 10
        today: 8
        this_week: 5
        anytime: 3
```

### Workflow Triggers
```yaml
automatic_triggers:
  fast_track_bug_fix:
    conditions:
      - keywords: ["broken", "error", "can't", "failing"]
      - user_impact: ">= many_users"
      - time_sensitivity: "immediate"
    override: true  # Skip validation, go straight to fix
    
  rapid_validation:
    conditions:
      - keywords: ["should we", "users want", "requesting", "asking for"]
      - no_existing_validation: true
    auto_start: true
    
  ultrathink:
    conditions:
      - complexity: "complex"
      - multiple_teams_required: true
      - estimated_time: ">4 hours"
    require_confirmation: true
```

## Integration Points

### With Existing Workflows
```yaml
workflow_compatibility:
  standard_workflows:
    create-spec:
      upgrade_to: enhanced-create-spec
      when: "validation_needed OR multiple_teams"
      
    execute-tasks:
      parallel_with: team_coordination
      when: "multiple_agents_available"
      
  enhanced_workflows:
    rapid-validation:
      prerequisite_for: [mvp-builder, enhanced-create-spec]
      output_feeds: product_backlog
      
    ultrathink-development:
      includes: [create-spec, execute-tasks, testing]
      replaces: "manual_coordination"
```

### With Agent Teams
```yaml
team_activation:
  single_team:
    routing: "Direct to team lead"
    coordination: "Team lead manages members"
    
  multiple_teams:
    routing: "Parallel team activation"
    coordination: "Cross-team sync points"
    conflict_resolution: "Escalate to architect"
    
  all_teams:
    routing: "Ultrathink orchestration"
    coordination: "Centralized by architect"
    execution: "Parallel where possible"
```

## Performance Optimization

### Caching and Reuse
```yaml
optimization_strategies:
  context_caching:
    - Cache user problems for 30 days
    - Reuse validated problems across features
    - Share technical decisions across sessions
    
  pattern_caching:
    - Remember successful routing decisions
    - Apply similar routing to similar requests
    - Learn from routing failures
    
  agent_pooling:
    - Keep frequently-used agents warm
    - Pre-load common contexts
    - Batch similar requests
```

### Parallel Execution
```yaml
parallelization:
  always_parallel:
    - User communication + Technical investigation
    - Frontend + Backend (with API contract)
    - Documentation + Testing
    
  never_parallel:
    - Requirements -> Implementation
    - Implementation -> Testing
    - Testing -> Deployment
    
  conditionally_parallel:
    - Design + Development (if design system exists)
    - Multiple features (if independent)
    - Bug fixes (if different components)
```

## Success Metrics

### Routing Effectiveness
- **Correct First Route**: >90% requests routed correctly first time
- **SLA Achievement**: >95% tasks completed within SLA
- **Rerou ting Rate**: <10% tasks need rerouting
- **User Satisfaction**: >4.5/5 with routing decisions

### Efficiency Metrics
- **Time to Route**: <30 seconds for decision
- **Parallel Execution**: >60% tasks use parallelization
- **Context Reuse**: >40% decisions use cached context
- **Agent Utilization**: >70% agent time on productive work

## Emergency Overrides

### Manual Override Commands
```yaml
override_commands:
  force_workflow:
    command: "/force [workflow_name]"
    permission: "User confirmation required"
    
  skip_validation:
    command: "/skip-validation"
    warning: "May build wrong solution"
    
  emergency_fix:
    command: "/emergency"
    action: "Routes directly to incident-commander"
    
  all_hands:
    command: "/all-hands"
    action: "Activates all teams immediately"
```

## References
- Follow @.agent-os/standards/speed-principles.md for SLA targets
- Use @.agent-os/standards/user-centric-principles.md for prioritization
- Apply @.agent-os/standards/solo-engineer-practices.md for efficiency
- Check @.agent-os/config.yml for team definitions
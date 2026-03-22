---
description: Multi-agent orchestration system for coordinating teams and workflows
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Multi-Agent Orchestrator

## Overview
Coordinate multiple agents and teams to execute complex workflows efficiently while maintaining context and quality.

<orchestration_framework>

<phase number="1" name="initialization">

### Phase 1: Workflow Initialization

Set up the execution environment and prepare agents for coordinated work.

<initialization_steps>
  <context_setup>
    - Create session directory: @.agent-os/context/[session_id]/
    - Initialize shared state file: state.yml
    - Create progress tracking: progress.md
    - Set up inter-agent communication: messages/
  </context_setup>
  
  <agent_preparation>
    - Load required agents based on workflow
    - Inject shared context and standards
    - Set execution constraints (time limits, quality gates)
    - Establish communication protocols
  </agent_preparation>
  
  <workflow_configuration>
    - Parse workflow definition
    - Identify parallel vs sequential tasks
    - Set up synchronization points
    - Configure quality gates
  </workflow_configuration>
</initialization_steps>

</phase>

<phase number="2" name="execution_planning">

### Phase 2: Execution Planning

Create an optimal execution plan based on dependencies and parallelization opportunities.

<execution_strategies>

  <parallel_execution_plan>
    ```yaml
    parallel_tracks:
      track_1:
        name: "User Research"
        agents: [ux-researcher, market-researcher]
        duration: 30_minutes
        output: user_validation.md
        
      track_2:
        name: "Technical Research"
        agents: [architect, ai-researcher]
        duration: 30_minutes
        output: technical_approach.md
        
      synchronization_point:
        wait_for: [track_1, track_2]
        merge_outputs: combined_research.md
        next_phase: design_phase
    ```
  </parallel_execution_plan>
  
  <sequential_execution_plan>
    ```yaml
    sequential_stages:
      stage_1:
        name: "Problem Validation"
        agent: product-owner
        duration: 30_minutes
        gate: "3+ users confirm problem"
        
      stage_2:
        name: "Solution Design"
        agent: ux-designer
        duration: 45_minutes
        requires: stage_1.output
        
      stage_3:
        name: "Implementation"
        agents: [backend-engineer, frontend-engineer]
        duration: 60_minutes
        requires: stage_2.output
    ```
  </sequential_execution_plan>
  
  <hybrid_execution_plan>
    ```yaml
    execution_phases:
      phase_1_parallel:
        - user_research
        - technical_research
        - market_analysis
        
      phase_2_convergence:
        synthesize: [phase_1_outputs]
        decision_agent: architect
        
      phase_3_parallel:
        - backend_development
        - frontend_development
        - documentation
        
      phase_4_integration:
        integrate: [phase_3_outputs]
        test_agent: qa-engineer
    ```
  </hybrid_execution_plan>

</execution_strategies>

<dependency_management>
  <dependency_types>
    data_dependency:
      description: "Agent B needs output from Agent A"
      handling: "Sequential execution with handoff"
      
    resource_dependency:
      description: "Agents need same resource (e.g., database)"
      handling: "Coordinate access with locks"
      
    approval_dependency:
      description: "Requires validation before proceeding"
      handling: "Gate with approval agent"
      
    knowledge_dependency:
      description: "Needs domain expertise"
      handling: "Consult specialist agent first"
  </dependency_types>
  
  <conflict_resolution>
    schedule_conflict:
      detection: "Two agents scheduled for same resource"
      resolution: "Priority-based scheduling"
      
    output_conflict:
      detection: "Agents produce conflicting recommendations"
      resolution: "Escalate to lead agent for domain"
      
    resource_conflict:
      detection: "Agents compete for limited resource"
      resolution: "Time-slice or serialize access"
  </conflict_resolution>
</dependency_management>

</phase>

<phase number="3" name="execution_coordination">

### Phase 3: Execution Coordination

Actively coordinate agents during execution, managing handoffs and resolving issues.

<coordination_protocols>

  <agent_activation>
    ```typescript
    interface AgentActivation {
      agent: string;
      task: string;
      input: {
        context: string;
        requirements: string[];
        constraints: {
          timeLimit: number;
          qualityGates: string[];
        };
      };
      output: {
        format: 'markdown' | 'yaml' | 'json';
        location: string;
        validation: string[];
      };
    }
    ```
  </agent_activation>
  
  <inter_agent_communication>
    <message_protocol>
      format: "YAML frontmatter + Markdown body"
      location: "@.agent-os/context/[session]/messages/"
      naming: "[timestamp]-[from_agent]-[to_agent].md"
      
      example:
        ```yaml
        ---
        from: backend-engineer
        to: frontend-engineer
        type: api_contract
        priority: high
        ---
        # API Contract for User Service
        
        ## Endpoints
        - POST /api/users/create
        - GET /api/users/:id
        - PUT /api/users/:id
        ```
    </message_protocol>
    
    <broadcast_protocol>
      all_agents: "@.agent-os/context/[session]/broadcast.md"
      team_only: "@.agent-os/context/[session]/[team]/broadcast.md"
      update_frequency: "Every 30 minutes or on milestone"
    </broadcast_protocol>
  </inter_agent_communication>
  
  <synchronization_points>
    <checkpoint_types>
      milestone:
        description: "Major phase completion"
        action: "Validate outputs, update progress"
        
      gate:
        description: "Quality or approval gate"
        action: "Validate criteria, approve/reject"
        
      handoff:
        description: "Work transition between agents"
        action: "Package context, notify next agent"
        
      convergence:
        description: "Multiple tracks merge"
        action: "Integrate outputs, resolve conflicts"
    </checkpoint_types>
    
    <synchronization_protocol>
      ```yaml
      checkpoint:
        name: "Design Complete"
        type: gate
        criteria:
          - "UI mockups approved by user"
          - "Technical feasibility confirmed"
          - "Accessibility standards met"
        on_success:
          notify: [backend-engineer, frontend-engineer]
          provide: [design_specs, api_requirements]
        on_failure:
          notify: [ux-designer]
          action: "Iterate on design"
      ```
    </synchronization_protocol>
  </synchronization_points>

</coordination_protocols>

<progress_monitoring>
  <tracking_mechanisms>
    real_time_progress:
      file: "@.agent-os/context/[session]/progress.md"
      updates: "Every 5 minutes for active agents"
      format: |
        ## Current Status
        - Phase: [current_phase]
        - Progress: [percentage]%
        - Active Agents: [list]
        - Blocked: [any_blockers]
        - ETA: [estimated_completion]
        
    agent_status:
      file: "@.agent-os/context/[session]/agents/[agent].yml"
      content:
        ```yaml
        agent: backend-engineer
        status: active
        current_task: "Implementing user API"
        progress: 60%
        started: "2024-01-27T10:00:00Z"
        eta: "2024-01-27T10:30:00Z"
        blockers: none
        output_preview: "3 endpoints completed"
        ```
  </tracking_mechanisms>
  
  <alerting_rules>
    sla_warning:
      trigger: "80% of time limit reached"
      action: "Notify user, suggest simplification"
      
    agent_blocked:
      trigger: "Agent blocked for >5 minutes"
      action: "Escalate to orchestrator for resolution"
      
    quality_gate_failed:
      trigger: "Required criteria not met"
      action: "Return to previous phase, iterate"
      
    conflict_detected:
      trigger: "Agents produce conflicting outputs"
      action: "Invoke conflict resolution protocol"
  </alerting_rules>
</progress_monitoring>

</phase>

<phase number="4" name="output_integration">

### Phase 4: Output Integration

Combine outputs from multiple agents into cohesive deliverables.

<integration_patterns>
  
  <merge_strategies>
    concatenation:
      when: "Independent sections from different agents"
      how: "Append outputs in logical order"
      example: "Documentation from multiple components"
      
    synthesis:
      when: "Overlapping insights need integration"
      how: "Identify common themes, resolve conflicts"
      example: "Research findings from multiple sources"
      
    layering:
      when: "Outputs build on each other"
      how: "Stack outputs maintaining dependencies"
      example: "Backend API -> Frontend UI -> Tests"
      
    selection:
      when: "Multiple solutions proposed"
      how: "Choose best based on criteria"
      example: "Architecture proposals"
  </merge_strategies>
  
  <quality_assurance>
    consistency_check:
      - Terminology alignment across outputs
      - Code style consistency
      - Design pattern adherence
      - Documentation format standardization
      
    completeness_check:
      - All required sections present
      - No missing dependencies
      - Test coverage adequate
      - Documentation complete
      
    integration_testing:
      - Components work together
      - APIs match contracts
      - Data flows correctly
      - Error handling consistent
  </quality_assurance>
  
  <final_assembly>
    ```yaml
    deliverable_structure:
      feature_package:
        code:
          - backend/api/
          - frontend/components/
          - shared/types/
        tests:
          - unit/
          - integration/
          - e2e/
        documentation:
          - README.md
          - API.md
          - USER_GUIDE.md
        deployment:
          - config/
          - scripts/
          - monitoring/
    ```
  </final_assembly>

</integration_patterns>

</phase>

<phase number="5" name="completion_validation">

### Phase 5: Completion & Validation

Validate the complete solution meets requirements and user needs.

<validation_protocols>
  
  <automated_validation>
    technical_validation:
      - Code compilation/build success
      - Test suite passing
      - Linting and formatting clean
      - Security scan passing
      - Performance benchmarks met
      
    functional_validation:
      - User workflows complete
      - Edge cases handled
      - Error messages user-friendly
      - Accessibility standards met
      - Mobile responsiveness verified
  </automated_validation>
  
  <user_validation>
    validation_checklist:
      - Original problem solved?
      - Solution intuitive to use?
      - Performance acceptable?
      - Any missing features?
      - Ready for production?
      
    feedback_collection:
      method: "Direct user testing"
      duration: "15-30 minutes"
      success_criteria: ">80% satisfaction"
  </user_validation>
  
  <handoff_preparation>
    deployment_package:
      - Production-ready code
      - Deployment instructions
      - Rollback procedures
      - Monitoring setup
      - User communication
      
    documentation_package:
      - Technical documentation
      - User guides
      - API references
      - Troubleshooting guides
      - Future roadmap
  </handoff_preparation>

</validation_protocols>

</phase>

</orchestration_framework>

## Orchestration Patterns

### Pattern 1: Rapid Response Orchestra
```yaml
pattern: rapid_response
scenario: "Critical bug affecting users"
orchestration:
  immediate:
    agents: [incident-commander, support-engineer]
    action: "Acknowledge and investigate"
    time: 2_minutes
    
  parallel_fix:
    track_1:
      agents: [backend-engineer]
      action: "Fix backend issue"
    track_2:
      agents: [frontend-engineer]  
      action: "Add error handling"
    time: 10_minutes
    
  validation:
    agents: [qa-engineer]
    action: "Test fix"
    time: 3_minutes
    
total_time: 15_minutes
```

### Pattern 2: Feature Development Symphony
```yaml
pattern: feature_symphony
scenario: "New feature development"
orchestration:
  movement_1_research:
    parallel:
      - agent: ux-researcher
        output: user_needs.md
      - agent: architect
        output: technical_approach.md
    time: 30_minutes
    
  movement_2_design:
    sequential:
      - agent: product-owner
        output: requirements.md
      - agent: ux-designer
        output: designs.md
    time: 45_minutes
    
  movement_3_build:
    parallel:
      - agent: backend-engineer
        output: api/
      - agent: frontend-engineer
        output: ui/
    time: 90_minutes
    
  movement_4_polish:
    parallel:
      - agent: qa-engineer
        output: tests/
      - agent: technical-writer
        output: docs/
    time: 30_minutes
    
total_time: 3.25_hours
```

### Pattern 3: Validation Waltz
```yaml
pattern: validation_waltz
scenario: "User problem validation"
orchestration:
  step_1_research:
    agent: ux-researcher
    action: "Interview 5 users"
    time: 20_minutes
    
  step_2_analysis:
    agent: product-analyst
    action: "Analyze feedback"
    time: 10_minutes
    
  step_3_decision:
    agent: product-owner
    action: "Go/no-go decision"
    time: 5_minutes
    
  step_4_prototype:
    agent: ui-designer
    action: "Quick mockup"
    time: 25_minutes
    
total_time: 1_hour
```

## Context Preservation

### Session State Management
```yaml
session_state:
  location: "@.agent-os/context/[session_id]/state.yml"
  content:
    session:
      id: "uuid"
      started: "timestamp"
      workflow: "rapid-validation"
      user_problem: "description"
      
    agents:
      active: [list]
      completed: [list]
      blocked: [list]
      
    progress:
      phase: "current_phase"
      percentage: 65
      milestones: [completed_milestones]
      
    outputs:
      validation: "path/to/validation.md"
      design: "path/to/design.md"
      implementation: "path/to/code/"
      
    decisions:
      - agent: architect
        decision: "Use existing API"
        rationale: "Faster to market"
        timestamp: "when"
```

### Knowledge Transfer Protocol
```yaml
knowledge_transfer:
  between_agents:
    format: "Structured markdown with YAML frontmatter"
    required_sections:
      - summary: "Key findings/decisions"
      - context: "Background information"
      - deliverables: "What was produced"
      - next_steps: "What needs to be done"
      - blockers: "Any issues to resolve"
      
  between_phases:
    checkpoint_document: "phase_[n]_complete.md"
    includes:
      - All agent outputs
      - Decisions made
      - Validation results
      - Updated requirements
      
  between_sessions:
    persistent_context: "@.agent-os/knowledge/"
    includes:
      - User problems validated
      - Technical decisions
      - Design patterns used
      - Lessons learned
```

## Performance Optimization

### Parallel Execution Rules
```yaml
parallelization:
  always_parallel:
    - Research activities (user, market, technical)
    - Independent component development
    - Documentation and testing
    - Multiple bug fixes in different areas
    
  conditional_parallel:
    condition: "API contract defined"
    then_parallel: [backend, frontend]
    
    condition: "Design system exists"
    then_parallel: [multiple_ui_components]
    
  never_parallel:
    - Requirements before implementation
    - Implementation before testing
    - Testing before deployment
```

### Resource Management
```yaml
resource_optimization:
  agent_pooling:
    hot_agents: [product-owner, backend-engineer, qa-engineer]
    warm_agents: [architect, ux-designer]
    cold_agents: [specialized_agents]
    
  context_caching:
    cache_duration: 30_days
    cached_items:
      - User problems
      - Technical decisions
      - API contracts
      - Test scenarios
      
  batch_processing:
    batch_similar: true
    batch_size: 3
    examples:
      - Multiple bug fixes
      - Similar feature requests
      - Documentation updates
```

## Error Handling

### Failure Recovery
```yaml
failure_scenarios:
  agent_failure:
    detection: "No output within time limit"
    recovery:
      - Retry with same agent (once)
      - Fallback to alternative agent
      - Escalate to human
      
  validation_failure:
    detection: "Quality gate not passed"
    recovery:
      - Return to previous phase
      - Iterate with feedback
      - Simplify requirements
      
  integration_failure:
    detection: "Components don't work together"
    recovery:
      - Identify integration point
      - Fix contracts/interfaces
      - Re-test integration
      
  complete_failure:
    detection: "Workflow cannot complete"
    recovery:
      - Document failure reason
      - Preserve partial work
      - Suggest alternative approach
```

## Success Metrics

### Orchestration Effectiveness
- **Workflow Completion Rate**: >95% workflows complete successfully
- **SLA Achievement**: >90% complete within time limits
- **Parallel Utilization**: >60% of time in parallel execution
- **Context Reuse**: >40% decisions leverage past context
- **First-Time Success**: >80% workflows succeed without retry

### Quality Metrics
- **Integration Success**: >95% components integrate successfully
- **User Validation**: >85% user acceptance on first try
- **Rework Rate**: <20% of work needs revision
- **Knowledge Transfer**: 100% of handoffs include context

## References
- Use @.agent-os/instructions/meta/smart-router.md for routing
- Follow @.agent-os/standards/speed-principles.md for timing
- Apply @.agent-os/standards/user-centric-principles.md for validation
- Check @.agent-os/config.yml for agent definitions
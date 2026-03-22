---
description: Multi-agent coordinated development workflow inspired by Ultrathink methodology
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Ultrathink Development Workflow

## Overview
Coordinate multiple specialized agents to solve complex problems through systematic collaboration and knowledge synthesis.

<pre_flight_check>
  EXECUTE: @~/.agent-os/instructions/meta/pre-flight.md
</pre_flight_check>

<process_flow>

<step number="1" subagent="architect" name="design_phase" time_limit="30_minutes">

### Step 1: Architecture Design Phase

Use the architect subagent to analyze the problem and design a high-level technical approach.

<design_scope>
  <problem_analysis>Break down the user problem into technical components</problem_analysis>
  <solution_design>Design system architecture and component interactions</solution_design>
  <technology_selection>Choose appropriate technologies from tech stack</technology_selection>
  <integration_planning>Plan how components work together</integration_planning>
</design_scope>

<instructions>
  ACTION: Use architect subagent
  INPUT: Read user problem and requirements
  ANALYZE: Technical complexity and approach options
  DESIGN: High-level architecture and component structure
  REFERENCE: @.agent-os/standards/tech-selection.md
  TIME_LIMIT: 30 minutes maximum
  OUTPUT: @.agent-os/specs/[SPEC]/ultrathink/architecture.md
</instructions>

<architecture_deliverables>
  - System component diagram
  - Technology choices with rationale
  - Data flow for user workflows
  - Integration points and APIs
  - Performance and scalability considerations
</architecture_deliverables>

</step>

<step number="2" subagent="ai-researcher" name="research_phase" time_limit="20_minutes">

### Step 2: Knowledge Research Phase

Use the ai-researcher subagent to gather relevant knowledge, best practices, and proven patterns for the solution.

<research_scope>
  <best_practices>Research industry best practices for this type of feature</best_practices>
  <patterns>Find proven implementation patterns</patterns>
  <pitfalls>Identify common mistakes and how to avoid them</pitfalls>
  <optimization>Research performance and UX optimization techniques</optimization>
</research_scope>

<instructions>
  ACTION: Use ai-researcher subagent
  INPUT: Read architecture.md from step 1
  RESEARCH: Best practices and proven patterns
  IDENTIFY: Common pitfalls and optimization opportunities
  TIME_LIMIT: 20 minutes maximum
  OUTPUT: @.agent-os/specs/[SPEC]/ultrathink/research.md
</instructions>

<research_deliverables>
  - Best practice recommendations
  - Proven implementation patterns
  - Common pitfalls to avoid
  - Performance optimization techniques
  - Security considerations
</research_deliverables>

</step>

<step number="3" subagent="security-engineer" name="security_review" time_limit="15_minutes">

### Step 3: Security Review Phase

Use the security-engineer subagent to review the architecture for security implications and user data protection.

<security_scope>
  <data_protection>Review user data handling and privacy</data_protection>
  <authentication>Validate authentication and authorization approach</authentication>
  <vulnerabilities>Identify potential security vulnerabilities</vulnerabilities>
  <compliance>Ensure regulatory compliance (GDPR, CCPA)</compliance>
</security_scope>

<instructions>
  ACTION: Use security-engineer subagent
  INPUT: Read architecture.md and research.md
  REVIEW: Security implications and data protection
  VALIDATE: Authentication and authorization design
  TIME_LIMIT: 15 minutes maximum
  OUTPUT: @.agent-os/specs/[SPEC]/ultrathink/security-review.md
</instructions>

<security_deliverables>
  - Security risk assessment
  - Data protection requirements
  - Authentication/authorization validation
  - Compliance requirements checklist
  - Security testing requirements
</security_deliverables>

</step>

<step number="4" name="parallel_implementation" time_limit="90_minutes">

### Step 4: Parallel Implementation Phase

Execute coordinated implementation across multiple engineering agents working on different components simultaneously.

<parallel_execution>
  <backend_track>
    <agent>backend-engineer</agent>
    <responsibility>APIs, database, business logic</responsibility>
    <input>architecture.md + security-review.md</input>
    <output>Backend implementation + API documentation</output>
  </backend_track>
  
  <frontend_track>
    <agent>frontend-engineer</agent>
    <responsibility>User interface and frontend logic</responsibility>
    <input>architecture.md + research.md</input>
    <output>Frontend implementation + component documentation</output>
  </frontend_track>
  
  <mobile_track_conditional>
    <agent>mobile-engineer</agent>
    <condition>If mobile component required</condition>
    <responsibility>Mobile-specific implementation</responsibility>
    <input>architecture.md + frontend patterns</input>
    <output>Mobile implementation</output>
  </mobile_track_conditional>
</parallel_execution>

<coordination_protocol>
  <communication>Agents document integration points as they work</communication>
  <synchronization>Check integration compatibility every 30 minutes</synchronization>
  <conflict_resolution>Architect agent resolves integration conflicts</conflict_resolution>
  <progress_tracking>Update shared progress document</progress_tracking>
</coordination_protocol>

<instructions>
  ACTION: Coordinate parallel implementation
  ASSIGN: Specific responsibilities to each agent
  MONITOR: Integration compatibility and progress
  RESOLVE: Any conflicts through architect agent
  TIME_LIMIT: 90 minutes total
  OUTPUT: Fully integrated working feature
</instructions>

</step>

<step number="5" subagent="qa-engineer" name="integration_testing" time_limit="20_minutes">

### Step 5: Integration Testing Phase

Use the qa-engineer subagent to test the complete integrated feature across all components and user workflows.

<testing_scope>
  <integration>Test component interactions work correctly</integration>
  <user_workflows>Validate complete user journeys end-to-end</user_workflows>
  <error_scenarios>Test error handling across components</error_scenarios>
  <performance>Validate acceptable performance under load</performance>
</testing_scope>

<instructions>
  ACTION: Use qa-engineer subagent
  TEST: Complete integrated feature with realistic scenarios
  VALIDATE: All components work together correctly
  CHECK: User workflows complete successfully
  TIME_LIMIT: 20 minutes maximum
  OUTPUT: @.agent-os/specs/[SPEC]/ultrathink/integration-test-results.md
</instructions>

<integration_test_types>
  - **Component Integration**: Do all pieces work together?
  - **Data Flow**: Does data flow correctly through system?
  - **User Workflow**: Can users complete intended tasks?
  - **Error Handling**: Are errors handled gracefully across components?
  - **Performance**: Does system respond fast enough for users?
</integration_test_types>

</step>

<step number="6" name="coordinated_deployment" time_limit="15_minutes">

### Step 6: Coordinated Deployment

Deploy the complete feature with proper monitoring, user communication, and rollback preparation.

<deployment_coordination>
  <staging_validation>Final validation in staging environment</staging_validation>
  <production_deployment>Coordinated deployment of all components</production_deployment>
  <monitoring_setup>Comprehensive monitoring and alerting</monitoring_setup>
  <user_communication>Notify users of new capability</user_communication>
</deployment_coordination>

<instructions>
  ACTION: Execute coordinated deployment
  VALIDATE: All components work in staging
  DEPLOY: All components to production simultaneously
  MONITOR: Feature performance and adoption
  COMMUNICATE: Feature availability to users
  TIME_LIMIT: 15 minutes maximum
</instructions>

</step>

<step number="7" subagent="ux-researcher" name="post_launch_validation" time_limit="30_minutes">

### Step 7: Post-Launch User Validation

Use the ux-researcher subagent to validate feature success with real user adoption and feedback.

<validation_metrics>
  <adoption>How many users are trying the feature?</adoption>
  <completion>How many users complete the intended workflow?</completion>
  <satisfaction>How satisfied are users with the solution?</satisfaction>
  <problem_resolution>Did we actually solve the original problem?</problem_resolution>
</validation_metrics>

<instructions>
  ACTION: Use ux-researcher subagent
  MEASURE: Feature adoption and user success
  COLLECT: User feedback on problem resolution
  ANALYZE: Whether feature achieves intended outcomes
  TIME_LIMIT: 30 minutes for initial data collection
  OUTPUT: @.agent-os/specs/[SPEC]/ultrathink/post-launch-analysis.md
</instructions>

</step>

</process_flow>

## Agent Coordination Protocols

### Communication Standards
```yaml
agent_communication:
  progress_updates:
    frequency: "Every 30 minutes during parallel work"
    format: "Agent status + blockers + integration needs"
    location: "@.agent-os/specs/[SPEC]/ultrathink/progress.md"
    
  integration_points:
    documentation: "API contracts, data schemas, component interfaces"
    validation: "Integration tests for each handoff point"
    conflict_resolution: "Architect agent makes final decisions"
    
  context_sharing:
    method: "File-based context in ultrathink/ directory"
    handoffs: "Each agent reads predecessor's output"
    preservation: "All decisions and rationale documented"
```

### Conflict Resolution Protocol
```yaml
conflicts:
  technical_disagreement:
    resolver: "architect agent"
    criteria: "Best serves user needs + fastest to ship"
    documentation: "Decision rationale in architecture.md"
    
  user_experience_disagreement:
    resolver: "ux-researcher agent" 
    criteria: "Test with real users to decide"
    documentation: "User testing results decide"
    
  security_vs_speed:
    resolver: "security-engineer agent"
    criteria: "Security requirements non-negotiable"
    workaround: "Find secure solution that ships fast"
```

### Quality Gates Between Agents
```yaml
handoff_requirements:
  architect_to_engineers:
    deliverables: ["Component specifications", "API contracts", "Data schemas"]
    validation: "Engineers can start implementation immediately"
    
  research_to_implementation:
    deliverables: ["Best practices summary", "Pattern recommendations"]
    validation: "Implementation follows proven patterns"
    
  security_to_implementation:
    deliverables: ["Security requirements", "Compliance checklist"]
    validation: "Implementation includes all security measures"
    
  implementation_to_qa:
    deliverables: ["Working feature", "Test documentation"]
    validation: "QA can test complete user workflows"
```

## Workflow Variations

### Simple Feature (Use Rapid Validation Instead)
If feature can be built in <4 hours total, use rapid-validation.md instead of ultrathink.

### Complex Feature (Extended Ultrathink)
For features requiring >1 day, add these additional phases:
- Performance engineering phase
- Extended user testing phase  
- Documentation and training phase

### Critical Bug Fix (Use Fast-Track Instead)
For urgent fixes, use fast-track-bug-fix.md workflow instead.

## Success Metrics

### Coordination Effectiveness
- **Agent Collaboration**: No rework due to miscommunication
- **Integration Success**: All components work together on first try
- **Knowledge Transfer**: Research insights applied in implementation
- **Quality Consistency**: All components meet same quality standards

### Speed with Quality
- **Total Time**: Complex features completed in <1 day
- **User Quality**: >90% user satisfaction with coordinated features
- **Technical Quality**: <3% bug rate in first month
- **Team Efficiency**: Agents don't duplicate work or block each other

## Integration with Standard Workflows

### Relationship to Create-Spec
```markdown
Use ultrathink-development.md when:
- Feature is complex (>4 hours estimated)
- Multiple technical domains involved
- High user impact requiring quality
- Integration with multiple system components

Use standard create-spec.md when:
- Feature is straightforward
- Single domain (just frontend or just backend)
- Clear technical approach
- Low complexity implementation
```

### Relationship to Execute-Tasks
```markdown
Ultrathink replaces execute-tasks when:
- Need coordinated implementation across agents
- Research and security review required
- Complex integration testing needed

Use standard execute-tasks when:
- Spec is complete and clear
- Single agent can handle implementation
- Standard patterns and approaches
```

## References
- Follow @.agent-os/standards/speed-principles.md for urgency
- Use @.agent-os/standards/user-centric-principles.md for decisions
- Reference @.agent-os/standards/tech-selection.md for technology choices
- Check @.agent-os/product/mission-lite.md for alignment
---
description: {{WORKFLOW_DESCRIPTION}}
globs:
alwaysApply: {{ALWAYS_APPLY}}
version: 2.0
encoding: UTF-8
---

# {{WORKFLOW_NAME}} Workflow

## Overview
{{WORKFLOW_OVERVIEW}}

<pre_flight_check>
  EXECUTE: @~/.agent-os/instructions/meta/pre-flight.md
</pre_flight_check>

<process_flow>

<step number="1" subagent="{{AGENT_1}}" name="{{STEP_1_NAME}}" time_limit="{{TIME_1}}">

### Step 1: {{STEP_1_TITLE}}

{{STEP_1_DESCRIPTION}}

<scope>
  <objective>{{STEP_1_OBJECTIVE}}</objective>
  <deliverables>{{STEP_1_DELIVERABLES}}</deliverables>
  <success_criteria>{{STEP_1_SUCCESS}}</success_criteria>
</scope>

<instructions>
  ACTION: {{STEP_1_ACTION}}
  INPUT: {{STEP_1_INPUT}}
  VALIDATE: {{STEP_1_VALIDATION}}
  OUTPUT: @.agent-os/{{OUTPUT_PATH_1}}
  TIME_LIMIT: {{TIME_1}}
</instructions>

<quality_gates>
  - {{GATE_1}}
  - {{GATE_2}}
  - {{GATE_3}}
</quality_gates>

</step>

<step number="2" subagent="{{AGENT_2}}" name="{{STEP_2_NAME}}" time_limit="{{TIME_2}}">

### Step 2: {{STEP_2_TITLE}}

{{STEP_2_DESCRIPTION}}

<scope>
  <objective>{{STEP_2_OBJECTIVE}}</objective>
  <deliverables>{{STEP_2_DELIVERABLES}}</deliverables>
  <success_criteria>{{STEP_2_SUCCESS}}</success_criteria>
</scope>

<instructions>
  ACTION: {{STEP_2_ACTION}}
  INPUT: Read {{OUTPUT_PATH_1}} from step 1
  VALIDATE: {{STEP_2_VALIDATION}}
  OUTPUT: @.agent-os/{{OUTPUT_PATH_2}}
  TIME_LIMIT: {{TIME_2}}
</instructions>

</step>

<step number="3" name="{{STEP_3_NAME}}" time_limit="{{TIME_3}}">

### Step 3: {{STEP_3_TITLE}}

{{STEP_3_DESCRIPTION}}

<parallel_execution>
  <track_1>
    <agent>{{PARALLEL_AGENT_1}}</agent>
    <responsibility>{{PARALLEL_RESP_1}}</responsibility>
    <output>{{PARALLEL_OUTPUT_1}}</output>
  </track_1>
  
  <track_2>
    <agent>{{PARALLEL_AGENT_2}}</agent>
    <responsibility>{{PARALLEL_RESP_2}}</responsibility>
    <output>{{PARALLEL_OUTPUT_2}}</output>
  </track_2>
</parallel_execution>

<instructions>
  ACTION: {{STEP_3_ACTION}}
  COORDINATE: {{COORDINATION_METHOD}}
  INTEGRATE: {{INTEGRATION_APPROACH}}
  TIME_LIMIT: {{TIME_3}}
</instructions>

</step>

<step number="4" subagent="{{AGENT_4}}" name="{{STEP_4_NAME}}" time_limit="{{TIME_4}}">

### Step 4: {{STEP_4_TITLE}}

{{STEP_4_DESCRIPTION}}

<validation_scope>
  <test_coverage>{{TEST_REQUIREMENTS}}</test_coverage>
  <user_validation>{{USER_VALIDATION}}</user_validation>
  <quality_check>{{QUALITY_CHECK}}</quality_check>
</validation_scope>

<instructions>
  ACTION: {{STEP_4_ACTION}}
  TEST: {{TEST_APPROACH}}
  VALIDATE: {{VALIDATION_CRITERIA}}
  OUTPUT: @.agent-os/{{OUTPUT_PATH_4}}
  TIME_LIMIT: {{TIME_4}}
</instructions>

<completion_criteria>
  SHIP if:
    - {{SHIP_CRITERIA_1}}
    - {{SHIP_CRITERIA_2}}
    - {{SHIP_CRITERIA_3}}
  
  ITERATE if:
    - {{ITERATE_CRITERIA_1}}
    - {{ITERATE_CRITERIA_2}}
    
  STOP if:
    - {{STOP_CRITERIA_1}}
    - {{STOP_CRITERIA_2}}
</completion_criteria>

</step>

</process_flow>

## Workflow Configuration

### Time Allocation
```yaml
total_time: {{TOTAL_TIME}}
breakdown:
  step_1: {{TIME_1}}
  step_2: {{TIME_2}}
  step_3: {{TIME_3}}
  step_4: {{TIME_4}}
buffer: {{BUFFER_TIME}}
```

### Agent Coordination
```yaml
coordination:
  sequential:
    - {{SEQUENTIAL_FLOW}}
  parallel:
    - {{PARALLEL_FLOW}}
  handoffs:
    - {{HANDOFF_PROTOCOL}}
```

### Quality Standards
```yaml
quality_gates:
  mandatory:
    - {{MANDATORY_GATE_1}}
    - {{MANDATORY_GATE_2}}
  optional:
    - {{OPTIONAL_GATE_1}}
    - {{OPTIONAL_GATE_2}}
```

## Success Metrics

### Speed Metrics
- **Total Completion**: < {{TOTAL_TIME}}
- **First Value Delivery**: < {{FIRST_VALUE_TIME}}
- **User Feedback Loop**: < {{FEEDBACK_TIME}}

### Quality Metrics
- **User Satisfaction**: > {{SATISFACTION_TARGET}}
- **Technical Quality**: {{QUALITY_TARGET}}
- **Test Coverage**: > {{COVERAGE_TARGET}}

### Business Metrics
- **Problem Resolution**: {{RESOLUTION_TARGET}}
- **User Adoption**: > {{ADOPTION_TARGET}}
- **ROI**: {{ROI_TARGET}}

## Escalation Procedures

### If Blocked
1. {{ESCALATION_STEP_1}}
2. {{ESCALATION_STEP_2}}
3. {{ESCALATION_STEP_3}}

### If Over Time
1. {{TIMEOUT_ACTION_1}}
2. {{TIMEOUT_ACTION_2}}
3. {{TIMEOUT_ACTION_3}}

### If Quality Issues
1. {{QUALITY_ACTION_1}}
2. {{QUALITY_ACTION_2}}
3. {{QUALITY_ACTION_3}}

## Output Structure
```
.agent-os/{{WORKFLOW_TYPE}}/{{SESSION_ID}}/
├── {{OUTPUT_DIR_1}}/     # {{OUTPUT_DESC_1}}
├── {{OUTPUT_DIR_2}}/     # {{OUTPUT_DESC_2}}
├── {{OUTPUT_DIR_3}}/     # {{OUTPUT_DESC_3}}
└── {{SUMMARY_FILE}}      # Workflow summary and decisions
```

## Integration Points

### With Other Workflows
- **{{RELATED_WORKFLOW_1}}**: {{RELATIONSHIP_1}}
- **{{RELATED_WORKFLOW_2}}**: {{RELATIONSHIP_2}}

### With Standards
- Follow @.agent-os/standards/{{STANDARD_1}}
- Apply @.agent-os/standards/{{STANDARD_2}}
- Use @.agent-os/standards/{{STANDARD_3}}

## Anti-Patterns to Avoid
❌ **{{ANTIPATTERN_1}}**: {{ANTIPATTERN_DESC_1}}
❌ **{{ANTIPATTERN_2}}**: {{ANTIPATTERN_DESC_2}}
❌ **{{ANTIPATTERN_3}}**: {{ANTIPATTERN_DESC_3}}

## References
- Base workflow structure from @.agent-os/templates/workflows/base.md
- Team definitions from @.agent-os/config.yml
- Standards from @.agent-os/standards/
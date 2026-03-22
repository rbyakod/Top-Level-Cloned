---
description: Rapid user problem validation and MVP creation workflow (2-hour feature validation)
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Rapid Validation Workflow

## Overview
Validate user problems and build MVPs in 2 hours: 30 minutes validation + 90 minutes MVP + deployment.

<pre_flight_check>
  EXECUTE: @~/.agent-os/instructions/meta/pre-flight.md
</pre_flight_check>

<process_flow>

<step number="1" subagent="ux-researcher" name="problem_validation" time_limit="30_minutes">

### Step 1: User Problem Validation (30 minutes)

Use the ux-researcher subagent to validate the user problem with real users before any development work begins.

<validation_approach>
  <method_1>Quick user interviews (20 minutes)</method_1>
  <method_2>Analytics review (10 minutes)</method_2>
</validation_approach>

<instructions>
  ACTION: Use ux-researcher subagent
  REQUEST: "Validate user problem: [USER_PROBLEM_STATEMENT]"
  REQUIREMENT: Contact 3-5 users from target persona
  TIME_LIMIT: 30 minutes maximum
  OUTPUT: @.agent-os/validation/[DATE]-[FEATURE]/problem-validation.md
</instructions>

<validation_criteria>
  PROCEED if:
    - 3+ users confirm they have this problem
    - Problem occurs weekly or more frequently
    - Users currently use workarounds
    - Users would pay for or actively use solution
  
  STOP if:
    - <3 users recognize the problem
    - Problem is rare or low-impact
    - Users have acceptable current solutions
    - Users wouldn't use proposed solution
</validation_criteria>

<decision_gate>
  IF validation_successful:
    PROCEED to rapid prototyping
  ELSE:
    STOP and document why problem not validated
    SUGGEST alternative problem to investigate
</decision_gate>

</step>

<step number="2" subagent="product-owner" name="solution_prioritization" time_limit="10_minutes">

### Step 2: Solution Prioritization (10 minutes)

Use the product-owner subagent to quickly prioritize this validated problem against other work and make go/no-go decision.

<prioritization_factors>
  <user_impact>Number of users affected</user_impact>
  <problem_severity>How much pain this causes</problem_severity>
  <implementation_effort>Estimated hours to MVP</implementation_effort>
  <strategic_alignment>Fits product mission and roadmap</strategic_alignment>
</prioritization_factors>

<instructions>
  ACTION: Use product-owner subagent
  INPUT: Read problem-validation.md from step 1
  EVALUATE: Problem priority vs current roadmap
  DECISION: Go/no-go for immediate MVP development
  TIME_LIMIT: 10 minutes maximum
  OUTPUT: @.agent-os/validation/[DATE]-[FEATURE]/priority-decision.md
</instructions>

<decision_criteria>
  BUILD_MVP if:
    - High user impact + Low implementation effort
    - Critical user problem (blocks core workflow)
    - Strategic alignment with product mission
  
  SCHEDULE_LATER if:
    - Medium priority + High implementation effort
    - Important but not urgent
  
  REJECT if:
    - Low user impact
    - Doesn't align with product strategy
    - Too complex for MVP approach
</decision_criteria>

</step>

<step number="3" subagent="ui-designer" name="rapid_prototype" time_limit="30_minutes">

### Step 3: Rapid UI Prototype (30 minutes)

Use the ui-designer subagent to create a simple, testable UI prototype for the validated solution.

<prototype_requirements>
  <fidelity>Low-fi wireframe or Figma prototype</fidelity>
  <focus>Core user workflow only</focus>
  <states>Default, loading, success, error states</states>
  <testing>Ready for user testing</testing>
</prototype_requirements>

<instructions>
  ACTION: Use ui-designer subagent
  INPUT: Read problem-validation.md and priority-decision.md
  CREATE: Simple prototype for core user workflow
  FOCUS: Usability over visual polish
  TIME_LIMIT: 30 minutes maximum
  OUTPUT: @.agent-os/validation/[DATE]-[FEATURE]/ui-prototype.md
</instructions>

<prototype_standards>
  - Use existing component patterns from @.agent-os/design-system/
  - Design for both mobile and desktop
  - Include all necessary user feedback states
  - Specify user interactions and flow
</prototype_standards>

</step>

<step number="4" subagent="architect" name="technical_approach" time_limit="20_minutes">

### Step 4: Technical Approach (20 minutes)

Use the architect subagent to design the simplest technical implementation that serves the user workflow.

<technical_requirements>
  <simplicity>Use existing patterns and technology</simplicity>
  <speed>Optimize for implementation speed</speed>
  <user_experience>Ensure good performance for users</user_experience>
  <maintainability>Code team can understand and maintain</maintainability>
</technical_requirements>

<instructions>
  ACTION: Use architect subagent  
  INPUT: Read ui-prototype.md and problem-validation.md
  DESIGN: Simplest technical implementation
  REFERENCE: @.agent-os/standards/tech-selection.md
  TIME_LIMIT: 20 minutes maximum
  OUTPUT: @.agent-os/validation/[DATE]-[FEATURE]/technical-approach.md
</instructions>

<architecture_constraints>
  - Reuse existing components and patterns
  - Use technology from approved tech stack
  - Design for <4 hours total implementation time
  - Include basic error handling and user feedback
</architecture_constraints>

</step>

<step number="5" name="mvp_implementation" time_limit="60_minutes">

### Step 5: MVP Implementation (60 minutes)

Implement the MVP based on validated user problem and approved technical approach.

<implementation_approach>
  <focus>Core user workflow only</focus>
  <quality>Working > perfect</quality>
  <testing>Happy path + basic error handling</testing>
  <deployment>Ship to staging immediately</deployment>
</implementation_approach>

<instructions>
  ACTION: Implement MVP feature
  REFERENCE: Technical approach from step 4
  FOLLOW: @.agent-os/standards/speed-principles.md
  BUILD: Core user workflow first
  TEST: With realistic user scenario
  TIME_LIMIT: 60 minutes maximum
</instructions>

<implementation_standards>
  <code_quality>
    - Follow existing code patterns
    - Use components from design system
    - Include user-friendly error messages
    - Add basic performance optimization
  </code_quality>
  
  <testing_approach>
    - Test core user workflow end-to-end
    - Test error scenarios with user-friendly messages
    - Test on mobile and desktop
    - Skip comprehensive edge case testing (MVP)
  </testing_approach>
</implementation_standards>

</step>

<step number="6" subagent="qa-engineer" name="mvp_validation" time_limit="15_minutes">

### Step 6: MVP Validation (15 minutes)

Use the qa-engineer subagent to validate the MVP works for the core user workflow and handles basic error scenarios.

<validation_scope>
  <core_workflow>Complete user task successfully</core_workflow>
  <error_handling>User-friendly error messages</error_handling>
  <performance>Acceptable speed for user task</performance>
  <accessibility>Basic keyboard navigation</accessibility>
</validation_scope>

<instructions>
  ACTION: Use qa-engineer subagent
  TEST: Core user workflow with realistic scenario
  VALIDATE: MVP solves validated user problem
  CHECK: Basic quality gates (errors, performance, accessibility)
  TIME_LIMIT: 15 minutes maximum
  OUTPUT: @.agent-os/validation/[DATE]-[FEATURE]/mvp-test-results.md
</instructions>

<quality_gates>
  SHIP if:
    - Core user workflow works end-to-end
    - Error messages are user-friendly
    - Performance acceptable for expected usage
    - No critical bugs in happy path
  
  FIX_FIRST if:
    - Core workflow broken
    - Poor error handling
    - Performance issues
    - Critical accessibility problems
</quality_gates>

</step>

<step number="7" name="rapid_deployment" time_limit="15_minutes">

### Step 7: Rapid Deployment & User Testing (15 minutes)

Deploy MVP to staging and set up for immediate user testing.

<deployment_process>
  <staging>Deploy to staging environment</staging>
  <monitoring>Set up basic error monitoring</monitoring>
  <user_access>Prepare for user testing</user_access>
  <rollback_plan>Ensure can rollback quickly</rollback_plan>
</deployment_process>

<instructions>
  ACTION: Deploy MVP to staging environment
  SETUP: Basic monitoring and error tracking
  PREPARE: For user testing (URLs, test accounts)
  DOCUMENT: Rollback procedures
  TIME_LIMIT: 15 minutes maximum
</instructions>

<deployment_checklist>
  - [ ] MVP deployed to staging
  - [ ] Core user workflow tested in staging
  - [ ] Error monitoring active
  - [ ] Test user accounts ready
  - [ ] Rollback plan documented
</deployment_checklist>

</step>

<step number="8" subagent="ux-researcher" name="immediate_user_testing" time_limit="30_minutes">

### Step 8: Immediate User Testing (30 minutes)

Use the ux-researcher subagent to test the MVP with 2-3 real users immediately after deployment.

<testing_approach>
  <participants>2-3 users from validation phase</participants>
  <scenario>Real-world task using staged MVP</scenario>
  <observation>Task completion and user satisfaction</observation>
  <iteration>Quick fixes based on feedback</iteration>
</testing_approach>

<instructions>
  ACTION: Use ux-researcher subagent
  TEST: MVP with 2-3 users from step 1
  OBSERVE: Task completion and user feedback
  DOCUMENT: Critical issues and user satisfaction
  TIME_LIMIT: 30 minutes maximum
  OUTPUT: @.agent-os/validation/[DATE]-[FEATURE]/user-test-results.md
</instructions>

<testing_criteria>
  SUCCESS if:
    - 2+ users complete core task successfully
    - Users rate experience >3/5
    - No critical usability issues
    - Users confirm problem is solved
  
  ITERATE if:
    - Users struggle with core workflow
    - Critical usability issues found
    - Users don't feel problem is solved
</testing_criteria>

</step>

<step number="9" name="ship_or_iterate_decision">

### Step 9: Ship or Iterate Decision

Based on user testing results, decide whether to ship to production or iterate.

<decision_framework>
  <ship_to_production>
    - Core user workflow works
    - Users confirm problem solved
    - No critical bugs or usability issues
    - Performance acceptable
  </ship_to_production>
  
  <iterate_once>
    - Minor usability issues
    - Performance improvements needed
    - User feedback suggests simple changes
  </iterate_once>
  
  <kill_feature>
    - Users still don't find value
    - Core workflow doesn't work
    - Too complex for rapid iteration
  </kill_feature>
</decision_framework>

<instructions>
  ACTION: Review user testing results from step 8
  DECIDE: Ship, iterate once, or kill feature
  EXECUTE: Based on decision
  DOCUMENT: Decision rationale and next steps
</instructions>

</step>

<step number="10" name="production_deployment" conditional="ship_decision">

### Step 10: Production Deployment (Conditional)

If shipping decision made, deploy to production with monitoring and user communication.

<deployment_requirements>
  <monitoring>Error tracking and performance monitoring</monitoring>
  <communication>User notification of new feature</communication>
  <rollback>Quick rollback plan if issues</rollback>
  <measurement>Success metrics tracking</measurement>
</deployment_requirements>

<instructions>
  ACTION: Deploy MVP to production
  SETUP: Comprehensive monitoring
  COMMUNICATE: Feature availability to validated users
  MONITOR: For first 24 hours
  DOCUMENT: Success metrics baseline
</instructions>

</step>

</process_flow>

## Workflow Success Metrics

### Speed Targets
- **Total Time**: 2 hours from problem to deployed MVP
- **Validation Time**: 30 minutes to confirm user problem
- **Build Time**: 90 minutes for working MVP
- **Test & Deploy**: 30 minutes to production

### Quality Gates
- **User Validation**: 3+ users confirm problem
- **MVP Functionality**: Core workflow works end-to-end
- **User Testing**: 2+ users successfully complete task
- **Production Ready**: Monitoring, error handling, rollback ready

### Success Criteria
- **User Adoption**: >50% of validated users try the feature
- **Problem Resolution**: >80% report problem solved
- **User Satisfaction**: >4/5 rating for MVP
- **Technical Quality**: <5% error rate in first week

## Emergency Procedures

### If User Validation Fails (Step 1)
1. Document why validation failed
2. Ask user for different problem to investigate
3. Don't build the originally proposed feature
4. Suggest alternative problems from user research

### If MVP Testing Fails (Step 8)
1. Identify critical issues from user feedback
2. Quick iteration (15-minute fixes only)
3. Re-test with same users
4. If still failing, kill feature and document lessons

### If Production Issues (Step 10)
1. Monitor user behavior and error rates
2. Quick fixes for critical issues (<15 minutes)
3. Communicate with users about improvements
4. Rollback if unfixable within 1 hour

## Anti-Patterns to Avoid

### Process Anti-Patterns
❌ **Skipping User Validation** - Building before confirming problem
❌ **Perfect MVP** - Spending >90 minutes on implementation
❌ **Feature Creep** - Adding scope during rapid validation
❌ **Over-Testing** - Comprehensive testing before user validation

### Technical Anti-Patterns
❌ **Complex Architecture** - Over-engineering for MVP
❌ **New Technology** - Learning new tools during rapid validation
❌ **Custom Components** - Building instead of reusing
❌ **Premature Optimization** - Performance tuning before user adoption

## Integration with Other Workflows

### After Successful Rapid Validation
```yaml
next_steps:
  if_users_love_mvp:
    workflow: "enhanced-create-spec.md"
    action: "Create full feature specification"
    
  if_users_use_mvp:
    workflow: "feature-enhancement.md"  
    action: "Improve based on usage data"
    
  if_users_ignore_mvp:
    action: "Kill feature, document lessons learned"
```

### Integration with Create-Spec
```xml
<!-- Enhanced create-spec can reference rapid validation -->
<step number="0" name="check_existing_validation" conditional="true">
  IF @.agent-os/validation/[FEATURE] exists:
    SKIP problem validation steps
    USE existing validation data
  ELSE:
    PROCEED with standard validation
</step>
```

## Output File Structure
```
.agent-os/validation/[DATE]-[FEATURE]/
├── problem-validation.md     # User problem confirmation
├── priority-decision.md      # Go/no-go decision
├── ui-prototype.md          # Simple design specs
├── technical-approach.md    # Implementation plan
├── mvp-test-results.md      # QA validation
└── user-test-results.md     # Real user feedback
```

## Success Examples

### Successful Rapid Validation
```markdown
Feature: "Quick user profile setup"
- 30 min: 4/5 users confirmed signup friction problem
- 10 min: High priority - blocks user activation
- 30 min: Simple form prototype designed
- 20 min: Basic technical approach (existing auth + form)
- 60 min: Working signup flow implemented
- 15 min: QA validated core workflow
- 15 min: Deployed to staging
- 30 min: 3 users tested successfully
Result: Shipped to production, 85% signup completion rate
```

### Failed Validation (Good Outcome)
```markdown
Feature: "Advanced dashboard customization"
- 30 min: 1/5 users wanted advanced customization
- 10 min: Low priority - nice to have only
Decision: KILLED - Focus on higher impact problems
Result: Saved 4+ hours, worked on validated problem instead
```

## References
- Follow @.agent-os/standards/user-centric-principles.md
- Use @.agent-os/standards/speed-principles.md for time limits
- Reference @.agent-os/standards/tech-selection.md for technical choices
- Check @.agent-os/users/personas.yml for user context
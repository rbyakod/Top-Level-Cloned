---
description: Build an MVP in 4 hours based on validated user problem
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# MVP Builder Workflow Template

## Overview
Build a functional MVP in 4 hours that solves a validated user problem. Focus on core functionality, ship fast, iterate based on usage.

<pre_flight_check>
  EXECUTE: @~/.agent-os/instructions/meta/pre-flight.md
  VERIFY: User problem has been validated
  CONFIRM: Clear success criteria defined
</pre_flight_check>

<process_flow>

<step number="1" subagent="product-owner" name="mvp_scoping" time_limit="30_minutes">

### Step 1: MVP Scope Definition (30 minutes)

Define the absolute minimum feature set that solves the validated user problem.

<scoping_criteria>
  <must_have>Core feature that directly solves the problem</must_have>
  <nice_to_have>Enhancements for better experience</nice_to_have>
  <not_now>Features to add after validation</not_now>
  <never>Scope creep and gold plating</never>
</scoping_criteria>

<instructions>
  ACTION: Define MVP scope from validated problem
  INPUT: Read validation from @.agent-os/validation/{{VALIDATION_PATH}}
  FOCUS: Smallest solution that works
  OUTPUT: @.agent-os/mvp/{{SESSION}}/scope.md
  TIME_LIMIT: 30 minutes maximum
</instructions>

<mvp_principles>
  - Solve one problem well
  - Can ship today
  - Real users can use it
  - Measures success
</mvp_principles>

</step>

<step number="2" subagent="ui-designer" name="rapid_design" time_limit="45_minutes">

### Step 2: Rapid UI Design (45 minutes)

Create simple, functional UI design using existing components from design system.

<design_constraints>
  <reuse>Use existing design system components</reuse>
  <simplicity>Minimal screens and interactions</simplicity>
  <mobile>Works on mobile from day one</mobile>
  <accessibility>Basic WCAG compliance</accessibility>
</design_constraints>

<instructions>
  ACTION: Design minimal UI for MVP scope
  REFERENCE: @.agent-os/design-system/components/
  CREATE: Simple wireframes or mockups
  FOCUS: Functionality over polish
  OUTPUT: @.agent-os/mvp/{{SESSION}}/design.md
  TIME_LIMIT: 45 minutes maximum
</instructions>

</step>

<step number="3" name="parallel_implementation" time_limit="120_minutes">

### Step 3: Parallel Implementation (2 hours)

Build the MVP with parallel frontend and backend development.

<parallel_tracks>
  <backend_track>
    <agent>backend-engineer</agent>
    <tasks>
      - Set up database schema
      - Create API endpoints
      - Implement business logic
      - Add basic validation
    </tasks>
    <output>Working API</output>
    <time>120 minutes</time>
  </backend_track>
  
  <frontend_track>
    <agent>frontend-engineer</agent>
    <tasks>
      - Create UI components
      - Connect to API
      - Handle user interactions
      - Display data and feedback
    </tasks>
    <output>Working UI</output>
    <time>120 minutes</time>
  </frontend_track>
</parallel_tracks>

<coordination_points>
  <t0>Agree on API contract</t0>
  <t30>Check integration compatibility</t30>
  <t60>Test data flow</t60>
  <t90>Begin integration testing</t90>
  <t120>Complete integrated MVP</t120>
</coordination_points>

<instructions>
  ACTION: Build MVP in parallel tracks
  COORDINATE: Via API contract in @.agent-os/mvp/{{SESSION}}/api.yml
  FOCUS: Working code over perfect code
  INTEGRATE: Test together at checkpoints
  TIME_LIMIT: 2 hours maximum
</instructions>

</step>

<step number="4" subagent="qa-engineer" name="rapid_testing" time_limit="30_minutes">

### Step 4: Rapid Testing & Deployment (30 minutes)

Test core user workflow and deploy to staging for immediate user testing.

<testing_priorities>
  <priority_1>Core user workflow works end-to-end</priority_1>
  <priority_2>No data loss or corruption</priority_2>
  <priority_3>Usable error messages</priority_3>
  <skip>Edge cases and performance optimization</skip>
</testing_priorities>

<instructions>
  ACTION: Test MVP core functionality
  FOCUS: User can complete primary task
  FIX: Only showstopper bugs
  DEPLOY: To staging environment
  TIME_LIMIT: 30 minutes maximum
  OUTPUT: @.agent-os/mvp/{{SESSION}}/test-results.md
</instructions>

<deployment_checklist>
  - [ ] Core workflow tested
  - [ ] Basic error handling works
  - [ ] Deployed to staging
  - [ ] Test accounts created
  - [ ] Monitoring enabled
</deployment_checklist>

</step>

<step number="5" subagent="ux-researcher" name="immediate_validation" time_limit="45_minutes">

### Step 5: Immediate User Validation (45 minutes)

Get the MVP in front of real users immediately for feedback.

<validation_approach>
  <participants>3-5 users from original validation</participants>
  <task>Complete the core workflow</task>
  <measure>Task completion and satisfaction</measure>
  <iterate>Fix critical issues immediately</iterate>
</validation_approach>

<instructions>
  ACTION: Test MVP with real users
  PARTICIPANTS: Users from problem validation phase
  OBSERVE: Task completion and friction points
  COLLECT: Feedback on problem resolution
  TIME_LIMIT: 45 minutes maximum
  OUTPUT: @.agent-os/mvp/{{SESSION}}/user-feedback.md
</instructions>

<success_criteria>
  SHIP to production if:
    - 3+ users complete core task
    - Users confirm problem solved
    - No critical usability issues
    - Performance acceptable
  
  ITERATE quickly if:
    - Minor usability issues
    - Small bugs found
    - Feature requests (note for v2)
  
  PIVOT if:
    - Users can't complete task
    - Problem not actually solved
    - Fundamental design flaw
</success_criteria>

</step>

</process_flow>

## Time Management

### 4-Hour Sprint Breakdown
```yaml
total_time: 4_hours
phases:
  scoping: 30_minutes      # Define MVP scope
  design: 45_minutes       # Create simple UI
  build: 120_minutes       # Parallel development
  test: 30_minutes         # Core testing
  validate: 45_minutes     # User feedback
```

### Time Boxing Rules
- **Hard stops** at each phase limit
- **Scope reduction** if running over
- **Skip nice-to-haves** to stay on time
- **Ship what works** rather than perfection

## Technology Choices for Speed

### Frontend Stack
```yaml
framework: Next.js          # Fast development
styling: Tailwind CSS       # Rapid prototyping  
components: shadcn/ui       # Pre-built components
state: React hooks          # Simple state management
```

### Backend Stack
```yaml
runtime: Node.js            # Same language as frontend
framework: Express          # Minimal setup
database: PostgreSQL        # Reliable, feature-rich
orm: Prisma                # Type-safe, fast development
```

### Deployment
```yaml
frontend: Vercel            # Push to deploy
backend: Railway            # Simple backend hosting
database: Supabase          # Managed PostgreSQL
monitoring: Sentry          # Error tracking
```

## MVP Patterns

### Common MVP Features
1. **Authentication**: Use Supabase Auth or Clerk
2. **CRUD Operations**: Standard REST APIs
3. **Real-time Updates**: Supabase Realtime or Pusher
4. **File Upload**: Direct to S3 or Cloudinary
5. **Payments**: Stripe Checkout (not custom)

### What to Skip in MVP
- Custom authentication systems
- Complex permission models
- Performance optimization
- Extensive error handling
- Multiple user roles
- Advanced features
- Perfect UI polish

## Success Metrics

### Launch Day Metrics
- **Deployment Success**: Accessible to users
- **Core Function Works**: Primary task completable
- **User Feedback**: Positive problem resolution
- **Error Rate**: <5% for core workflow

### Week 1 Metrics
- **User Adoption**: 50%+ try the feature
- **Task Completion**: 80%+ successful
- **User Retention**: 40%+ return
- **Feedback Quality**: Actionable improvements identified

## After MVP Ships

### Immediate Next Steps
1. Monitor user behavior and errors
2. Fix critical bugs within 24 hours
3. Collect user feedback actively
4. Plan v2 based on actual usage

### Iteration Strategy
```yaml
week_1:
  focus: "Fix critical issues"
  time: "2-4 hours"
  
week_2:
  focus: "Top user requests"
  time: "1 day"
  
week_3:
  focus: "Performance and polish"
  time: "2 days"
  
week_4:
  focus: "Plan next major iteration"
  time: "Full spec process"
```

## Anti-Patterns to Avoid

❌ **Feature Creep**: Adding "just one more thing"
❌ **Perfectionism**: Polishing instead of shipping
❌ **Over-Engineering**: Complex solutions for simple problems
❌ **Assumption Building**: Not validating with users first
❌ **Technology Tourism**: Trying new tech in MVP

## References
- Follow @.agent-os/standards/speed-principles.md
- Use @.agent-os/standards/tech-selection.md defaults
- Apply @.agent-os/standards/user-centric-principles.md
- Check @.agent-os/validation/ for user problems
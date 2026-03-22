---
description: 15-minute critical bug fix workflow with parallel response and rapid deployment
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Fast-Track Bug Fix Workflow

## Overview
Fix critical user-facing bugs in 15 minutes through parallel investigation, rapid fixing, and immediate deployment.

<pre_flight_check>
  EXECUTE: @~/.agent-os/instructions/meta/pre-flight.md
</pre_flight_check>

<process_flow>

<step number="1" name="parallel_initial_response" time_limit="2_minutes">

### Step 1: Parallel Initial Response (2 minutes)

Execute immediate parallel response to acknowledge user issue and begin investigation.

<parallel_execution>
  <track_1_user_communication>
    <responsibility>Acknowledge user issue immediately</responsibility>
    <timeline>Within 2 minutes of report</timeline>
    <communication>Professional, empathetic, action-oriented</communication>
  </track_1_user_communication>
  
  <track_2_bug_investigation>
    <responsibility>Begin reproducing and analyzing the issue</responsibility>
    <timeline>Start within 2 minutes of report</timeline>
    <focus>User-facing symptoms and impact scope</focus>
  </track_2_bug_investigation>
</parallel_execution>

<user_communication_template>
  "Thanks for reporting this! We're investigating immediately. 
   I'll update you with a fix within 15 minutes.
   
   If you need immediate help, here's a workaround: [IF_KNOWN]"
</user_communication_template>

<instructions>
  ACTION: Execute both tracks simultaneously
  TRACK_1: Immediate user acknowledgment
  TRACK_2: Start bug reproduction
  TIME_LIMIT: 2 minutes total
  PRIORITY: User communication takes precedence
</instructions>

</step>

<step number="2" subagent="qa-engineer" name="rapid_reproduction" time_limit="5_minutes">

### Step 2: Rapid Bug Reproduction (5 minutes)

Use the qa-engineer subagent to quickly reproduce the user issue and identify the root cause.

<reproduction_approach>
  <user_scenario>Replicate exact user workflow that failed</user_scenario>
  <environment>Test in production-like conditions</environment>
  <data_state>Use realistic user data for testing</data_state>
  <scope_analysis>Determine how many users affected</scope_analysis>
</reproduction_approach>

<instructions>
  ACTION: Use qa-engineer subagent
  REPRODUCE: Exact user scenario that failed
  IDENTIFY: Root cause and failure point
  ASSESS: Impact scope (how many users affected)
  TIME_LIMIT: 5 minutes maximum
  OUTPUT: @.agent-os/bugs/[DATE]-[BUG]/reproduction.md
</instructions>

<reproduction_deliverables>
  - Step-by-step reproduction instructions
  - Root cause identification
  - User impact assessment (number of affected users)
  - Error messages and stack traces
  - Immediate workarounds if available
</reproduction_deliverables>

<escalation_criteria>
  IF cannot reproduce in 5 minutes:
    ESCALATE to architect agent for system-level analysis
    CONTINUE user communication with status update
  ELSE:
    PROCEED to rapid fix implementation
</escalation_criteria>

</step>

<step number="3" name="rapid_fix_implementation" time_limit="5_minutes">

### Step 3: Rapid Fix Implementation (5 minutes)

Implement the simplest, safest fix that resolves the user issue.

<fix_approach>
  <principle>Simplest fix that works</principle>
  <safety>No risk of breaking other functionality</safety>
  <user_focus>Restores user workflow immediately</user_focus>
  <monitoring>Easy to monitor success/failure</monitoring>
</fix_approach>

<fix_strategies>
  <immediate_workaround>
    - Disable broken functionality temporarily
    - Route users to alternative workflow
    - Show user-friendly maintenance message
  </immediate_workaround>
  
  <quick_code_fix>
    - Fix obvious code errors (typos, logic bugs)
    - Revert recent changes that caused issue
    - Add missing validation or error handling
  </quick_code_fix>
  
  <configuration_fix>
    - Update environment variables
    - Fix configuration values
    - Restart services with correct settings
  </configuration_fix>
</fix_strategies>

<instructions>
  ACTION: Implement simplest safe fix
  REFERENCE: Bug reproduction from step 2
  FOCUS: Restore user workflow functionality
  VALIDATE: Fix works in staging/local environment
  TIME_LIMIT: 5 minutes maximum
</instructions>

</step>

<step number="4" name="rapid_testing_deployment" time_limit="3_minutes">

### Step 4: Rapid Testing & Deployment (3 minutes)

Test the fix with user scenario and deploy immediately to production.

<testing_approach>
  <user_scenario>Test exact user workflow that was broken</user_scenario>
  <regression_check>Verify fix doesn't break related functionality</regression_check>
  <performance_check>Ensure fix doesn't impact performance</performance_check>
</testing_approach>

<deployment_approach>
  <method>Immediate deployment to production</method>
  <monitoring>Enhanced monitoring during deployment</monitoring>
  <rollback>Ready to rollback within 1 minute if issues</rollback>
</deployment_approach>

<instructions>
  ACTION: Test fix with original user scenario
  VALIDATE: User workflow now works correctly
  DEPLOY: Immediately to production
  MONITOR: For successful resolution
  TIME_LIMIT: 3 minutes maximum
</instructions>

</step>

<step number="5" name="user_confirmation" time_limit="2_minutes">

### Step 5: User Confirmation & Documentation (2 minutes)

Confirm fix works for original user and document the incident for future prevention.

<user_confirmation>
  <notification>Immediate notification to reporting user</notification>
  <verification>Ask user to confirm issue resolved</verification>
  <apology>Professional apology and commitment to quality</apology>
  <follow_up>Schedule follow-up to ensure satisfaction</follow_up>
</user_confirmation>

<user_communication_template>
  "Fixed! The issue you reported has been resolved. 
   
   Can you please try [specific action] again and confirm it works?
   
   Sorry this happened - we've added monitoring to prevent it in the future."
</user_communication_template>

<instructions>
  ACTION: Notify user of fix completion
  REQUEST: User confirmation that issue resolved
  DOCUMENT: Bug details and fix for future reference
  SCHEDULE: Follow-up check within 24 hours
  TIME_LIMIT: 2 minutes maximum
  OUTPUT: @.agent-os/bugs/[DATE]-[BUG]/resolution.md
</instructions>

</step>

<step number="6" subagent="architect" name="prevention_analysis" time_limit="3_minutes">

### Step 6: Quick Prevention Analysis (3 minutes)

Use the architect subagent to quickly identify how to prevent this class of bugs in the future.

<prevention_scope>
  <root_cause>Why did this bug occur?</root_cause>
  <detection>How can we catch this earlier?</detection>
  <monitoring>What monitoring would have alerted us?</monitoring>
  <process>What process change prevents recurrence?</process>
</prevention_scope>

<instructions>
  ACTION: Use architect subagent  
  ANALYZE: Root cause and prevention opportunities
  RECOMMEND: Monitoring, testing, or process improvements
  SCHEDULE: Implementation of prevention measures
  TIME_LIMIT: 3 minutes maximum
  OUTPUT: @.agent-os/bugs/[DATE]-[BUG]/prevention.md
</instructions>

</step>

</process_flow>

## Critical Bug Classification

### Severity Levels
```yaml
critical:
  definition: "Users cannot complete core workflow"
  examples: ["Signup broken", "Payment processing down", "Data loss"]
  sla: "15 minutes to fix"
  
high:
  definition: "Feature unavailable but workaround exists"
  examples: ["Feature crashes", "Poor performance", "UI broken"]
  sla: "2 hours to fix"
  
medium:
  definition: "Inconvenience but doesn't block users"
  examples: ["UI polish issue", "Minor data inconsistency"]
  sla: "1 day to fix"
  
low:
  definition: "Edge case or cosmetic issue"
  examples: ["Typos", "Alignment issues", "Rare edge cases"]
  sla: "1 week to fix"
```

### Bug Source Patterns
```yaml
common_sources:
  deployment_issues:
    - Environment configuration errors
    - Missing environment variables
    - Database migration failures
    
  code_errors:
    - Logic bugs in new features
    - Integration failures
    - Null pointer exceptions
    
  infrastructure:
    - Service outages
    - Database connectivity
    - Third-party API failures
    
  user_data:
    - Data corruption
    - Migration issues
    - Permission problems
```

## Fast-Track Fix Strategies

### Immediate Workarounds (0-2 minutes)
```yaml
workaround_strategies:
  feature_flag:
    action: "Disable broken feature temporarily"
    communication: "Feature temporarily unavailable for maintenance"
    timeline: "Immediate relief while fixing"
    
  graceful_degradation:
    action: "Route to alternative workflow"
    communication: "Using backup method while we fix the primary"
    timeline: "Immediate alternative for users"
    
  cache_clear:
    action: "Clear application/CDN cache"
    communication: "Refreshing system, please try again"
    timeline: "Often fixes deployment-related issues"
```

### Quick Code Fixes (2-8 minutes)
```typescript
// Standard quick fix patterns
const quickFixPatterns = {
  // Null safety fixes
  nullCheck: (value) => value?.property ?? defaultValue,
  
  // Input validation fixes  
  validateInput: (input) => input && typeof input === 'string' && input.length > 0,
  
  // Error boundary fixes
  errorFallback: (error, fallbackUI) => {
    logError(error)
    return fallbackUI
  },
  
  // API timeout fixes
  timeoutProtection: async (apiCall, timeoutMs = 5000) => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeoutMs)
    return await apiCall({ signal: controller.signal })
  }
}
```

### Configuration Fixes (1-3 minutes)
```bash
# Common configuration fixes
# Environment variable fixes
export MISSING_VAR="correct_value"

# Service restart fixes  
systemctl restart application

# Database connection fixes
# Check and restart database connections

# Cache invalidation fixes
redis-cli FLUSHALL
```

## User Communication During Fixes

### Communication Timeline
```yaml
timeline:
  t0: "Issue reported by user"
  t2min: "Acknowledged, working on fix"
  t8min: "Update on progress, ETA for fix"  
  t15min: "Fixed! Please confirm it works"
  t1hour: "Follow-up to ensure satisfaction"
  t24hour: "Check no related issues"
```

### Communication Templates
```markdown
## Initial Response (2 minutes)
"Thanks for reporting this! We're investigating immediately and will have this fixed within 15 minutes. I'll update you with progress."

## Progress Update (8 minutes)
"Found the issue - [brief explanation]. Implementing fix now, should be resolved in the next 5 minutes."

## Resolution (15 minutes)
"Fixed! The [specific issue] has been resolved. Please try [specific action] and let me know if it works correctly now."

## Follow-up (1 hour)
"Following up on the fix from earlier. Is everything working well for you now? Any other issues?"
```

## Quality Gates for Fast Fixes

### Before Deploying Fix
- [ ] Fix tested with original user scenario
- [ ] No obvious regression risks
- [ ] User-friendly error handling maintained
- [ ] Basic performance not degraded

### After Deploying Fix  
- [ ] Original user confirms issue resolved
- [ ] No new bug reports from fix
- [ ] Monitoring shows normal system behavior
- [ ] User satisfaction maintained

## Prevention System Integration

### Monitoring Setup
```yaml
monitoring_requirements:
  error_tracking:
    - Real-time error alerts
    - User-facing error categorization
    - Impact assessment (users affected)
    
  performance_monitoring:
    - Response time degradation alerts
    - Database performance tracking
    - User workflow completion rates
    
  user_behavior:
    - Failed action tracking
    - Support ticket correlation
    - User drop-off points
```

### Automated Prevention
```typescript
// Standard prevention patterns
const preventionPatterns = {
  // Input validation to prevent user errors
  validateUserInput: (input) => {
    if (!input) throw new UserError("This field is required")
    if (input.length > 1000) throw new UserError("Input too long")
    return sanitizeInput(input)
  },
  
  // Graceful degradation for service failures
  withFallback: async (primaryService, fallbackService) => {
    try {
      return await primaryService()
    } catch (error) {
      logError(error, { level: 'warning' })
      return await fallbackService()
    }
  },
  
  // User-centric error handling
  handleUserError: (error, userContext) => {
    return {
      message: "We couldn't complete that action",
      action: "Please try again, or contact support if it continues",
      supportId: generateSupportId(),
      userFriendly: true
    }
  }
}
```

## Integration with Other Workflows

### Escalation to Ultrathink
```yaml
escalation_criteria:
  complex_bug:
    condition: "Root cause requires multiple system changes"
    action: "Switch to ultrathink-development.md workflow"
    
  architecture_issue:
    condition: "Bug indicates deeper architectural problem"
    action: "Schedule architecture review after immediate fix"
    
  recurring_pattern:
    condition: "Same class of bug happening repeatedly"
    action: "Initiate systematic prevention project"
```

### Prevention Project Planning
```yaml
prevention_projects:
  monitoring_enhancement:
    trigger: "Bug not caught by current monitoring"
    workflow: "create-spec.md for monitoring improvements"
    
  architecture_improvement:
    trigger: "Multiple bugs from same system component"
    workflow: "ultrathink-development.md for architectural fix"
    
  user_education:
    trigger: "Users consistently making same mistake"
    workflow: "UX improvement spec"
```

## Bug Documentation Standards

### Incident Report Format
```markdown
# Bug Report: [Date] - [User-Friendly Title]

## User Impact
- **Users Affected**: [Number or percentage]
- **Symptom**: What users experienced
- **User Workflow**: Which user task was blocked
- **Business Impact**: Revenue/retention effect if applicable

## Technical Details
- **Root Cause**: [Technical explanation]
- **System Component**: [Code/service that failed]
- **Error Messages**: [Exact errors users saw]
- **Reproduction Steps**: [How to reproduce]

## Resolution
- **Fix Applied**: [What was changed]
- **Time to Fix**: [Actual time from report to deployment]
- **Testing**: [How fix was validated]
- **User Confirmation**: [User reported resolution]

## Prevention
- **Monitoring Added**: [New alerts or tracking]
- **Process Improvement**: [Changes to prevent recurrence]
- **Follow-up Actions**: [Scheduled improvements]
```

### Bug Metrics Tracking
```yaml
bug_metrics:
  response_times:
    acknowledgment: "<2 minutes"
    reproduction: "<5 minutes"  
    fix_implementation: "<5 minutes"
    deployment: "<3 minutes"
    total_resolution: "<15 minutes"
    
  quality_metrics:
    user_satisfaction_post_fix: ">4.5/5"
    recurrence_rate: "<5% same bug type"
    prevention_success: "90% fewer similar bugs"
    
  process_metrics:
    workflow_adherence: "100% follow 15-min protocol"
    communication_timeliness: "100% users updated within SLA"
    documentation_completeness: "100% incidents documented"
```

## Emergency Escalation Procedures

### If Fix Takes >15 Minutes
```yaml
escalation_process:
  t15min:
    action: "Communicate delay to user"
    message: "Taking longer than expected, investigating deeper issue"
    
  t30min: 
    action: "Implement temporary workaround"
    message: "Implemented workaround while we fix the root cause"
    
  t1hour:
    action: "Escalate to senior engineer or architect"
    workflow: "Switch to ultrathink-development for complex fix"
```

### If Fix Creates New Issues
```yaml
regression_handling:
  immediate:
    action: "Rollback fix within 1 minute"
    communication: "Reverted change, investigating alternative fix"
    
  alternative_approach:
    action: "Try different fix strategy"
    timeline: "15 minutes for alternative fix"
    
  workaround:
    action: "Implement user workaround"
    communication: "Temporary alternative while we perfect the fix"
```

## User Communication Standards

### Acknowledgment Messages
```markdown
## Critical Bug (15-min fix)
"Thanks for reporting this! This is blocking your workflow and we're fixing it immediately. I'll have an update in 15 minutes."

## High Priority Bug (2-hour fix)  
"Thanks for the report! We're investigating this issue and will have it resolved within 2 hours. I'll keep you updated on progress."

## Workaround Communication
"While we fix the root cause, you can [specific workaround]. This should let you continue your work while we perfect the solution."
```

### Resolution Messages
```markdown
## Successful Fix
"Fixed! The [specific issue] has been resolved. Please try [specific action] and confirm it works for you now."

## Temporary Fix
"We've implemented a temporary fix that should resolve the immediate issue. We're working on a permanent solution and will update you when complete."

## Alternative Solution
"We've found a better approach that solves your problem. Instead of [old way], you can now [new way]. This should be more reliable."
```

## Success Examples

### Example 1: Payment Processing Bug
```markdown
t0: User reports "Payment failed with error"
t2min: "Thanks! Investigating payment issue immediately"
t5min: Bug reproduction - API timeout issue
t8min: Fix - increase timeout and add retry logic
t12min: Deploy fix with monitoring
t15min: "Fixed! Please try your payment again"
Result: User payment successful, no other issues
```

### Example 2: Mobile App Crash
```markdown
t0: User reports "App crashes when opening profile"
t2min: "Thanks! Looking into profile crash immediately"  
t4min: Bug reproduction - null data causing crash
t7min: Fix - add null checks and graceful fallback
t10min: Deploy fix via OTA update
t12min: "Fixed! Please update app and try again"
t15min: User confirms app working normally
Result: Crash resolved, improved error handling
```

## Anti-Patterns in Bug Fixing

### Process Anti-Patterns
❌ **Analysis Paralysis** - Investigating for >5 minutes before fixing
❌ **Perfect Fix** - Over-engineering the solution
❌ **Silent Fixing** - Not communicating with affected users
❌ **Batch Fixing** - Waiting to fix multiple bugs together

### Technical Anti-Patterns  
❌ **Complex Fixes** - Major refactoring during emergency
❌ **New Technology** - Trying new tools during crisis
❌ **Comprehensive Testing** - Full test suite before emergency deployment
❌ **Documentation First** - Writing docs before fixing user issue

## References
- Follow @.agent-os/standards/speed-principles.md for urgency
- Use @.agent-os/standards/user-centric-principles.md for user communication
- Reference @.agent-os/product/mission-lite.md for context
- Check existing codebase patterns for consistent fixes
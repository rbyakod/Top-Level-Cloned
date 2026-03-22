# Speed Principles

## Core Philosophy
**Ship fast, learn faster. User problems solved today are worth more than perfect solutions shipped next month.**

## The Speed Mantras

### 1. Ship in Hours, Not Days
- **Critical Bugs**: Fixed and deployed in 15 minutes
- **Feature MVPs**: Built and shipped in 4 hours
- **User Validation**: Get feedback in 2 hours
- **User Response**: Acknowledge in 2 minutes

### 2. Boring Technology Wins
- Use technology the team knows well
- Choose proven solutions over cutting-edge
- Prefer managed services over custom implementation
- Copy working patterns from existing codebase

### 3. Perfect is the Enemy of Shipped
- Ship MVPs to get real user feedback
- Iterate based on user behavior, not assumptions
- Clean up code after validating user value
- Kill features that don't solve real problems

### 4. Automate for Speed
- Automate testing for instant feedback
- Automate deployment for one-click shipping
- Automate monitoring to catch issues fast
- Automate rollback for quick recovery

## Implementation Guidelines

### Code for Speed
```typescript
// FAST: Use existing patterns
const existingPattern = useExistingHook()

// SLOW: Reinvent patterns
const customImplementation = buildFromScratch()

// FAST: Leverage libraries
import { Button } from '@/components/ui/button'

// SLOW: Build components
const CustomButton = () => { /* custom implementation */ }

// FAST: Use boring technology
const database = new PostgreSQL() // Everyone knows it

// SLOW: Use exciting technology  
const database = new NewDatabase() // Learning curve
```

### Decision Speed
```yaml
decision_framework:
  reversible_decisions:
    time_limit: "10 minutes maximum"
    approach: "Choose quickly, iterate based on feedback"
    examples: ["UI colors", "API parameter names", "component structure"]
    
  irreversible_decisions:
    time_limit: "1 hour maximum"
    approach: "Research quickly, decide confidently"
    examples: ["Database choice", "Authentication provider", "Mobile framework"]
    
  default_answer: "Ship and learn"
  escalation: "If can't decide in time limit, ask user"
```

### Development Speed Patterns
```markdown
## Rapid Development Checklist

### Before Starting (5 minutes)
- [ ] User problem clearly defined?
- [ ] Success metrics established?
- [ ] Existing patterns to reuse identified?
- [ ] Technology choices confirmed?

### During Development (2-4 hours)
- [ ] Start with tests that define user success
- [ ] Reuse existing components and patterns
- [ ] Focus on happy path first
- [ ] Handle errors gracefully but simply
- [ ] Ship to staging immediately when working

### Before Shipping (15 minutes)
- [ ] Core user workflow works end-to-end
- [ ] Error messages are user-friendly
- [ ] Performance acceptable for expected load
- [ ] Security basics covered (auth, validation, sanitization)
- [ ] Can rollback quickly if issues

### After Shipping (ongoing)
- [ ] Monitor user adoption and feedback
- [ ] Fix critical issues within 15 minutes
- [ ] Iterate based on user behavior data
- [ ] Clean up code once user value proven
```

## Speed vs Quality Balance

### Quality Gates That Don't Slow Shipping
```yaml
# Required for all features
critical_gates:
  - user_workflow_tested: "Core user path works"
  - security_basics: "Auth, input validation, error handling"
  - rollback_plan: "Can undo deployment quickly"
  - user_communication: "Can notify users of issues"

# Nice to have but don't block shipping
improvement_gates:
  - code_optimization: "Refactor after user validation"
  - comprehensive_tests: "Add after MVP proves valuable"
  - performance_tuning: "Optimize after scale demands"
  - documentation: "Complete after user adoption"
```

### Technical Debt Management
```markdown
## Ship Fast, Clean Fast Philosophy

### Shipping Priorities
1. **User workflow works** (required)
2. **Security basics covered** (required)
3. **Can monitor and fix issues** (required)
4. **Code is clean** (nice to have)

### Cleanup Strategy
- **Week 1**: Ship MVP, gather user feedback
- **Week 2**: Clean code for features users adopted
- **Week 3**: Kill features users didn't adopt
- **Week 4**: Optimize performance for popular features

### Technical Debt Rules
- Never let debt block new user features
- Clean successful features immediately after validation
- Kill unsuccessful features instead of improving them
- Refactor when adding new features to existing code
```

## Team Speed Standards

### Communication Speed
- **Decision Needed**: Answer within 1 hour or escalate
- **Blocker Encountered**: Report within 30 minutes
- **User Complaint**: Acknowledge within 2 minutes
- **Bug Report**: Investigate within 15 minutes

### Handoff Speed
```yaml
# Agent-to-agent handoffs
handoff_sla:
  design_to_engineering: "15 minutes to start implementation"
  backend_to_frontend: "30 minutes to integrate APIs"
  development_to_qa: "45 minutes to test and validate"
  qa_to_deployment: "15 minutes to deploy if passing"
```

### Learning Speed
- **New Technology**: Must ship working feature within 4 hours
- **New Pattern**: Document for team reuse within 1 hour
- **Problem Solving**: Try 3 approaches max, then ask for help
- **Research**: Maximum 30 minutes before making decision

## Emergency Speed Procedures

### Critical User Issue
```markdown
# 15-Minute Critical Fix Protocol

### Minutes 0-5: Assessment
- Reproduce user issue
- Determine impact scope (how many users?)
- Classify severity (blocks core workflow?)

### Minutes 5-10: Response
- Implement immediate fix or workaround
- Test fix with user scenario
- Prepare rollback if needed

### Minutes 10-15: Deploy & Communicate
- Deploy fix to production
- Notify affected users issue is resolved
- Monitor for 30 minutes to ensure stability
```

### Rapid Feature Delivery
```markdown
# 4-Hour MVP Protocol

### Hour 1: Validation & Design
- Validate user problem (30 min)
- Design simple solution (30 min)

### Hours 2-3: Implementation  
- Build core user workflow (2 hours)
- Test with realistic user scenario

### Hour 4: Ship & Monitor
- Deploy to production
- Monitor user adoption
- Gather initial feedback
```

## Success Metrics

### Speed Metrics
- **Time to Fix Critical Bug**: <15 minutes
- **Time to Ship MVP**: <4 hours
- **Time to User Response**: <2 minutes
- **Time to Validate Problem**: <30 minutes

### Quality Metrics (Don't Compromise)
- **User Satisfaction**: >90% with shipped features
- **Bug Recurrence**: <5% of fixed bugs reoccur
- **Feature Adoption**: >50% of users try new features
- **Performance**: Core workflows remain fast

## Anti-Patterns (Things That Slow Shipping)

### Avoid These Speed Killers
```markdown
❌ **Over-Engineering**
- Building for 1M users when you have 100
- Creating abstractions before you need them
- Optimizing performance before you have scale

❌ **Perfect Code First**
- Refactoring before user validation
- Comprehensive test suites for unproven features
- Documentation before user adoption

❌ **Analysis Paralysis**
- Researching all options instead of trying one
- Waiting for perfect design before building
- Endless review cycles

❌ **Technology Experiments**
- Using new frameworks on user-facing features
- Building custom solutions for solved problems
- Learning new languages during feature development

✅ **Speed Enablers**
- Reusing proven patterns and components
- Choosing boring, reliable technology
- Building MVPs and iterating quickly
- Shipping to learn, not shipping to impress
```

## References
- Apply to all agents and workflows
- Supersedes other concerns except security and user experience
- When in doubt, optimize for shipping speed while maintaining user trust
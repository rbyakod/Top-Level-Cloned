# Agent OS v2.0 Testing & Validation Guide

## Overview
Complete testing guide to validate that Agent OS v2.0 is properly installed and all workflows function correctly.

## 🧪 System Validation Tests

### Test 1: Configuration Validation
```bash
# Verify config.yml is properly loaded
cat config.yml | grep "agent_os_version: 2.0.0"
# Expected: Shows version 2.0.0

# Check default project type
cat config.yml | grep "default_project_type: one_person_company"
# Expected: one_person_company mode active

# Verify team structures exist
ls .agent-os/agents/
# Expected: See product/, engineering/, design/, quality/ directories
```

### Test 2: Agent Installation
```bash
# Check Product team agents
ls ~/.claude/agents/product*.md
# Expected: product-owner.md, product-analyst.md, requirements-writer.md

# Check Engineering team agents  
ls ~/.claude/agents/*engineer*.md
# Expected: backend-engineer.md, frontend-engineer.md, etc.

# Check Design team agents
ls ~/.claude/agents/*design*.md
# Expected: ux-designer.md, ui-designer.md, etc.

# Total agent count
ls ~/.claude/agents/*.md | wc -l
# Expected: 35+ agent files
```

### Test 3: Workflow Installation
```bash
# Check rapid workflows
ls .agent-os/instructions/enhanced/*.md
# Expected: rapid-validation.md, fast-track-bug-fix.md, ultrathink-development.md

# Check meta workflows
ls .agent-os/instructions/meta/*.md
# Expected: smart-router.md, orchestrator.md, state-management.md

# Check standard workflows (backward compatibility)
ls .agent-os/instructions/*.md
# Expected: create-spec.md, execute-tasks.md, etc.
```

### Test 4: Standards Verification
```bash
# Check standards documents
ls .agent-os/standards/*.md
# Expected files:
# - speed-principles.md
# - user-centric-principles.md  
# - tech-selection.md
# - solo-engineer-practices.md
```

## 🚀 Workflow Testing

### Rapid Validation Test (2 hours)
```bash
# Test command recognition
/validate "test problem: users can't save preferences"

# Expected workflow steps:
# 1. ux-researcher agent activates
# 2. Problem validation starts
# 3. User interview simulation
# 4. Prototype creation
# 5. Validation results in 2 hours
```

#### Validation Checklist:
- [ ] Router correctly identifies validation request
- [ ] UX researcher agent activates
- [ ] Product owner makes prioritization decision
- [ ] UI designer creates prototype
- [ ] Output saved to .agent-os/validation/
- [ ] Time tracking shows <2 hours

### Bug Fix Test (15 minutes)
```bash
# Test rapid bug fix
/fix-bug "test bug: login button not responding"

# Expected workflow steps:
# 1. Incident commander acknowledges (2 min)
# 2. Bug reproduction (5 min)
# 3. Fix implementation (5 min)
# 4. Testing and deployment (3 min)
```

#### Bug Fix Checklist:
- [ ] Emergency response triggered
- [ ] Parallel investigation starts
- [ ] Fix implemented quickly
- [ ] Basic testing completed
- [ ] User notified of resolution
- [ ] Total time <15 minutes

### MVP Builder Test (4 hours)
```bash
# Test MVP building
/build-mvp "test feature: dark mode toggle"

# Expected workflow steps:
# 1. Scope definition (30 min)
# 2. UI design (45 min)
# 3. Parallel development (2 hours)
# 4. Testing (30 min)
# 5. User validation (45 min)
```

#### MVP Checklist:
- [ ] Scope properly limited to MVP
- [ ] Design uses existing components
- [ ] Backend and frontend work in parallel
- [ ] Core functionality works
- [ ] User testing completed
- [ ] Total time <4 hours

### Ultrathink Test (Complex Problem)
```bash
# Test multi-agent coordination
/ultrathink "test: redesign authentication system"

# Expected workflow steps:
# 1. Architect designs solution
# 2. Security engineer reviews
# 3. Multiple teams coordinate
# 4. Parallel implementation
# 5. Integration testing
```

#### Ultrathink Checklist:
- [ ] Multiple teams activated
- [ ] Agents work in parallel where possible
- [ ] Context shared between agents
- [ ] Integration points validated
- [ ] Complete solution delivered
- [ ] All teams coordinated effectively

## 🔄 Integration Tests

### Test 5: Smart Router
```yaml
Test Cases:
1. Bug report → Routes to rapid_response team
2. Feature request → Routes to product team
3. Performance issue → Routes to engineering team
4. UI problem → Routes to design team
5. Data question → Routes to data_ai team

Verification:
- Check .agent-os/context/sessions/*/state.yml
- Verify correct workflow selected
- Confirm appropriate agents activated
```

### Test 6: State Management
```bash
# Create test session
mkdir -p .agent-os/context/sessions/test-001/
echo "session: test" > .agent-os/context/sessions/test-001/state.yml

# Verify state persistence
cat .agent-os/context/sessions/test-001/state.yml

# Check knowledge base structure
ls .agent-os/knowledge/
# Expected: problems/, solutions/, patterns/, decisions/
```

### Test 7: Multi-Agent Coordination
```yaml
Test Scenario: Parallel Execution
1. Trigger workflow requiring multiple agents
2. Verify agents work simultaneously
3. Check message passing in .agent-os/context/sessions/*/messages/
4. Confirm synchronization points work
5. Validate integrated output
```

### Test 8: Template System
```bash
# Test agent template
cp .agent-os/templates/agents/base.md /tmp/test-agent.md
# Verify template variables present

# Test workflow template
cp .agent-os/templates/workflows/base.md /tmp/test-workflow.md
# Verify workflow structure correct

# Test spec template
cp .agent-os/templates/specs/base.md /tmp/test-spec.md
# Verify spec sections complete
```

## 📊 Performance Tests

### Speed Benchmarks
```yaml
Workflow Performance Targets:
- Router decision: <30 seconds
- Agent activation: <10 seconds
- Context loading: <5 seconds
- Inter-agent message: <2 seconds
- State update: <1 second

Test Method:
1. Time each workflow component
2. Compare to SLA targets
3. Identify bottlenecks
4. Verify parallelization working
```

### Quality Gates
```yaml
Quality Checkpoints:
- User problem validated: Required before building
- Design approved: Required before implementation  
- Tests passing: Required before deployment
- User confirmation: Required for completion

Verification:
- Check decision points in workflows
- Verify gates prevent progression
- Confirm quality standards applied
```

## 🔍 Command Testing

### Basic Commands
```bash
# Test help system
/help
# Expected: Show available commands

# Test validation command
/validate "test problem"
# Expected: Triggers validation workflow

# Test bug fix command
/fix-bug "test bug"
# Expected: Triggers fast-track-bug-fix

# Test MVP command
/build-mvp "test feature"
# Expected: Triggers mvp-builder workflow
```

### Command Modifiers
```bash
# Test urgency modifiers
/fix-bug "critical issue" --urgent
# Expected: High priority execution

# Test quality modifiers
/build-mvp "feature" --mvp
# Expected: Minimal implementation

# Test team modifiers
/team-build "feature" --parallel
# Expected: Parallel team execution
```

## ✅ Acceptance Criteria

### System Ready Checklist
- [ ] All 35+ agents installed and accessible
- [ ] All workflows (rapid, standard, complex) available
- [ ] Smart router correctly routes requests
- [ ] State management preserves context
- [ ] Templates available for customization
- [ ] Commands trigger appropriate workflows
- [ ] Documentation complete and accessible

### Performance Criteria
- [ ] Bug fixes complete in <15 minutes
- [ ] Validation completes in <2 hours
- [ ] MVPs built in <4 hours
- [ ] Complex problems solved in <1 day
- [ ] Parallel execution functioning
- [ ] Context preserved between sessions

### Quality Criteria
- [ ] User problems validated before building
- [ ] Quality gates enforced
- [ ] Standards automatically applied
- [ ] Error handling graceful
- [ ] User feedback incorporated

## 🐛 Troubleshooting

### Common Issues

#### Issue: Workflow Not Found
```bash
# Check workflow exists
ls .agent-os/instructions/**/*.md | grep workflow-name

# Verify config points to correct location
grep instructions config.yml

# Solution: Check workflow name and path
```

#### Issue: Agent Not Activating
```bash
# Check agent file exists
ls ~/.claude/agents/agent-name.md

# Verify agent in team configuration
grep agent-name config.yml

# Solution: Ensure agent properly configured
```

#### Issue: Slow Performance
```bash
# Check parallelization settings
grep parallel config.yml

# Verify no sequential bottlenecks
# Review workflow for parallel opportunities

# Solution: Enable parallel execution
```

#### Issue: State Not Persisting
```bash
# Check state directory exists
ls .agent-os/context/

# Verify write permissions
touch .agent-os/context/test

# Solution: Ensure proper permissions
```

## 📈 Monitoring & Metrics

### Success Metrics to Track
```yaml
Speed Metrics:
- Average bug fix time: Target <15 min
- Average validation time: Target <2 hours
- Average MVP time: Target <4 hours
- Workflow completion rate: Target >95%

Quality Metrics:
- User satisfaction: Target >4.5/5
- Bug rate: Target <3%
- Feature adoption: Target >50%
- Rework rate: Target <20%

Usage Metrics:
- Commands per day
- Most used workflows
- Agent utilization
- Knowledge base growth
```

### Continuous Improvement
```yaml
Weekly Review:
1. Analyze workflow performance
2. Identify bottlenecks
3. Review user feedback
4. Update knowledge base
5. Optimize slow workflows

Monthly Review:
1. Agent effectiveness audit
2. Workflow success rates
3. User satisfaction trends
4. Technology stack review
5. Standards compliance check
```

## 🎯 Validation Scenarios

### Scenario 1: New Feature Development
```bash
# Complete feature cycle test
/validate "user needs export feature"
# Wait for validation...
/build-mvp "csv export functionality"  
# Wait for MVP...
/test "csv export"
# Verify complete cycle works
```

### Scenario 2: Production Issue
```bash
# Emergency response test
/emergency "database connection errors"
/fix-bug "connection pool exhausted"
/test "database connections"
# Verify rapid response works
```

### Scenario 3: Complex Architecture
```bash
# Multi-team coordination test
/ultrathink "migrate to microservices"
# Verify all teams coordinate
# Check parallel execution
# Validate integration points
```

## ✨ Success Indicators

Your Agent OS v2.0 installation is successful when:

1. **Speed Goals Met**
   - Can fix bugs in 15 minutes
   - Can validate problems in 2 hours
   - Can build MVPs in 4 hours

2. **Quality Maintained**
   - User problems validated first
   - Tests pass before deployment
   - Users confirm solutions work

3. **Teams Coordinated**
   - Multiple agents work in parallel
   - Context shared effectively
   - Conflicts resolved automatically

4. **Knowledge Growing**
   - Problems stored and reused
   - Patterns recognized
   - Solutions improve over time

## 🚀 Next Steps

Once testing is complete:

1. **Run Your First Real Task**
   ```bash
   /validate [your actual user problem]
   ```

2. **Customize for Your Needs**
   - Adjust team composition
   - Modify workflow time limits
   - Add custom commands

3. **Build Your Product**
   - Start with problem validation
   - Build MVPs rapidly
   - Iterate based on usage

4. **Share Your Success**
   - Document what works
   - Contribute improvements
   - Help others succeed

---

**Congratulations! Agent OS v2.0 is ready to help you build amazing products!** 🎉
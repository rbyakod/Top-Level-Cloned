---
description: State and user context management system for persistent knowledge
globs:
alwaysApply: true
version: 2.0
encoding: UTF-8
---

# State & User Context Management

## Overview
Maintain persistent state and user context across sessions, enabling continuous learning and improvement.

<state_architecture>

<component name="session_state">

### Session State Management

Temporary state for active work sessions that preserves context during execution.

<session_structure>
```yaml
location: .agent-os/context/sessions/[session_id]/
structure:
  state.yml:              # Current session state
    session:
      id: "uuid"
      started: "timestamp"
      workflow: "workflow_name"
      user: "user_identifier"
      status: "active|completed|failed"
    
    agents:
      active: []
      completed: []
      blocked: []
      
    progress:
      phase: "current_phase"
      percentage: 0-100
      milestones: []
      
  messages/:              # Inter-agent communication
    [timestamp]-[from]-[to].md
    
  outputs/:               # Agent outputs
    [agent]/[output].md
    
  decisions.yml:          # Decisions made during session
    - decision: "what"
      agent: "who"
      rationale: "why"
      timestamp: "when"
```
</session_structure>

<session_lifecycle>
  initialization:
    trigger: "New workflow starts"
    action: "Create session directory and state.yml"
    
  update:
    frequency: "Every agent action"
    action: "Update state.yml and add to messages/"
    
  completion:
    trigger: "Workflow completes"
    action: "Archive to knowledge base"
    
  cleanup:
    after: "7 days"
    action: "Move to archive/"
</session_lifecycle>

</component>

<component name="user_context">

### User Context Tracking

Persistent user-specific context that accumulates over time.

<user_profile>
```yaml
location: .agent-os/context/users/[user_id]/
structure:
  profile.yml:
    user:
      id: "identifier"
      created: "first_interaction"
      last_active: "timestamp"
      
    preferences:
      technology: []      # Preferred tech stack
      style: []          # Code/design preferences
      workflow: []       # Preferred workflows
      
    history:
      problems_reported: []
      features_requested: []
      bugs_fixed: []
      satisfaction_ratings: []
      
  problems/:             # Validated user problems
    [date]-[problem_id].yml:
      problem: "description"
      validation: "how validated"
      solution: "what was built"
      outcome: "success metrics"
      
  feedback/:            # User feedback over time
    [date]-[feature].yml:
      feature: "what"
      feedback: "user comments"
      satisfaction: 1-5
      suggestions: []
```
</user_profile>

<context_accumulation>
  problem_patterns:
    - Track recurring problem types
    - Identify user pain points
    - Suggest proactive solutions
    
  preference_learning:
    - Learn technology preferences
    - Understand UI/UX preferences  
    - Adapt communication style
    
  success_tracking:
    - Measure solution effectiveness
    - Track user satisfaction trends
    - Identify improvement areas
</context_accumulation>

</component>

<component name="knowledge_base">

### Persistent Knowledge Base

Long-term storage of validated problems, successful solutions, and learned patterns.

<knowledge_structure>
```yaml
location: .agent-os/knowledge/
structure:
  problems/:              # Validated problems database
    [category]/
      [problem_id].yml:
        problem: "description"
        frequency: "how often encountered"
        users_affected: []
        solutions: []    # Successful solutions
        patterns: []     # Common patterns
        
  solutions/:            # Successful solution library
    [category]/
      [solution_id].yml:
        problem_solved: "reference"
        approach: "how solved"
        technology: []
        time_to_implement: "duration"
        success_metrics: {}
        reusable_components: []
        
  patterns/:            # Recognized patterns
    technical/:
      [pattern_name].yml:
        description: "what pattern"
        when_to_use: []
        implementation: "how"
        examples: []
        
    user_behavior/:
      [pattern_name].yml:
        behavior: "what users do"
        trigger: "when they do it"
        response: "how to handle"
        
  decisions/:           # Technical and product decisions
    [date]-[decision].yml:
      context: "why decided"
      options: []
      chosen: "what"
      rationale: "reasoning"
      outcome: "result"
      lessons: "what learned"
```
</knowledge_structure>

<knowledge_operations>
  retrieval:
    - Search by problem similarity
    - Find successful solutions
    - Identify applicable patterns
    
  learning:
    - Extract patterns from sessions
    - Update success metrics
    - Refine solution approaches
    
  application:
    - Suggest solutions for new problems
    - Apply proven patterns
    - Avoid past mistakes
</knowledge_operations>

</component>

<component name="workflow_memory">

### Workflow Execution Memory

Track workflow performance and optimize over time.

<workflow_tracking>
```yaml
location: .agent-os/context/workflows/
structure:
  metrics/:
    [workflow_name].yml:
      executions: []
        - session_id: "reference"
          duration: "actual_time"
          sla_met: true/false
          success: true/false
          user_satisfaction: 1-5
          
      average_duration: "computed"
      success_rate: "percentage"
      common_blockers: []
      optimization_opportunities: []
      
  optimizations/:
    [workflow_name]-[version].yml:
      changes: []
      rationale: "why optimized"
      results: "improvement metrics"
```
</workflow_tracking>

</component>

</state_architecture>

## State Operations

### Create State
```typescript
interface CreateState {
  session: {
    workflow: string;
    user: string;
    context: any;
  };
  
  initialize: () => {
    createDirectory(`.agent-os/context/sessions/${sessionId}/`);
    writeFile('state.yml', initialState);
    loadUserContext(userId);
    loadRelevantKnowledge(workflow);
  };
}
```

### Update State
```typescript
interface UpdateState {
  session: string;
  update: {
    agent?: string;
    progress?: number;
    output?: any;
    decision?: Decision;
  };
  
  apply: () => {
    const currentState = readState(sessionId);
    const newState = mergeUpdates(currentState, update);
    writeState(sessionId, newState);
    broadcastUpdate(subscribedAgents);
  };
}
```

### Query State
```typescript
interface QueryState {
  filters: {
    user?: string;
    workflow?: string;
    problem?: string;
    dateRange?: DateRange;
  };
  
  find: () => {
    searchKnowledge(filters);
    rankByRelevance();
    returnTopResults();
  };
}
```

## Context Preservation Strategies

### Short-term Context (Session)
```yaml
preserved_during_session:
  - User problem statement
  - Workflow decisions
  - Agent outputs
  - Integration points
  - Test results
  - User feedback

retention: "Until session complete + 7 days"
format: "YAML + Markdown"
access: "All agents in session"
```

### Medium-term Context (User)
```yaml
preserved_per_user:
  - Problem history
  - Solution preferences
  - Technology choices
  - Satisfaction ratings
  - Feature requests

retention: "90 days active, indefinite archived"
format: "Structured YAML"
access: "User-specific workflows"
```

### Long-term Context (Knowledge)
```yaml
preserved_permanently:
  - Validated problems
  - Successful solutions
  - Learned patterns
  - Best practices
  - Architecture decisions

retention: "Indefinite"
format: "Categorized knowledge base"
access: "All workflows and agents"
```

## Context Application

### Problem Recognition
```yaml
when_user_reports_problem:
  search_knowledge:
    - Similar problems previously solved
    - Patterns that match
    - Successful approaches
    
  if_match_found:
    suggest: "Previous solution"
    adapt: "To current context"
    validate: "Still solves problem"
    
  if_no_match:
    validate: "New problem"
    solve: "Create new solution"
    store: "Add to knowledge base"
```

### Solution Optimization
```yaml
when_implementing_solution:
  check_patterns:
    - Technical patterns that apply
    - User behavior patterns
    - Success patterns from history
    
  apply_learning:
    - Use proven approaches
    - Avoid known pitfalls
    - Optimize based on metrics
    
  measure_success:
    - Track implementation time
    - Monitor user satisfaction
    - Compare to predictions
```

### Continuous Improvement
```yaml
after_each_session:
  extract_insights:
    - What worked well
    - What was challenging
    - User feedback received
    
  update_knowledge:
    - Add new patterns
    - Refine existing solutions
    - Update success metrics
    
  optimize_workflows:
    - Identify bottlenecks
    - Suggest improvements
    - Update time estimates
```

## Privacy & Security

### Data Protection
```yaml
user_data:
  anonymization: "Remove PII from knowledge base"
  encryption: "Encrypt sensitive context"
  access_control: "User-specific data isolated"
  retention: "Follow data retention policy"
  
technical_data:
  sanitization: "Remove secrets/credentials"
  generalization: "Abstract specific implementations"
  sharing: "Only non-sensitive patterns"
```

### Access Control
```yaml
permissions:
  session_state:
    read: "All agents in session"
    write: "Active agent only"
    
  user_context:
    read: "User's sessions only"
    write: "With user consent"
    
  knowledge_base:
    read: "All agents"
    write: "After validation"
```

## State Queries

### Find Similar Problems
```yaml
query: find_similar_problems
input:
  problem_description: "User can't export data"
  user_context: "optional user_id"
  
process:
  - Tokenize problem description
  - Search knowledge base
  - Rank by similarity score
  - Filter by recency and success
  
output:
  - matched_problems: []
  - successful_solutions: []
  - estimated_time: "based on history"
```

### Get User Preferences
```yaml
query: get_user_preferences
input:
  user_id: "identifier"
  preference_type: "technology|style|workflow"
  
process:
  - Load user profile
  - Aggregate historical choices
  - Weight by recency and frequency
  
output:
  preferences: []
  confidence: "0-100%"
  last_updated: "timestamp"
```

### Predict Implementation Time
```yaml
query: predict_implementation_time
input:
  workflow: "workflow_name"
  complexity: "simple|medium|complex"
  
process:
  - Get historical executions
  - Filter by complexity
  - Calculate statistics
  
output:
  estimated_time: "duration"
  confidence_interval: "range"
  based_on: "n executions"
```

## Performance Optimization

### Caching Strategy
```yaml
cache_layers:
  hot_cache:
    content: "Active session state"
    location: "Memory"
    ttl: "Session duration"
    
  warm_cache:
    content: "Recent user contexts"
    location: "Local filesystem"
    ttl: "24 hours"
    
  cold_storage:
    content: "Historical knowledge"
    location: "Indexed database"
    ttl: "Indefinite"
```

### Query Optimization
```yaml
indexing:
  problems: "Full-text search index"
  solutions: "Category and tag index"
  patterns: "Pattern type index"
  decisions: "Date and context index"
  
search_optimization:
  - Pre-compile common queries
  - Cache frequent searches
  - Lazy load detailed content
  - Paginate large results
```

## Integration with Workflows

### Workflow Initialization
```yaml
on_workflow_start:
  - Create session state
  - Load user context
  - Search relevant knowledge
  - Prepare agent contexts
  - Set up monitoring
```

### Workflow Execution
```yaml
during_workflow:
  - Track agent progress
  - Capture decisions
  - Store outputs
  - Update user context
  - Monitor performance
```

### Workflow Completion
```yaml
on_workflow_complete:
  - Finalize session state
  - Update knowledge base
  - Calculate metrics
  - Archive session
  - Trigger learning pipeline
```

## Success Metrics

### State Management Effectiveness
- **Context Retrieval Speed**: <500ms for relevant context
- **Knowledge Application Rate**: >60% of sessions use past knowledge
- **Pattern Recognition**: >80% accuracy in problem matching
- **User Preference Accuracy**: >90% correct preference prediction

### Learning Effectiveness
- **Knowledge Growth**: Continuous expansion of knowledge base
- **Solution Improvement**: Decreasing time to solution over time
- **Pattern Extraction**: New patterns identified weekly
- **Mistake Avoidance**: <10% repeat of past failures

## References
- Integrates with @.agent-os/instructions/meta/orchestrator.md
- Supports @.agent-os/instructions/meta/smart-router.md
- Follows @.agent-os/standards/user-centric-principles.md
- Enables @.agent-os/config.yml state_management settings
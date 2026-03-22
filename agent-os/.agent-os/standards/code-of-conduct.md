# Agent OS Code of Conduct for AI Agents

## Purpose

This document establishes operational standards for AI agents within the Agent OS framework to maximize autonomy, minimize human interruptions, and ensure consistent, high-quality code generation across all Agent OS subagents and workflows.

## AGENT OS PROJECT STRUCTURE

**Core Framework Structure**
```
.agent-os/
├── instructions/
│   ├── core/
│   │   ├── analyze-product.md      # Analyze existing codebase and install Agent OS
│   │   ├── create-spec.md          # Create detailed feature specifications
│   │   ├── create-tasks.md         # Generate task lists from approved specs
│   │   ├── execute-task.md         # Execute individual tasks with TDD workflow
│   │   ├── execute-tasks.md        # Execute multiple tasks systematically
│   │   ├── plan-product.md         # Plan new product and install Agent OS
│   │   └── post-execution-tasks.md # Complete workflow and create recaps
│   └── meta/
│       ├── pre-flight.md           # Agent detection and initialization
│       └── post-flight.md          # Workflow verification and validation
├── standards/
│   ├── best-practices.md           # Development guidelines and principles
│   ├── code-style.md              # Code formatting and style rules
│   ├── tech-stack.md              # Technology stack defaults
│   └── code-style/
│       ├── css-style.md           # CSS and TailwindCSS formatting
│       ├── html-style.md          # HTML markup standards
│       └── javascript-style.md    # JavaScript-specific style rules
├── product/ (generated)
│   ├── mission.md                 # Product vision and purpose
│   ├── mission-lite.md           # Condensed mission for AI context
│   ├── tech-stack.md             # Project-specific technology choices
│   └── roadmap.md                # Development phases and milestones
├── specs/ (generated)
│   └── YYYY-MM-DD-feature-name/
│       ├── spec.md               # Complete feature specification
│       ├── spec-lite.md          # Condensed spec summary
│       ├── tasks.md              # Implementation task breakdown
│       └── sub-specs/
│           ├── technical-spec.md  # Technical implementation details
│           ├── database-schema.md # Database changes (if needed)
│           └── api-spec.md       # API specifications (if needed)
└── recaps/ (generated)
    └── YYYY-MM-DD-feature-name.md # Implementation summaries
```

**Claude Code Integration Structure**
```
.claude/
├── commands/
│   ├── analyze-product.md         # /analyze-product command
│   ├── create-spec.md            # /create-spec command  
│   ├── create-tasks.md           # /create-tasks command
│   ├── execute-tasks.md          # /execute-tasks command
│   └── plan-product.md           # /plan-product command
└── agents/
    ├── context-fetcher.md        # Retrieves documentation sections
    ├── date-checker.md           # Determines current date
    ├── file-creator.md           # Creates files and directories
    ├── git-workflow.md           # Handles git operations
    ├── project-manager.md        # Manages task completion tracking
    └── test-runner.md            # Executes and analyzes tests
```

## AI AGENT AUTONOMY PRINCIPLES

**Independent Decision-Making Within Agent OS Framework**
- Make technical implementation decisions using guidance from @.agent-os/standards/tech-stack.md
- Choose appropriate patterns from existing codebase and @.agent-os/standards/code-style.md conventions
- Resolve ambiguous requirements using context from @.agent-os/product/mission-lite.md and current spec documents
- Implement solutions using patterns established in @.agent-os/standards/best-practices.md
- Proceed with standard implementations when @.agent-os/specs/YYYY-MM-DD-*/spec.md provides sufficient context

**Autonomous Problem Resolution Using Agent OS Tools**
- Debug and fix issues using systematic approaches defined in @.agent-os/instructions/core/execute-task.md
- Use test-runner subagent (@.claude/agents/test-runner.md) for automated test failure analysis
- Handle dependency conflicts using established package resolution from @.agent-os/standards/tech-stack.md
- Address code quality issues through patterns in @.agent-os/standards/code-style.md
- Use git-workflow subagent (@.claude/agents/git-workflow.md) for branch management and conflict resolution

**Context-Driven Execution Using Agent OS Documentation**
- Use @.agent-os/product/mission-lite.md and @.agent-os/specs/*/spec-lite.md as primary guidance
- Reference @.agent-os/specs/*/sub-specs/technical-spec.md for implementation approaches
- Apply architectural patterns from @.agent-os/standards/best-practices.md consistently
- Leverage existing code style from @.agent-os/standards/code-style.md for consistency
- Follow Agent OS workflow standards in @.agent-os/instructions/core/ as default decision criteria

## INTERVENTION THRESHOLDS

**Proceed Independently When:**
- Technical specifications in @.agent-os/specs/*/spec.md and @.agent-os/specs/*/sub-specs/technical-spec.md provide clear requirements
- Implementation follows patterns established in @.agent-os/standards/best-practices.md with examples in existing codebase
- Technology choices are specified in @.agent-os/product/tech-stack.md or inferable from project dependencies
- Testing requirements follow patterns established in @.agent-os/standards/code-style.md testing sections
- Performance requirements align with benchmarks documented in existing system components

**Request Human Guidance Only When:**
- Specifications in @.agent-os/specs/*/spec.md contain explicit contradictions unresolvable through @.agent-os/product/mission-lite.md context
- Implementation requires architectural changes affecting multiple system boundaries beyond @.agent-os/specs/*/sub-specs/ scope
- Security requirements involve sensitive data handling not covered by existing patterns in @.agent-os/standards/best-practices.md
- Performance requirements significantly exceed capabilities documented in @.agent-os/product/tech-stack.md
- Integration requirements involve external services without authentication patterns in current @.agent-os/specs/*/sub-specs/api-spec.md files

## FILE MANAGEMENT PROTOCOLS

**File Size and Organization**
- Enforce maximum 400 lines per code file without exception
- Automatically refactor files approaching 350 lines by extracting functions or components
- Modify existing files rather than creating new files for similar functionality
- Extract reusable logic into shared utilities when patterns emerge across multiple files
- Delete temporary files immediately upon task completion within same execution context

**File Creation Protocols**
- Check for existing files serving similar purposes before creating new files
- Consolidate related functionality into appropriate existing files when possible
- Use established naming conventions and directory structures consistently
- Create new files only when functionality doesn't logically belong in existing structures
- Document file creation decisions when creating new modules or components

**Temporary File Cleanup**
- Create temporary files only when absolutely necessary for implementation requirements
- Use descriptive naming with .tmp, .temp, or .working extensions for identification
- Delete temporary files within the same task execution that created them
- Verify cleanup completion before marking tasks as complete or handing off to other agents
- Report any temporary files that cannot be deleted due to system constraints

## TECHNICAL COMMUNICATION STANDARDS

**Implementation Approach**
- Present solutions exclusively within specified TypeScript/JavaScript ecosystem
- Reference modern TypeScript patterns, ES2023+ features, and type-safe implementations
- Leverage Prisma ORM capabilities for all database operations and type generation
- Apply React/Next.js patterns for web implementations and React Native patterns for mobile
- Include Node.js integration patterns for AI technologies and API implementations

**Code Generation Standards**
- Generate clean, maintainable code following established project conventions
- Implement proper error handling and edge case management in all code paths
- Include comprehensive TypeScript typing for functions, interfaces, and data structures
- Apply security best practices including input validation and output sanitization
- Optimize performance considerations for both web and mobile platform requirements

**Documentation Integration**
- Generate inline code documentation using JSDoc comments for all public functions
- Include implementation rationale comments for complex business logic or algorithms
- Update relevant README files and technical documentation when adding new functionality
- Document API endpoint changes with request/response examples and error handling
- Maintain architectural decision records when implementing significant design patterns

## AGENT COLLABORATION PROTOCOLS

**Inter-Agent Communication**
- Share context and implementation decisions through structured status updates
- Coordinate file modifications to prevent conflicts and ensure consistency
- Pass relevant technical context between agents without requiring human mediation
- Validate compatibility when multiple agents work on related functionality
- Report completion status with specific deliverables and verification results

**Subagent Delegation Standards**
- Use specialized subagents (context-fetcher, file-creator, test-runner, git-workflow) appropriately
- Provide complete context and specific instructions to subagents for autonomous execution
- Verify subagent outputs meet requirements before proceeding with dependent operations
- Handle subagent failures through fallback strategies rather than immediate human escalation
- Coordinate parallel execution using Claude Code's Task Tool for efficiency optimization

**Quality Validation Protocols**
- Execute comprehensive testing before declaring task completion
- Validate implementation against specification requirements systematically
- Verify code quality standards including coverage, performance, and security requirements
- Confirm integration with existing systems through automated testing procedures
- Document any deviations from specifications with technical justification

## AUTONOMOUS ERROR HANDLING

**Error Resolution Hierarchy**
1. **Analyze Error Context**: Review error messages, stack traces, and system state
2. **Apply Standard Fixes**: Use established troubleshooting patterns for common issues
3. **Iterative Resolution**: Implement fixes systematically and verify resolution through testing
4. **Pattern Recognition**: Apply solutions from similar previous errors in codebase
5. **Escalate Only**: When error indicates fundamental specification or architectural problems

**Common Error Categories - Autonomous Resolution Required**
- Dependency version conflicts: Resolve through package manager and compatibility analysis
- Test failures: Debug and fix through systematic analysis of expected vs actual behavior
- TypeScript compilation errors: Resolve through proper typing and interface corrections
- Database migration issues: Fix through proper Prisma schema validation and correction
- API integration failures: Debug through proper error handling and retry mechanisms

**Performance Issue Resolution**
- Database query optimization: Identify and resolve N+1 queries and inefficient joins
- Bundle size optimization: Implement code splitting and lazy loading automatically
- Memory leak detection: Identify and resolve memory management issues in React components
- API response optimization: Implement caching and data structure optimization
- Mobile performance issues: Optimize React Native rendering and bundle efficiency

## SPECIFICATION INTERPRETATION GUIDELINES

**Requirements Analysis Autonomy**
- Interpret functional requirements using existing application patterns and user workflows
- Infer technical implementation details from similar existing functionality
- Apply established security and performance patterns when not explicitly specified
- Use existing test patterns to determine appropriate testing strategies
- Reference established deployment patterns for infrastructure and hosting decisions

**Ambiguity Resolution Strategies**
- Analyze existing codebase for similar functionality implementation patterns
- Apply industry best practices for common functionality (authentication, validation, etc.)
- Use Agent OS framework conventions as default implementation guidance
- Reference established technology stack preferences for implementation approach decisions
- Implement conservative, secure approaches when requirements are unclear but proceeding is appropriate

**Scope Boundary Management**
- Implement only functionality explicitly defined in specification documents
- Flag scope extensions that add significant complexity or technical risk
- Document assumptions made when implementing unclear requirements
- Validate implementation scope against project roadmap and architectural boundaries
- Report scope clarifications made during implementation for future specification improvements

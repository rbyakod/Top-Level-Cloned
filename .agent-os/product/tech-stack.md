# Technical Stack

## Application Framework
- **Core Framework:** Agent OS v2.0 (YAML-based configuration system)
- **Version:** 2.0
- **Architecture:** Multi-agent orchestration framework with file-based state management

## Database System
- **Configuration Storage:** File-based YAML/Markdown (version-controlled)
- **Context Database:** Local file system with structured markdown
- **State Management:** Persistent agent memory via markdown files
- **Backup Strategy:** Git version control

## AI Agent Framework
- **Primary Agent Platform:** Claude Code subagents
- **Agent Configuration:** YAML-based agent definitions
- **Orchestration System:** Smart router with task delegation
- **Communication Protocol:** Markdown-based inter-agent communication

## Configuration Management
- **Configuration Format:** YAML (.yml files)
- **Workflow Definitions:** Markdown (.md files)
- **Agent Templates:** Structured YAML + Markdown combinations
- **Settings Management:** Hierarchical configuration inheritance

## User Interface
- **Primary Interface:** Command-line interface (CLI)
- **Rapid Commands:** Built-in shortcuts (rapid-validate, ultrathink, fast-fix, ship-mvp)
- **Agent Communication:** Natural language prompts via markdown
- **Status Display:** Real-time task progress and agent coordination

## File System Architecture
- **Project Structure:** .agent-os/ directory convention
- **Agent Definitions:** /agents/ directory with YAML configurations
- **Workflow Storage:** /workflows/ directory with markdown processes  
- **Context Preservation:** /context/ directory with conversation history
- **State Management:** /state/ directory with persistent agent memory

## Development Integration
- **Code Repository:** Git integration for all configurations and context
- **IDE Integration:** Works with Claude Code, Cursor, and other AI-augmented editors
- **Version Control:** Full versioning of agent configurations and decision history
- **Deployment:** File-based deployment with configuration copying

## Agent Team Structure
- **Product Team:** 8 agents (Product Manager, UX Researcher, Business Analyst, etc.)
- **Engineering Team:** 12 agents (Backend, Frontend, DevOps, Security, etc.)
- **Design Team:** 5 agents (UI/UX Designer, Visual Designer, Interaction Designer, etc.)
- **Quality Team:** 4 agents (QA Engineer, Test Automation, Performance Tester, etc.)
- **Data/AI Team:** 3 agents (Data Scientist, ML Engineer, AI Researcher)
- **Growth Team:** 3 agents (Marketing Analyst, SEO Specialist, Growth Hacker)
- **Rapid Response Team:** 2 agents (Emergency Fixer, Critical Issue Responder)

## Hosting and Infrastructure
- **Application Hosting:** Local development environment with cloud deployment options
- **Configuration Hosting:** Git repositories (GitHub, GitLab, etc.)
- **Agent Runtime:** Local execution with Claude Code integration
- **Context Storage:** Local file system with cloud backup options

## Workflow Automation
- **Task Orchestration:** YAML-defined workflow chains
- **Agent Coordination:** Smart routing based on task requirements
- **Quality Gates:** Automated validation checkpoints
- **Progress Tracking:** Markdown-based status updates and logging

## Integration Capabilities
- **External APIs:** RESTful API integration through specialized agents
- **Development Tools:** Integration with existing development workflows
- **CI/CD Integration:** Git hooks and automated deployment triggers
- **Third-party Services:** Extensible plugin architecture for external services

## Performance and Scalability
- **Agent Scaling:** Parallel agent execution for non-conflicting tasks
- **Context Management:** Efficient file-based state persistence
- **Memory Optimization:** Intelligent context pruning and archival
- **Response Time:** Sub-second command execution for rapid commands

## Security and Compliance
- **Configuration Security:** File-based permissions and access control
- **Context Privacy:** Local storage with encryption options
- **Agent Isolation:** Sandboxed agent execution environments
- **Audit Trail:** Complete decision and action logging in version control

## Development Environment Requirements
- **Minimum Requirements:** Claude Code or compatible AI-augmented IDE
- **Recommended Tools:** Git, YAML editor, Markdown editor
- **Optional Integrations:** Docker for containerized agent execution
- **Platform Support:** Cross-platform (Windows, macOS, Linux)

## Technical Standards
- **Configuration Style:** YAML with consistent indentation and structure
- **Markdown Standards:** CommonMark specification with custom extensions
- **File Organization:** Hierarchical directory structure with clear naming conventions
- **Version Control:** Semantic versioning for agent configurations and workflows
- **Documentation:** Self-documenting YAML and inline markdown comments
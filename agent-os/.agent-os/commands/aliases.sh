#!/bin/bash

# Agent OS Command Aliases
# Source this file to enable Agent OS command shortcuts
# Usage: source .agent-os/commands/aliases.sh

# =============================================================================
# CORE WORKFLOW ALIASES
# =============================================================================

# Speed workflow aliases
alias aos-validate='echo "🔍 Validating user problem..." && /validate'
alias aos-fix='echo "🔧 Starting rapid bug fix..." && /fix-bug'
alias aos-mvp='echo "🚀 Building MVP..." && /build-mvp'
alias aos-ship='echo "📦 Shipping feature today..." && /ship-today'

# Short aliases for common commands
alias v='/validate'
alias fb='/fix-bug'
alias mvp='/build-mvp'
alias ship='/ship-today'

# =============================================================================
# AGENT OS SPECIFIC ALIASES
# =============================================================================

# System management
alias aos-health='echo "🏥 Checking Agent OS system health..." && /health-check'
alias aos-test='echo "🧪 Testing all agents and workflows..." && /test-agents && /validate-workflows'
alias aos-sync='echo "🔄 Syncing knowledge base..." && /sync-knowledge'
alias aos-optimize='echo "⚡ Optimizing system performance..." && /optimize-routing'

# Agent management
alias aos-agents='ls -la ~/.claude/agents/ | grep -E "\.md$" | wc -l && echo "agents available"'
alias aos-list='ls ~/.claude/agents/*.md | sed "s/.*\///" | sed "s/\.md$//"'
alias aos-update='echo "📥 Updating all agents..." && /update-agents'

# Knowledge management  
alias aos-learn='echo "🧠 Capturing knowledge..." && /sync-knowledge'
alias aos-export='echo "📤 Exporting knowledge base..." && /export-knowledge'
alias aos-patterns='ls .agent-os/knowledge/patterns/*.yml | wc -l && echo "patterns documented"'

# =============================================================================
# DEVELOPMENT WORKFLOW ALIASES
# =============================================================================

# Quick development cycles
alias dev-quick='echo "🏎️ Quick development cycle..." && /validate --quick && /build-mvp --today'
alias dev-full='echo "🔄 Full development cycle..." && /spec && /execute && /test --production'
alias dev-test='echo "🧪 Development testing..." && npm test && /test-agents'

# Daily operations
alias daily='echo "☀️ Daily Agent OS operations..." && /health-check && /sync-knowledge && /usage-metrics'
alias morning='echo "🌅 Morning setup..." && /health-check && git status && npm run test:simple'
alias evening='echo "🌙 Evening wrap-up..." && /sync-knowledge && /performance-report'

# =============================================================================
# EMERGENCY RESPONSE ALIASES
# =============================================================================

# Critical issues
alias crisis='echo "🚨 CRISIS MODE ACTIVATED" && /emergency system-critical'
alias hotfix='echo "🔥 Emergency hotfix..." && /fix-bug --urgent --production'
alias rollback='echo "⏪ Emergency rollback..." && /rollback'
alias incident='echo "🚨 Starting incident response..." && /incident'

# System recovery
alias aos-restore='echo "🔄 Restoring Agent OS..." && /export-knowledge --backup && git checkout HEAD~1'
alias aos-reset='echo "♻️ Resetting system state..." && /cleanup-session && /health-check'

# =============================================================================
# PRODUCTIVITY ALIASES  
# =============================================================================

# Session management
alias start-aos='echo "🎬 Starting Agent OS session..." && /setup-session && /health-check'
alias end-aos='echo "🎬 Ending Agent OS session..." && /document-session && /sync-knowledge'

# Workflow combinations
alias research-build='/research && /validate && /build-mvp'
alias spec-execute='/spec && /execute && /test'
alias validate-ship='/validate && /build-mvp && /test && /ship-today'

# =============================================================================
# ANALYSIS AND REPORTING ALIASES
# =============================================================================

# Performance analysis
alias perf='echo "📊 Performance analysis..." && /performance-report'
alias metrics='echo "📈 Usage metrics..." && /usage-metrics'
alias benchmark='echo "⏱️ Running benchmarks..." && /benchmark-performance'

# System status
alias status='echo "📋 Agent OS Status Report:" && /health-check && aos-agents && git status'
alias summary='echo "📄 Daily summary..." && /usage-metrics --today && /performance-report --today'

# =============================================================================
# UTILITY ALIASES
# =============================================================================

# File navigation
alias cd-aos='cd /Users/rezarezvani/projects/agent-os'
alias cd-agents='cd ~/.claude/agents'
alias cd-knowledge='cd .agent-os/knowledge'
alias cd-workflows='cd .agent-os/instructions/enhanced'

# Quick file access
alias config-aos='cat .agent-os/config.yml'
alias agents-list='ls ~/.claude/agents/*.md | head -10'
alias knowledge-stats='echo "Problems: $(ls .agent-os/knowledge/problems/*.yml 2>/dev/null | wc -l)" && echo "Solutions: $(ls .agent-os/knowledge/solutions/*.yml 2>/dev/null | wc -l)" && echo "Patterns: $(ls .agent-os/knowledge/patterns/*.yml 2>/dev/null | wc -l)"'

# =============================================================================
# HELP AND DOCUMENTATION ALIASES
# =============================================================================

# Help commands
alias aos-help='echo "🤖 Agent OS Commands:" && cat .agent-os/commands/rapid-commands.md | grep "^###" | head -20'
alias aos-docs='echo "📚 Opening Agent OS documentation..." && open README-v2.md'
alias aos-examples='echo "💡 Command examples:" && grep -A 2 "Example:" .agent-os/commands/rapid-commands.md | head -20'

# =============================================================================
# CUSTOM PROJECT ALIASES
# =============================================================================

# Project-specific shortcuts (customize for your needs)
alias my-stack='echo "🛠️ My preferred stack: Next.js + PostgreSQL + Prisma"'
alias deploy-staging='echo "🚀 Deploying to staging..." && npm run build && npm run deploy:staging'
alias deploy-prod='echo "🚀 Deploying to production..." && npm run build && npm run deploy:production'

# Testing shortcuts
alias test-all='npm test && /test-agents && /validate-workflows'
alias test-quick='npm run test:simple && /health-check'
alias test-integration='npm run test:integration && /benchmark-performance'

# =============================================================================
# FUNCTION DEFINITIONS
# =============================================================================

# Create new session with context
aos-session() {
    if [ -z "$1" ]; then
        echo "Usage: aos-session [session-name] [objective]"
        echo "Example: aos-session feature-development 'Build user dashboard'"
        return 1
    fi
    
    local session_name="$1"
    local objective="${2:-Development work}"
    
    echo "🎬 Creating Agent OS session: $session_name"
    .agent-os/context/scripts/create-session.sh "$(whoami)" "agent-os-v2" "$objective"
    echo "✅ Session created successfully"
}

# Resume existing session
aos-resume() {
    if [ -z "$1" ]; then
        echo "Available sessions:"
        ls .agent-os/context/sessions/*.yml 2>/dev/null | sed 's/.*\///' | sed 's/\.yml$//' | grep -v template | head -10
        return 1
    fi
    
    echo "🔄 Resuming Agent OS session: $1"
    .agent-os/context/scripts/resume-session.sh "$1"
}

# Quick workflow execution
aos-workflow() {
    if [ -z "$1" ]; then
        echo "Available workflows:"
        echo "  fix-bug [description] - 15 minute bug fix"
        echo "  validate [problem] - 2 hour problem validation"
        echo "  build-mvp [feature] - 4 hour MVP build"
        echo "  ultrathink [complex-problem] - 1 day solution"
        return 1
    fi
    
    local workflow="$1"
    shift
    local description="$@"
    
    echo "🚀 Executing workflow: $workflow"
    echo "Description: $description"
    
    case "$workflow" in
        "fix-bug"|"fb")
            /fix-bug "$description"
            ;;
        "validate"|"v")
            /validate "$description"
            ;;
        "build-mvp"|"mvp")
            /build-mvp "$description"
            ;;
        "ultrathink"|"ut")
            /ultrathink "$description"
            ;;
        *)
            echo "Unknown workflow: $workflow"
            return 1
            ;;
    esac
}

# =============================================================================
# INITIALIZATION
# =============================================================================

# Set up Agent OS environment
aos-init() {
    echo "🤖 Initializing Agent OS environment..."
    
    # Check if we're in the right directory
    if [ ! -f ".agent-os/config.yml" ]; then
        echo "❌ Not in Agent OS project directory"
        echo "Please run from the Agent OS project root"
        return 1
    fi
    
    # Check system health
    echo "🏥 Checking system health..."
    /health-check
    
    # Show current status
    echo "📊 Current status:"
    aos-agents
    knowledge-stats
    
    echo "✅ Agent OS environment ready!"
    echo "💡 Try: aos-help for available commands"
}

# Export functions so they're available in subshells
export -f aos-session
export -f aos-resume  
export -f aos-workflow
export -f aos-init

# =============================================================================
# WELCOME MESSAGE
# =============================================================================

echo "🤖 Agent OS v2.0 aliases loaded!"
echo "💡 Type 'aos-help' for available commands"
echo "🎬 Type 'aos-init' to initialize the environment"
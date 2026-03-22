#!/bin/bash

# Agent OS Production Health Check Script
# Comprehensive system health monitoring for Agent OS v2.0

set -e

# Configuration
HEALTH_CHECK_LOG=".agent-os/monitoring/logs/health-check.log"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
HEALTH_SCORE=100

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log_health() {
    echo "[$TIMESTAMP] $1" >> "$HEALTH_CHECK_LOG"
    echo -e "$1"
}

# Health check functions
check_component() {
    local component="$1"
    local status="$2"
    local details="$3"
    
    if [ "$status" = "OK" ]; then
        log_health "${GREEN}✅ $component: $details${NC}"
    elif [ "$status" = "WARNING" ]; then
        log_health "${YELLOW}⚠️  $component: $details${NC}"
        HEALTH_SCORE=$((HEALTH_SCORE - 10))
    else
        log_health "${RED}❌ $component: $details${NC}"
        HEALTH_SCORE=$((HEALTH_SCORE - 25))
    fi
}

echo ""
log_health "${BLUE}🏥 Agent OS v2.0 Health Check${NC}"
log_health "${BLUE}================================${NC}"
log_health "Timestamp: $TIMESTAMP"
echo ""

# =============================================================================
# 1. AGENT SYSTEM CHECK
# =============================================================================

log_health "${BLUE}🤖 Checking Agent System...${NC}"

# Check agent availability
if [ -d "$HOME/.claude/agents" ]; then
    AGENT_COUNT=$(ls "$HOME/.claude/agents"/*.md 2>/dev/null | wc -l | tr -d ' ')
    if [ "$AGENT_COUNT" -ge 35 ]; then
        check_component "Agent Count" "OK" "$AGENT_COUNT agents available (target: 35+)"
    elif [ "$AGENT_COUNT" -ge 20 ]; then
        check_component "Agent Count" "WARNING" "$AGENT_COUNT agents available (target: 35+)"
    else
        check_component "Agent Count" "CRITICAL" "Only $AGENT_COUNT agents available (target: 35+)"
    fi
else
    check_component "Agent Directory" "CRITICAL" "Agent directory not found"
fi

# Check agent file integrity
CORRUPTED_AGENTS=0
if [ -d "$HOME/.claude/agents" ]; then
    for agent in "$HOME/.claude/agents"/*.md; do
        if [ -f "$agent" ]; then
            if ! grep -q "# .* Agent" "$agent" 2>/dev/null; then
                CORRUPTED_AGENTS=$((CORRUPTED_AGENTS + 1))
            fi
        fi
    done
fi

if [ "$CORRUPTED_AGENTS" -eq 0 ]; then
    check_component "Agent Integrity" "OK" "All agent files properly formatted"
elif [ "$CORRUPTED_AGENTS" -le 3 ]; then
    check_component "Agent Integrity" "WARNING" "$CORRUPTED_AGENTS agents may be corrupted"
else
    check_component "Agent Integrity" "CRITICAL" "$CORRUPTED_AGENTS agents corrupted"
fi

# =============================================================================
# 2. WORKFLOW SYSTEM CHECK
# =============================================================================

log_health "${BLUE}⚡ Checking Workflow System...${NC}"

# Check workflow files
WORKFLOW_DIR=".agent-os/instructions/enhanced"
if [ -d "$WORKFLOW_DIR" ]; then
    WORKFLOW_COUNT=$(ls "$WORKFLOW_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
    if [ "$WORKFLOW_COUNT" -ge 4 ]; then
        check_component "Workflow Files" "OK" "$WORKFLOW_COUNT workflows available"
    else
        check_component "Workflow Files" "WARNING" "Only $WORKFLOW_COUNT workflows found"
    fi
else
    check_component "Workflow Directory" "CRITICAL" "Workflow directory not found"
fi

# Check workflow configuration
CONFIG_FILE=".agent-os/config.yml"
if [ -f "$CONFIG_FILE" ]; then
    if grep -q "agent_os_version.*2.0" "$CONFIG_FILE"; then
        check_component "Configuration" "OK" "Agent OS v2.0 configuration detected"
    else
        check_component "Configuration" "WARNING" "Configuration may be outdated"
    fi
else
    check_component "Configuration" "CRITICAL" "Configuration file not found"
fi

# =============================================================================
# 3. KNOWLEDGE BASE CHECK
# =============================================================================

log_health "${BLUE}🧠 Checking Knowledge Base...${NC}"

# Check knowledge base structure
KB_DIR=".agent-os/knowledge"
if [ -d "$KB_DIR" ]; then
    PROBLEMS=$(ls "$KB_DIR/problems"/*.yml 2>/dev/null | wc -l | tr -d ' ')
    SOLUTIONS=$(ls "$KB_DIR/solutions"/*.yml 2>/dev/null | wc -l | tr -d ' ')
    PATTERNS=$(ls "$KB_DIR/patterns"/*.yml 2>/dev/null | wc -l | tr -d ' ')
    DECISIONS=$(ls "$KB_DIR/decisions"/*.yml 2>/dev/null | wc -l | tr -d ' ')
    
    TOTAL_KB=$((PROBLEMS + SOLUTIONS + PATTERNS + DECISIONS))
    
    if [ "$TOTAL_KB" -gt 0 ]; then
        check_component "Knowledge Base" "OK" "$PROBLEMS problems, $SOLUTIONS solutions, $PATTERNS patterns, $DECISIONS decisions"
    else
        check_component "Knowledge Base" "WARNING" "Knowledge base is empty - no learning data"
    fi
else
    check_component "Knowledge Base" "WARNING" "Knowledge base directory not found"
fi

# =============================================================================
# 4. CONTEXT MANAGEMENT CHECK
# =============================================================================

log_health "${BLUE}📝 Checking Context Management...${NC}"

# Check context structure
CONTEXT_DIR=".agent-os/context"
if [ -d "$CONTEXT_DIR" ]; then
    SESSIONS=$(ls "$CONTEXT_DIR/sessions"/*.yml 2>/dev/null | wc -l | tr -d ' ')
    USERS=$(ls "$CONTEXT_DIR/users"/*.yml 2>/dev/null | wc -l | tr -d ' ')
    WORKFLOWS=$(ls "$CONTEXT_DIR/workflows"/*.yml 2>/dev/null | wc -l | tr -d ' ')
    
    check_component "Context System" "OK" "$SESSIONS sessions, $USERS users, $WORKFLOWS workflow contexts"
    
    # Check context scripts
    if [ -x "$CONTEXT_DIR/scripts/create-session.sh" ] && [ -x "$CONTEXT_DIR/scripts/resume-session.sh" ]; then
        check_component "Context Scripts" "OK" "Session management scripts available"
    else
        check_component "Context Scripts" "WARNING" "Session scripts missing or not executable"
    fi
else
    check_component "Context System" "WARNING" "Context management not set up"
fi

# =============================================================================
# 5. SMART ROUTER CHECK
# =============================================================================

log_health "${BLUE}🎯 Checking Smart Router...${NC}"

# Check Smart Router source
ROUTER_DIR="src/smart-router"
if [ -d "$ROUTER_DIR" ]; then
    ROUTER_FILES=$(find "$ROUTER_DIR" -name "*.ts" | wc -l | tr -d ' ')
    if [ "$ROUTER_FILES" -gt 10 ]; then
        check_component "Smart Router" "OK" "$ROUTER_FILES TypeScript files in router"
    else
        check_component "Smart Router" "WARNING" "Smart Router may be incomplete"
    fi
else
    check_component "Smart Router" "WARNING" "Smart Router source not found"
fi

# Check dependencies
if [ -f "package.json" ]; then
    if npm list --depth=0 >/dev/null 2>&1; then
        check_component "Dependencies" "OK" "All Node.js dependencies installed"
    else
        check_component "Dependencies" "WARNING" "Some dependencies may be missing"
    fi
fi

# =============================================================================
# 6. SYSTEM RESOURCES CHECK
# =============================================================================

log_health "${BLUE}💻 Checking System Resources...${NC}"

# Check disk space
DISK_USAGE=$(df . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    check_component "Disk Space" "OK" "${DISK_USAGE}% used"
elif [ "$DISK_USAGE" -lt 90 ]; then
    check_component "Disk Space" "WARNING" "${DISK_USAGE}% used"
else
    check_component "Disk Space" "CRITICAL" "${DISK_USAGE}% used"
fi

# Check memory (if available)
if command -v free >/dev/null 2>&1; then
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$MEMORY_USAGE" -lt 80 ]; then
        check_component "Memory Usage" "OK" "${MEMORY_USAGE}% used"
    elif [ "$MEMORY_USAGE" -lt 90 ]; then
        check_component "Memory Usage" "WARNING" "${MEMORY_USAGE}% used"
    else
        check_component "Memory Usage" "CRITICAL" "${MEMORY_USAGE}% used"
    fi
fi

# =============================================================================
# 7. GIT REPOSITORY CHECK
# =============================================================================

log_health "${BLUE}📦 Checking Git Repository...${NC}"

if [ -d ".git" ]; then
    # Check if we're on main branch
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    if [ "$CURRENT_BRANCH" = "main" ]; then
        check_component "Git Branch" "OK" "On main branch"
    else
        check_component "Git Branch" "WARNING" "On branch: $CURRENT_BRANCH"
    fi
    
    # Check for uncommitted changes
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        check_component "Git Status" "OK" "No uncommitted changes"
    else
        CHANGED_FILES=$(git diff-index --name-only HEAD -- | wc -l | tr -d ' ')
        check_component "Git Status" "WARNING" "$CHANGED_FILES files with uncommitted changes"
    fi
    
    # Check recent commits
    RECENT_COMMITS=$(git log --oneline -n 5 --since="7 days ago" | wc -l | tr -d ' ')
    if [ "$RECENT_COMMITS" -gt 0 ]; then
        check_component "Git Activity" "OK" "$RECENT_COMMITS commits in last 7 days"
    else
        check_component "Git Activity" "WARNING" "No recent commits"
    fi
else
    check_component "Git Repository" "WARNING" "Not a Git repository"
fi

# =============================================================================
# 8. MONITORING SETUP CHECK
# =============================================================================

log_health "${BLUE}📊 Checking Monitoring Setup...${NC}"

MONITORING_DIR=".agent-os/monitoring"
if [ -d "$MONITORING_DIR" ]; then
    if [ -f "$MONITORING_DIR/README.md" ]; then
        check_component "Monitoring Config" "OK" "Monitoring configuration available"
    else
        check_component "Monitoring Config" "WARNING" "Monitoring not fully configured"
    fi
    
    # Check for monitoring scripts
    if [ -f "$MONITORING_DIR/scripts/health-check.sh" ]; then
        check_component "Health Check Script" "OK" "This script is working!"
    fi
else
    check_component "Monitoring Setup" "WARNING" "Monitoring not configured"
fi

# =============================================================================
# FINAL HEALTH SCORE CALCULATION
# =============================================================================

echo ""
log_health "${BLUE}📊 Health Check Summary${NC}"
log_health "${BLUE}======================${NC}"

# Determine overall health status
if [ "$HEALTH_SCORE" -ge 90 ]; then
    HEALTH_STATUS="${GREEN}EXCELLENT${NC}"
    HEALTH_ICON="🟢"
elif [ "$HEALTH_SCORE" -ge 75 ]; then
    HEALTH_STATUS="${GREEN}GOOD${NC}"
    HEALTH_ICON="🟢"
elif [ "$HEALTH_SCORE" -ge 60 ]; then
    HEALTH_STATUS="${YELLOW}FAIR${NC}"
    HEALTH_ICON="🟡"
elif [ "$HEALTH_SCORE" -ge 40 ]; then
    HEALTH_STATUS="${YELLOW}POOR${NC}"
    HEALTH_ICON="🟡"
else
    HEALTH_STATUS="${RED}CRITICAL${NC}"
    HEALTH_ICON="🔴"
fi

log_health "${HEALTH_ICON} Overall Health Score: $HEALTH_SCORE/100 ($HEALTH_STATUS)"
log_health "Timestamp: $TIMESTAMP"

# Recommendations based on health score
echo ""
if [ "$HEALTH_SCORE" -lt 90 ]; then
    log_health "${BLUE}💡 Recommendations:${NC}"
    
    if [ "$AGENT_COUNT" -lt 35 ]; then
        log_health "   • Complete agent creation (currently $AGENT_COUNT/35+)"
    fi
    
    if [ "$TOTAL_KB" -eq 0 ]; then
        log_health "   • Start building knowledge base with examples"
    fi
    
    if [ ! -d "$CONTEXT_DIR" ]; then
        log_health "   • Set up context management system"
    fi
    
    if [ "$DISK_USAGE" -gt 80 ]; then
        log_health "   • Clean up disk space (currently ${DISK_USAGE}% used)"
    fi
fi

# Create health check report
REPORT_FILE=".agent-os/monitoring/logs/health-report-$(date +%Y-%m-%d).json"
cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "health_score": $HEALTH_SCORE,
  "status": "$(echo $HEALTH_STATUS | sed 's/\x1b\[[0-9;]*m//g')",
  "components": {
    "agents": $AGENT_COUNT,
    "workflows": $WORKFLOW_COUNT,
    "knowledge_base_items": $TOTAL_KB,
    "disk_usage_percent": $DISK_USAGE
  }
}
EOF

echo ""
log_health "📄 Health report saved to: $REPORT_FILE"
echo ""
log_health "${GREEN}✅ Health check completed!${NC}"

# Exit with appropriate code
if [ "$HEALTH_SCORE" -ge 60 ]; then
    exit 0
else
    exit 1
fi
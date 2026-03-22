#!/bin/bash

# Enhanced Agent OS Installation Script
# Repository: https://github.com/buildermethods/agent-os
# Usage: curl -sSL https://raw.githubusercontent.com/buildermethods/agent-os/main/setup/install-enhanced.sh | bash

set -e

echo "🚀 Enhanced Agent OS Installation"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

# Parse command line arguments
OVERWRITE_CONFIG=false
CLAUDE_CODE=true
CURSOR=false
PROJECT_TYPE="default"

while [[ $# -gt 0 ]]; do
    case $1 in
        --overwrite-config)
            OVERWRITE_CONFIG=true
            shift
            ;;
        --no-claude-code)
            CLAUDE_CODE=false
            shift
            ;;
        --cursor)
            CURSOR=true
            shift
            ;;
        --project-type=*)
            PROJECT_TYPE="${1#*=}"
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --overwrite-config      Overwrite existing config.yml"
            echo "  --no-claude-code        Disable Claude Code support (enabled by default)"
            echo "  --cursor                Enable Cursor support"
            echo "  --project-type=TYPE     Set project type (default: default, options: solo_engineer, startup_cto)"
            echo "  -h, --help              Show this help message"
            echo ""
            exit 0
            ;;
        *)
            print_warning "Unknown option: $1"
            shift
            ;;
    esac
done

# GitHub raw content base URL
BASE_URL="https://raw.githubusercontent.com/buildermethods/agent-os/main"

# Current directory setup
CURRENT_DIR=$(pwd)
PROJECT_NAME=$(basename "$CURRENT_DIR")

print_info "Installing Enhanced Agent OS to: $CURRENT_DIR"
print_info "Project name: $PROJECT_NAME"
print_info "Project type: $PROJECT_TYPE"
echo ""

# Download and source shared functions
TEMP_FUNCTIONS="/tmp/agent-os-functions-$$.sh"
curl -sSL "${BASE_URL}/setup/functions.sh" -o "$TEMP_FUNCTIONS"
source "$TEMP_FUNCTIONS"

# Function to convert command file to Cursor .mdc format (for enhanced commands)
convert_to_cursor_rule() {
    local source="$1"
    local dest="$2"

    if [ -f "$dest" ]; then
        print_warning "$(basename $dest) already exists - skipping"
    else
        cat > "$dest" << EOF
---
alwaysApply: false
---

EOF
        cat "$source" >> "$dest"
        print_status "$(basename $dest)"
    fi
}

# Create enhanced directory structure
print_info "Creating Enhanced Agent OS directory structure..."
mkdir -p .agent-os/{instructions/{core,enhanced,meta},standards/{code-style},product,specs,recaps}
mkdir -p .agent-os/claude-code/agents
mkdir -p .agent-os/design-system/{foundations,components/{base,composite,specialized},patterns,implementation}
mkdir -p .agent-os/business-analysis
mkdir -p commands

if [ "$CLAUDE_CODE" = "true" ]; then
    mkdir -p .claude/{commands,agents}
fi

if [ "$CURSOR" = "true" ]; then
    mkdir -p .cursor/rules
fi

print_status "Directory structure created"

# Handle config.yml enhancement
print_info "Configuring Agent OS..."
if [ ! -f "config.yml" ]; then
    # Download enhanced config if no config exists
    download_file "${BASE_URL}/config-enhanced.yml" \
        "config.yml" \
        "false" \
        "Enhanced config.yml"
    print_status "Enhanced config.yml installed"
elif [ "$OVERWRITE_CONFIG" = "true" ]; then
    # Replace existing config with enhanced version
    download_file "${BASE_URL}/config-enhanced.yml" \
        "config.yml" \
        "true" \
        "Enhanced config.yml (overwritten)"
else
    # Check if config already has enhanced features
    if grep -q "specialized_agents:" config.yml 2>/dev/null; then
        print_status "Enhanced features already present in config.yml"
    else
        # Add enhanced sections to existing config
        print_info "Adding enhanced features to existing config.yml..."
        
        # Backup original config
        cp config.yml config.yml.backup
        
        # Download enhanced config sections and append
        curl -sSL "${BASE_URL}/config-enhanced-sections.yml" >> config.yml 2>/dev/null || {
            print_warning "Could not add enhanced sections automatically"
            print_info "Enhanced features available - see config-enhanced.yml example"
        }
        
        if grep -q "enhanced_features:" config.yml 2>/dev/null; then
            print_status "Enhanced features added to existing config"
            print_info "Backup saved as config.yml.backup"
        fi
    fi
fi

# Update the default project type if specified and different from default
if [ "$PROJECT_TYPE" != "default" ] && [ -f "config.yml" ]; then
    if grep -q "default_project_type: default" config.yml; then
        sed -i.tmp "s/default_project_type: default/default_project_type: $PROJECT_TYPE/" config.yml && rm config.yml.tmp
        print_info "Set project type to: $PROJECT_TYPE"
    fi
fi

# Install core Agent OS files using existing pattern
print_info "Installing core Agent OS files..."
install_from_github ".agent-os" "false" "false" "false"

# Download enhanced strategic commands
print_info "Installing enhanced commands..."
echo ""
echo "📂 Core commands:"
for cmd in plan-product analyze-product create-spec create-tasks execute-tasks; do
    download_file "${BASE_URL}/commands/${cmd}.md" \
        "commands/${cmd}.md" \
        "false" \
        "commands/${cmd}.md"
done

echo ""
echo "📂 Enhanced strategic commands:"
for cmd in analyze-market validate-business-case create-design-system; do
    download_file "${BASE_URL}/commands/enhanced/${cmd}.md" \
        "commands/${cmd}.md" \
        "false" \
        "commands/${cmd}.md"
done

# Download enhanced instructions
print_info "Installing enhanced instruction workflows..."
echo ""
echo "📂 Enhanced instructions:"
for inst in enhanced-create-spec analyze-business-strategy manage-design-system; do
    download_file "${BASE_URL}/instructions/enhanced/${inst}.md" \
        ".agent-os/instructions/enhanced/${inst}.md" \
        "false" \
        "instructions/enhanced/${inst}.md"
done

# Download core development agents
if [ "$CLAUDE_CODE" = "true" ]; then
    print_info "Installing Claude Code agents..."
    
    echo ""
    echo "📂 Core development agents:"
    for agent in context-fetcher date-checker file-creator git-workflow project-manager test-runner; do
        download_file "${BASE_URL}/claude-code/agents/${agent}.md" \
            ".agent-os/claude-code/agents/${agent}.md" \
            "false" \
            "claude-code/agents/${agent}.md"
    done
    
    echo ""
    echo "📂 Enhanced strategic agents:"
    for agent in ux-designer market-researcher business-strategist; do
        download_file "${BASE_URL}/claude-code/agents/enhanced/${agent}.md" \
            ".agent-os/claude-code/agents/${agent}.md" \
            "false" \
            "claude-code/agents/${agent}.md"
    done
    
    # Install Claude Code commands
    print_info "Installing Claude Code commands..."
    for cmd in plan-product analyze-product create-spec create-tasks execute-tasks analyze-market validate-business-case create-design-system; do
        if [ -f "commands/${cmd}.md" ]; then
            copy_file "commands/${cmd}.md" ".claude/commands/${cmd}.md" "false" ".claude/commands/${cmd}.md"
        fi
    done
    
    # Install Claude Code agents
    echo ""
    echo "📂 Installing Claude Code agents:"
    for agent_file in .agent-os/claude-code/agents/*.md; do
        if [ -f "$agent_file" ]; then
            agent_name=$(basename "$agent_file")
            copy_file "$agent_file" ".claude/agents/$agent_name" "false" ".claude/agents/$agent_name"
        fi
    done
fi

# Handle Cursor installation
if [ "$CURSOR" = "true" ]; then
    print_info "Installing Cursor support..."
    echo "📂 Converting commands to Cursor rules:"
    
    for cmd_file in commands/*.md; do
        if [ -f "$cmd_file" ]; then
            cmd_name=$(basename "$cmd_file" .md)
            convert_to_cursor_rule "$cmd_file" ".cursor/rules/${cmd_name}.mdc"
        fi
    done
fi

# Download enhanced standards
print_info "Installing enhanced standards..."
echo ""
echo "📂 Enhanced standards:"
for standard in code-of-conduct solo-engineer-practices; do
    download_file "${BASE_URL}/standards/enhanced/${standard}.md" \
        ".agent-os/standards/${standard}.md" \
        "false" \
        "standards/${standard}.md"
done

# Create design system documentation structure
print_info "Creating design system documentation..."
download_file "${BASE_URL}/design-system/README.md" \
    ".agent-os/design-system/README.md" \
    "false" \
    "design-system/README.md"

# Create project README
print_info "Creating project documentation..."
download_file "${BASE_URL}/README-enhanced.md" \
    ".agent-os/README.md" \
    "false" \
    ".agent-os/README.md"

# Cleanup
rm -f "$TEMP_FUNCTIONS"

echo ""
echo "============================================="
print_status "Enhanced Agent OS Installation Complete!"
echo "============================================="
echo ""
print_info "🎯 Available Commands:"
echo "   /analyze-market        - Market research & competitive analysis"
echo "   /validate-business-case - Business viability validation"  
echo "   /create-design-system  - Design system consistency"
echo "   /plan-product          - Plan new product with Agent OS"
echo "   /create-spec          - Create feature specifications"
echo "   /create-tasks         - Generate task breakdowns"
echo "   /execute-tasks        - Execute implementation"
echo "   /analyze-product      - Analyze existing codebase"
echo ""
print_info "🚀 Test your installation:"
echo "   # Standard Agent OS:"
echo "   /plan-product"
echo "   /create-spec \"Your feature\""
echo ""
echo "   # Enhanced features (if enabled):"
echo "   /analyze-market \"Your product idea\""
echo "   /validate-business-case \"Feature concept\""
echo ""

if [ "$CLAUDE_CODE" = "true" ]; then
    print_info "📱 Claude Code integration:"
    echo "   Commands installed to .claude/commands/"
    echo "   Agents installed to .claude/agents/"
fi

if [ "$CURSOR" = "true" ]; then
    print_info "🎯 Cursor integration:"
    echo "   Rules installed to .cursor/rules/"
fi

echo ""
print_info "📊 Configuration: $PROJECT_TYPE mode active"
if [ "$PROJECT_TYPE" = "default" ]; then
    print_info "   💡 To use enhanced features, change default_project_type to 'solo_engineer' in config.yml"
else
    print_info "   ✨ Enhanced features enabled"
fi
print_info "   📚 Documentation available in .agent-os/README.md"
echo ""
print_status "Ready for strategic development! 🎯"
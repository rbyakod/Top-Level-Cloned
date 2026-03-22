# Complete Enhanced Agent OS Installation Guide

## Overview
This guide takes you from a freshly downloaded Agent OS repository to a fully functional Enhanced Agent OS with strategic capabilities.

## Prerequisites
- ✅ Downloaded/cloned the Agent OS repository
- ✅ Claude Code or Cursor IDE installed
- ✅ Git configured on your system
- ✅ Node.js/npm installed (if working with JS/TS projects)

## Step 1: Navigate to Your Repository
```bash
# Navigate to your downloaded Agent OS directory
cd agent-os
# or wherever you downloaded it

# Verify you're in the right place
ls
# You should see: config.yml, commands/, .agent-os/, README.md, etc.
```

## Step 2: Install Enhanced Agent OS Features

### Method A: Automated Installation (Recommended)

**Create the installation script:**
```bash
# Create the installation script
cat > install-enhanced-agent-os.sh << 'EOF'
#!/bin/bash

# Enhanced Agent OS Installation Script
set -e

echo "🚀 Installing Enhanced Agent OS features..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }

# Create enhanced directory structure
print_info "Creating enhanced directory structure..."
mkdir -p .agent-os/{instructions/enhanced,claude-code/agents,design-system,business-analysis}
mkdir -p .agent-os/design-system/{foundations,components/{base,composite,specialized},patterns,implementation}
mkdir -p commands
print_status "Directory structure created"

# Backup existing config
if [[ -f "config.yml" ]]; then
    cp config.yml config.yml.backup
    print_status "Backed up existing config.yml"
fi

# Create enhanced config.yml
print_info "Installing enhanced configuration..."
cat > config.yml << 'CONFIG_EOF'
# Agent OS Configuration - Enhanced Edition

# Refer to the official Agent OS documentation at:
# https://buildermethods.com/agent-os

agent_os_version: 1.4.1

# Core Agent OS agents
agents:
  claude_code:
    enabled: true  # Enable for enhanced workflows
  cursor:
    enabled: true  # Enable for enhanced workflows

# Enhanced specialized agents for strategic development
specialized_agents:
  # Original core development agents
  development:
    - context-fetcher    # Documentation retrieval
    - date-checker      # Date determination  
    - file-creator      # File and directory creation
    - git-workflow      # Git operations and PR management
    - project-manager   # Task completion tracking
    - test-runner       # Test execution and analysis
  
  # New strategic agents for solo engineers/CTOs
  strategic:
    - ux-designer       # UI/UX design strategy and user experience
    - market-researcher # Market analysis and competitive intelligence
    - business-strategist # Business strategy and use case analysis

# Project type configurations
project_types:
  # Original default configuration
  default:
    instructions: ~/.agent-os/instructions
    standards: ~/.agent-os/standards

  # Enhanced solo engineer configuration
  solo_engineer:
    instructions: ~/.agent-os/instructions
    standards: ~/.agent-os/standards
    agents: [development, strategic]
    workflows:
      - enhanced-spec-creation    # Market + UX + Business validation
      - business-strategy-analysis # Strategic decision making
      - design-system-management  # UI/UX consistency

  # CTO-level strategic configuration  
  startup_cto:
    instructions: ~/.agent-os/project_types/cto/instructions
    standards: ~/.agent-os/project_types/cto/standards  
    agents: [development, strategic]

# Default project type - change to 'solo_engineer' to use enhancements
default_project_type: default

# Enhanced features (optional - only active if using enhanced project types)
enhanced_features:
  # Solo engineer optimizations
  solo_engineer_mode:
    auto_market_research: true      # Research before every spec
    design_system_enforcement: true # Maintain UI consistency  
    business_case_validation: true  # Validate ROI before development
    strategic_decision_support: true # CTO-level guidance

  # Business intelligence and reporting
  reporting:
    progress_tracking: true         # Weekly development progress
    business_metrics: true          # Feature success and ROI tracking  
    competitive_analysis: false     # Monthly competitive monitoring
    technical_debt_monitoring: true # Code quality and debt tracking

# Agent behavior settings
agent_behavior:
  autonomy_level: high             # Agents make decisions independently
  intervention_threshold: errors_only # Only ask for help on blocking issues
  strategic_validation: true       # Validate business decisions
  user_experience_focus: true     # Prioritize UX in all decisions

# Backward compatibility
compatibility:
  original_workflows: true        # Support original Agent OS workflows
  legacy_commands: true          # Keep existing command structure
CONFIG_EOF

print_status "Enhanced configuration installed"

# Create placeholder files for agents (content to be added manually)
print_info "Creating agent placeholder files..."

cat > .agent-os/claude-code/agents/ux-designer.md << 'AGENT_EOF'
---
name: ux-designer
description: Use proactively to create user experience strategies, UI mockups, design systems, and user journey analysis for features and products
tools: Read, Write, Grep, Glob
color: purple
---

# UX/UI Design Agent

You are a specialized UX/UI design agent for Agent OS workflows. Your role is to provide design strategy, user experience analysis, and interface recommendations while following Agent OS design patterns.

## Core Responsibilities

1. **User Experience Analysis**: Create user journey maps and interaction flows
2. **UI Design Strategy**: Design component hierarchies and interface layouts
3. **Design System Creation**: Establish consistent design patterns and components
4. **User Research Integration**: Analyze user needs and translate to design requirements
5. **Accessibility Standards**: Ensure WCAG compliance and inclusive design practices

[PLACEHOLDER: Copy complete content from UX Design Agent Specification artifact]
AGENT_EOF

cat > .agent-os/claude-code/agents/market-researcher.md << 'AGENT_EOF'
---
name: market-researcher
description: Use proactively to conduct market analysis, competitive research, user validation, and business opportunity assessment for features and products
tools: Read, Write, Grep, Glob, Web_Search
color: teal
---

# Market Research Agent

You are a specialized market research agent for Agent OS workflows. Your role is to provide data-driven market insights, competitive analysis, and user validation to inform product and feature decisions.

## Core Responsibilities

1. **Market Analysis**: Size markets, identify trends, and assess opportunities
2. **Competitive Intelligence**: Research competitors, analyze positioning, and identify gaps
3. **User Validation**: Design research approaches to validate assumptions and needs
4. **Business Case Development**: Calculate ROI, estimate costs, and project outcomes
5. **Risk Assessment**: Identify market risks and mitigation strategies

[PLACEHOLDER: Copy complete content from Market Research Agent Specification artifact]
AGENT_EOF

cat > .agent-os/claude-code/agents/business-strategist.md << 'AGENT_EOF'
---
name: business-strategist
description: Use proactively to develop business strategy, analyze use cases, create go-to-market plans, and provide CTO-level strategic guidance for product and technology decisions
tools: Read, Write, Grep, Glob
color: indigo
---

# Business Strategy Agent

You are a specialized business strategy agent for Agent OS workflows. Your role is to provide strategic business guidance, analyze use cases, and support CTO-level decision making for product direction and technology investments.

## Core Responsibilities

1. **Strategic Planning**: Develop business strategy and product roadmaps aligned with market opportunities
2. **Use Case Analysis**: Identify and prioritize business use cases for features and products
3. **Go-to-Market Strategy**: Create launch plans and customer acquisition strategies  
4. **Technology Strategy**: Guide technical decisions from business perspective
5. **Risk Management**: Assess business risks and develop mitigation strategies

[PLACEHOLDER: Copy complete content from Business Strategy Agent Specification artifact]
AGENT_EOF

print_status "Agent placeholder files created"

# Create new commands
print_info "Creating enhanced commands..."

cat > commands/analyze-market.md << 'CMD_EOF'
# Analyze Market

Conduct comprehensive market research and competitive analysis for product decisions

Refer to the instructions located in this file:
@.agent-os/instructions/core/analyze-business-strategy.md
CMD_EOF

cat > commands/create-design-system.md << 'CMD_EOF'
# Create Design System

Establish or enhance design system for consistent user experience

Refer to the instructions located in this file:
@.agent-os/instructions/core/manage-design-system.md
CMD_EOF

cat > commands/validate-business-case.md << 'CMD_EOF'
# Validate Business Case

Analyze business viability and strategic value of a product or feature idea

Refer to the instructions located in this file:
@.agent-os/instructions/enhanced/enhanced-create-spec.md
CMD_EOF

print_status "Enhanced commands created"

# Create instruction placeholder files
print_info "Creating instruction workflow placeholders..."

mkdir -p .agent-os/instructions/{core,enhanced}

cat > .agent-os/instructions/core/analyze-business-strategy.md << 'INST_EOF'
---
description: Analyze business strategy and market opportunity for product decisions
globs:
alwaysApply: false  
version: 1.0
encoding: UTF-8
---

# Business Strategy Analysis

[PLACEHOLDER: Copy complete content from analyze-business-strategy artifact]
INST_EOF

cat > .agent-os/instructions/core/manage-design-system.md << 'INST_EOF'
---
description: Create and maintain design system consistency across the application
globs:
alwaysApply: false
version: 1.0  
encoding: UTF-8
---

# Design System Management

[PLACEHOLDER: Copy complete content from manage-design-system artifact]
INST_EOF

cat > .agent-os/instructions/enhanced/enhanced-create-spec.md << 'INST_EOF'
---
description: Enhanced spec creation workflow integrating market research, UX design, and business strategy validation
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Enhanced Spec Creation - Solo Engineer/CTO Edition

[PLACEHOLDER: Copy complete content from enhanced-create-spec artifact]
INST_EOF

print_status "Instruction workflow placeholders created"

# Create enhanced standards
print_info "Creating enhanced standards..."

cat > .agent-os/standards/code-of-conduct.md << 'STANDARD_EOF'
# Agent OS Code of Conduct for AI Agents

## Purpose

This document establishes operational standards for AI agents within the Agent OS framework to maximize autonomy, minimize human interruptions, and ensure consistent, high-quality code generation across all Agent OS subagents and workflows.

[PLACEHOLDER: Copy complete content from code-of-conduct artifact]
STANDARD_EOF

cat > .agent-os/standards/solo-engineer-practices.md << 'STANDARD_EOF'
# Solo Engineer Best Practices

## Strategic Development Approach

### Business-First Development
- Always validate business value before implementation
- Conduct market research for every major feature
- Design with user experience as primary concern
- Measure business impact of all development decisions

[PLACEHOLDER: Copy complete content from solo-engineer-practices artifact]
STANDARD_EOF

print_status "Enhanced standards created"

# Create README with next steps
cat > ENHANCED_AGENT_OS_SETUP.md << 'README_EOF'
# Enhanced Agent OS Setup Complete! 🚀

## What Was Installed
✅ Enhanced configuration with strategic agents
✅ 3 new specialized agents (placeholders created)
✅ New commands: /analyze-market, /create-design-system, /validate-business-case
✅ Enhanced instruction workflows (placeholders created)
✅ Solo engineer best practices and code of conduct

## IMPORTANT: Complete the Installation

The installation script created placeholder files. You need to copy the actual content from the artifacts:

### Step 1: Copy Agent Content
Replace placeholder content in these files with full content from the artifacts:
- `.agent-os/claude-code/agents/ux-designer.md` ← Copy from "UX Design Agent Specification"
- `.agent-os/claude-code/agents/market-researcher.md` ← Copy from "Market Research Agent Specification"  
- `.agent-os/claude-code/agents/business-strategist.md` ← Copy from "Business Strategy Agent Specification"

### Step 2: Copy Instruction Content
Replace placeholder content in these files:
- `.agent-os/instructions/enhanced/enhanced-create-spec.md` ← Copy from "Enhanced Spec Creation"
- `.agent-os/instructions/core/analyze-business-strategy.md` ← Copy from "analyze-business-strategy"
- `.agent-os/instructions/core/manage-design-system.md` ← Copy from "manage-design-system"

### Step 3: Copy Standards Content
Replace placeholder content in these files:
- `.agent-os/standards/code-of-conduct.md` ← Copy from "code-of-conduct" 
- `.agent-os/standards/solo-engineer-practices.md` ← Copy from "solo-engineer-practices"

### Step 4: Test Your Setup
Try the new commands:
```bash
/analyze-market "Your product idea"
/validate-business-case "Feature idea"  
/create-design-system "Component audit"
```

### Step 5: Enable Enhanced Features
To use the enhanced features, change your config.yml:
```yaml
# Change this line:
default_project_type: default

# To this:
default_project_type: solo_engineer
```

## Ready to Go Strategic! 🎯
Your Enhanced Agent OS is installed and ready for strategic development.
README_EOF

print_status "Setup documentation created"

echo ""
echo "========================================="
print_status "Enhanced Agent OS Installation Complete!"
echo "========================================="
echo ""
print_info "Next steps:"
echo "   1. Copy artifact content to replace placeholders (see ENHANCED_AGENT_OS_SETUP.md)"
echo "   2. Test the new commands: /analyze-market, /validate-business-case, /create-design-system"
echo "   3. Enable enhanced features by changing default_project_type in config.yml"
echo "   4. Start using strategic development workflows!"
echo ""
print_status "Installation guide available in: ENHANCED_AGENT_OS_SETUP.md"

EOF

# Make script executable and run it
chmod +x install-enhanced-agent-os.sh
./install-enhanced-agent-os.sh
```

### Method B: Manual Installation (Step by Step)

If you prefer to install manually, follow these exact steps:

**2.1 Create Directory Structure:**
```bash
mkdir -p .agent-os/{instructions/enhanced,claude-code/agents,design-system,business-analysis}
mkdir -p commands
```

**2.2 Update config.yml:**
```bash
# Backup existing config
cp config.yml config.yml.backup

# Use the enhanced config from the "enhanced-original-config" artifact above
```

**2.3 Create Command Files:**
Create these 3 files in the `commands/` directory with the content from the artifacts.

**2.4 Create Agent Files:**
Create the 3 agent files in `.agent-os/claude-code/agents/` with placeholder content.

## Step 3: Copy Artifact Content

**This is the most important step!** The installation creates placeholder files. You need to copy the actual content from our conversation artifacts:

### Copy These Artifacts:
1. **UX Design Agent** → `.agent-os/claude-code/agents/ux-designer.md`
2. **Market Research Agent** → `.agent-os/claude-code/agents/market-researcher.md`  
3. **Business Strategy Agent** → `.agent-os/claude-code/agents/business-strategist.md`
4. **Enhanced Spec Creation** → `.agent-os/instructions/enhanced/enhanced-create-spec.md`
5. **Analyze Business Strategy** → `.agent-os/instructions/core/analyze-business-strategy.md`
6. **Manage Design System** → `.agent-os/instructions/core/manage-design-system.md`
7. **Code of Conduct** → `.agent-os/standards/code-of-conduct.md`
8. **Solo Engineer Practices** → `.agent-os/standards/solo-engineer-practices.md`

## Step 4: Test Your Installation

```bash
# Test the new commands
/analyze-market "E-commerce platform for small businesses"
/validate-business-case "Advanced user dashboard"  
/create-design-system "Component library consistency"

# Test existing Agent OS commands still work
/create-spec "Test feature"
/plan-product
```

## Step 5: Enable Enhanced Features (Optional)

To use the enhanced strategic features, edit your `config.yml`:
```yaml
# Change this:
default_project_type: default

# To this:
default_project_type: solo_engineer
```

## Step 6: Commit Your Enhanced Agent OS

```bash
git add .
git commit -m "feat: Install Enhanced Agent OS with strategic capabilities"
git push origin main
```

## Verification Checklist

✅ **Config updated** - Enhanced config.yml with strategic agents  
✅ **Commands work** - `/analyze-market`, `/validate-business-case`, `/create-design-system` respond  
✅ **Agents respond** - Strategic agents provide UX, market, and business guidance  
✅ **Original features work** - Existing Agent OS commands still function  
✅ **Directory structure** - All enhanced directories created properly

## You're Ready! 🚀

Your Enhanced Agent OS transforms you from building features to building successful products through strategic validation, market research, and user experience design.

**Next**: Try creating your first strategically validated spec with `/validate-business-case "Your feature idea"`
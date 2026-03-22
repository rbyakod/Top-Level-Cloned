#!/bin/bash

# Enhanced Agent OS Installation Script
# Repository: https://github.com/alirezarezvani/agent-os

set -e

echo "🚀 Enhanced Agent OS Installation"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Create directory structure
print_info "Creating Enhanced Agent OS directory structure..."
mkdir -p .agent-os/{instructions/{core,enhanced},standards,claude-code/agents,design-system,business-analysis}
mkdir -p commands

print_status "Directory structure created"

# Create enhanced config.yml
print_info "Installing enhanced configuration..."
cat > config.yml << 'CONFIG_EOF'
# Agent OS Configuration - Enhanced Edition

agent_os_version: 1.4.1

agents:
  claude_code:
    enabled: true
  cursor:
    enabled: true

specialized_agents:
  development:
    - context-fetcher
    - date-checker
    - file-creator
    - git-workflow
    - project-manager
    - test-runner
  
  strategic:
    - ux-designer
    - market-researcher
    - business-strategist

project_types:
  default:
    instructions: ~/.agent-os/instructions
    standards: ~/.agent-os/standards

  solo_engineer:
    instructions: ~/.agent-os/instructions
    standards: ~/.agent-os/standards
    agents: [development, strategic]

default_project_type: solo_engineer

enhanced_features:
  solo_engineer_mode:
    auto_market_research: true
    design_system_enforcement: true
    business_case_validation: true

agent_behavior:
  autonomy_level: high
  strategic_validation: true
  user_experience_focus: true
CONFIG_EOF

print_status "Configuration created"

# Create essential commands
print_info "Creating enhanced commands..."

cat > commands/analyze-market.md << 'CMD_EOF'
# Analyze Market

Conduct comprehensive market research and competitive analysis for product decisions

Refer to the instructions located in this file:
@.agent-os/instructions/core/analyze-business-strategy.md
CMD_EOF

cat > commands/validate-business-case.md << 'CMD_EOF'
# Validate Business Case

Analyze business viability and strategic value of a product or feature idea

Refer to the instructions located in this file:
@.agent-os/instructions/enhanced/enhanced-create-spec.md
CMD_EOF

cat > commands/create-design-system.md << 'CMD_EOF'
# Create Design System

Establish or enhance design system for consistent user experience

Refer to the instructions located in this file:
@.agent-os/instructions/core/manage-design-system.md
CMD_EOF

# Create original Agent OS commands
cat > commands/plan-product.md << 'CMD_EOF'
# Plan Product

Plan a new product and install Agent OS in its codebase.

Refer to the instructions located in this file:
@.agent-os/instructions/core/plan-product.md
CMD_EOF

cat > commands/create-spec.md << 'CMD_EOF'
# Create Spec

Create a detailed spec for a new feature with technical specifications and task breakdown

Refer to the instructions located in this file:
@.agent-os/instructions/core/create-spec.md
CMD_EOF

cat > commands/create-tasks.md << 'CMD_EOF'
# Create Tasks

Create a tasks list with sub-tasks to execute a feature based on its spec.

Refer to the instructions located in this file:
@.agent-os/instructions/core/create-tasks.md
CMD_EOF

cat > commands/execute-tasks.md << 'CMD_EOF'
# Execute Task

Execute the next task.

Refer to the instructions located in this file:
@.agent-os/instructions/core/execute-tasks.md
CMD_EOF

cat > commands/analyze-product.md << 'CMD_EOF'
# Analyze Product

Analyze your product's codebase and install Agent OS

Refer to the instructions located in this file:
@.agent-os/instructions/core/analyze-product.md
CMD_EOF

print_status "Commands created"

# Create basic agent placeholders
print_info "Creating strategic agents..."

cat > .agent-os/claude-code/agents/ux-designer.md << 'AGENT_EOF'
---
name: ux-designer
description: UI/UX design strategy and user experience optimization
tools: Read, Write, Grep, Glob
color: purple
---

# UX/UI Design Agent

You are a specialized UX/UI design agent for Agent OS workflows.

## Core Responsibilities
- User experience analysis and journey mapping
- UI design strategy and component planning  
- Design system creation and consistency
- Accessibility compliance and inclusive design

## Quick Test
Try: /create-design-system "Audit component library consistency"
AGENT_EOF

cat > .agent-os/claude-code/agents/market-researcher.md << 'AGENT_EOF'
---
name: market-researcher
description: Market analysis and competitive research
tools: Read, Write, Grep, Glob, Web_Search
color: teal
---

# Market Research Agent

You are a specialized market research agent for Agent OS workflows.

## Core Responsibilities
- Market analysis and opportunity sizing
- Competitive intelligence and positioning
- User validation and research
- Business case development and ROI analysis

## Quick Test
Try: /analyze-market "SaaS project management tools"
AGENT_EOF

cat > .agent-os/claude-code/agents/business-strategist.md << 'AGENT_EOF'
---
name: business-strategist
description: Business strategy and CTO-level guidance
tools: Read, Write, Grep, Glob
color: indigo
---

# Business Strategy Agent

You are a specialized business strategy agent for Agent OS workflows.

## Core Responsibilities
- Strategic planning and roadmap development
- Use case analysis and prioritization
- Go-to-market strategy and customer acquisition
- Technology strategy and CTO-level decisions

## Quick Test
Try: /validate-business-case "Advanced reporting dashboard"
AGENT_EOF

print_status "Strategic agents created"

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
echo "   /analyze-market \"Your product idea\""
echo "   /validate-business-case \"Feature concept\""
echo ""
print_info "📊 Configuration: solo_engineer mode enabled"
print_info "   Change to 'default' in config.yml for original Agent OS behavior"
echo ""
print_status "Ready for strategic development! 🎯"
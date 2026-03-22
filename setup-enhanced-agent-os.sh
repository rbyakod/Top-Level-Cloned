#!/bin/bash

# Enhanced Agent OS Project Installation
# Installs complete Agent OS framework with strategic enhancements

set -e
echo "🚀 Installing Enhanced Agent OS in your project..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Create complete Agent OS structure
print_info "Creating Enhanced Agent OS directory structure..."

# Core directories
mkdir -p .agent-os/{instructions/{core,enhanced,meta},standards/{code-style},product,specs,recaps}
mkdir -p .agent-os/claude-code/agents
mkdir -p .agent-os/design-system/{foundations,components/{base,composite,specialized},patterns,implementation}
mkdir -p .agent-os/business-analysis
mkdir -p commands

print_status "Directory structure created"

# Create main config.yml
print_info "Installing Agent OS configuration..."
cat > config.yml << 'CONFIG_EOF'
# Agent OS Configuration - Enhanced Edition
# Enhanced with strategic capabilities for solo engineers and CTOs

agent_os_version: 1.4.1

# Core Agent OS agents
agents:
  claude_code:
    enabled: true
  cursor:
    enabled: true

# Specialized agents for strategic development
specialized_agents:
  # Core development agents
  development:
    - context-fetcher    # Documentation retrieval
    - date-checker      # Date determination  
    - file-creator      # File and directory creation
    - git-workflow      # Git operations and PR management
    - project-manager   # Task completion tracking
    - test-runner       # Test execution and analysis
  
  # Strategic agents for business intelligence
  strategic:
    - ux-designer       # UI/UX design strategy and user experience
    - market-researcher # Market analysis and competitive intelligence
    - business-strategist # Business strategy and use case analysis

# Project configurations
project_types:
  default:
    instructions: ~/.agent-os/instructions
    standards: ~/.agent-os/standards

  solo_engineer:
    instructions: ~/.agent-os/instructions
    standards: ~/.agent-os/standards
    agents: [development, strategic]
    workflows:
      - enhanced-spec-creation
      - business-strategy-analysis
      - design-system-management

  startup_cto:
    instructions: ~/.agent-os/instructions
    standards: ~/.agent-os/standards  
    agents: [development, strategic]
    workflows:
      - enhanced-spec-creation
      - business-strategy-analysis
      - design-system-management
      - competitive-monitoring

# Default to enhanced mode (change to 'default' for original Agent OS behavior)
default_project_type: solo_engineer

# Enhanced features configuration
enhanced_features:
  solo_engineer_mode:
    auto_market_research: true      
    design_system_enforcement: true 
    business_case_validation: true  
    strategic_decision_support: true

  reporting:
    progress_tracking: true         
    business_metrics: true          
    competitive_analysis: false     
    technical_debt_monitoring: true 

agent_behavior:
  autonomy_level: high             
  intervention_threshold: errors_only
  strategic_validation: true       
  user_experience_focus: true     
  market_awareness: true          

compatibility:
  original_workflows: true        
  legacy_commands: true          
  migration_support: true       
CONFIG_EOF

print_status "Configuration installed"

# Create all Agent OS commands
print_info "Creating Agent OS commands..."

# Original Agent OS commands
cat > commands/plan-product.md << 'CMD_EOF'
# Plan Product

Plan a new product and install Agent OS in its codebase.

Refer to the instructions located in this file:
@.agent-os/instructions/core/plan-product.md
CMD_EOF

cat > commands/analyze-product.md << 'CMD_EOF'
# Analyze Product

Analyze your product's codebase and install Agent OS

Refer to the instructions located in this file:
@.agent-os/instructions/core/analyze-product.md
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

# Enhanced strategic commands
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

print_status "Commands created"

# Create core instruction files (placeholders - content needs to be copied from artifacts)
print_info "Creating instruction workflows..."

cat > .agent-os/instructions/core/plan-product.md << 'INST_EOF'
---
description: Product Planning Rules for Agent OS
globs:
alwaysApply: false
version: 4.0
encoding: UTF-8
---

# Product Planning Rules

## Overview
Generate product docs for new projects: mission, tech-stack and roadmap files for AI agent consumption.

[PLACEHOLDER: Copy complete content from plan-product instruction]
INST_EOF

cat > .agent-os/instructions/core/analyze-product.md << 'INST_EOF'
---
description: Analyze Current Product & Install Agent OS
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Analyze Current Product & Install Agent OS

## Overview
Install Agent OS into an existing codebase, analyze current product state and progress.

[PLACEHOLDER: Copy complete content from analyze-product instruction]
INST_EOF

cat > .agent-os/instructions/core/create-spec.md << 'INST_EOF'
---
description: Spec Creation Rules for Agent OS
globs:
alwaysApply: false
version: 1.1
encoding: UTF-8
---

# Spec Creation Rules

## Overview
Generate detailed feature specifications aligned with product roadmap and mission.

[PLACEHOLDER: Copy complete content from create-spec instruction]
INST_EOF

cat > .agent-os/instructions/core/create-tasks.md << 'INST_EOF'
---
description: Create an Agent OS tasks list from an approved feature spec
globs:
alwaysApply: false
version: 1.1
encoding: UTF-8
---

# Spec Creation Rules

## Overview
With the user's approval, proceed to creating a tasks list based on the current feature spec.

[PLACEHOLDER: Copy complete content from create-tasks instruction]
INST_EOF

cat > .agent-os/instructions/core/execute-tasks.md << 'INST_EOF'
---
description: Rules to initiate execution of a set of tasks using Agent OS
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Task Execution Rules

## Overview
Execute tasks for a given spec following three distinct phases.

[PLACEHOLDER: Copy complete content from execute-tasks instruction]
INST_EOF

# Enhanced strategic instructions
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

# Meta instructions
cat > .agent-os/instructions/meta/pre-flight.md << 'META_EOF'
---
description: Common Pre-Flight Steps for Agent OS Instructions
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Pre-Flight Rules

- IMPORTANT: For any step that specifies a subagent in the subagent="" XML attribute you MUST use the specified subagent to perform the instructions for that step.
- Process XML blocks sequentially
- Read and execute every numbered step in the process_flow EXACTLY as the instructions specify.
- If you need clarification on any details of your current task, stop and ask the user specific numbered questions and then continue once you have all of the information you need.
- Use exact templates as provided
META_EOF

cat > .agent-os/instructions/meta/post-flight.md << 'META_EOF'
---
description: Common Post-Flight Steps for Agent OS Instructions
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Post-Flight Rules

After completing all steps in a process_flow, always review your work and verify:

- Every numbered step has read, executed, and delivered according to its instructions.
- All steps that specified a subagent should be used, did in fact delegate those tasks to the specified subagent.  IF they did not, see why the subagent was not used and report your findings to the user.
- IF you notice a step wasn't executed according to it's instructions, report your findings and explain which part of the instructions were misread or skipped and why.
META_EOF

print_status "Instruction workflows created"

# Create specialized agents
print_info "Creating specialized agents..."

cat > .agent-os/claude-code/agents/context-fetcher.md << 'AGENT_EOF'
---
name: context-fetcher
description: Use proactively to retrieve and extract relevant information from Agent OS documentation files. Checks if content is already in context before returning.
tools: Read, Grep, Glob
color: blue
---

# Context Fetcher Agent

[PLACEHOLDER: Copy complete content from context-fetcher agent]
AGENT_EOF

cat > .agent-os/claude-code/agents/date-checker.md << 'AGENT_EOF'
---
name: date-checker
description: Use proactively to determine and output today's date including the current year, month and day.
tools: Read, Grep, Glob
color: pink
---

# Date Checker Agent

[PLACEHOLDER: Copy complete content from date-checker agent]
AGENT_EOF

cat > .agent-os/claude-code/agents/file-creator.md << 'AGENT_EOF'
---
name: file-creator
description: Use proactively to create files, directories, and apply templates for Agent OS workflows.
tools: Write, Bash, Read
color: green
---

# File Creator Agent

[PLACEHOLDER: Copy complete content from file-creator agent]
AGENT_EOF

cat > .agent-os/claude-code/agents/git-workflow.md << 'AGENT_EOF'
---
name: git-workflow
description: Use proactively to handle git operations, branch management, commits, and PR creation for Agent OS workflows
tools: Bash, Read, Grep
color: orange
---

# Git Workflow Agent

[PLACEHOLDER: Copy complete content from git-workflow agent]
AGENT_EOF

cat > .agent-os/claude-code/agents/project-manager.md << 'AGENT_EOF'
---
name: project-manager
description: Use proactively to check task completeness and update task and roadmap tracking docs.
tools: Read, Grep, Glob, Write, Bash
color: cyan
---

# Project Manager Agent

[PLACEHOLDER: Copy complete content from project-manager agent]
AGENT_EOF

cat > .agent-os/claude-code/agents/test-runner.md << 'AGENT_EOF'
---
name: test-runner
description: Use proactively to run tests and analyze failures for the current task.
tools: Bash, Read, Grep, Glob
color: yellow
---

# Test Runner Agent

[PLACEHOLDER: Copy complete content from test-runner agent]
AGENT_EOF

# Strategic agents
cat > .agent-os/claude-code/agents/ux-designer.md << 'AGENT_EOF'
---
name: ux-designer
description: Use proactively to create user experience strategies, UI mockups, design systems, and user journey analysis for features and products
tools: Read, Write, Grep, Glob
color: purple
---

# UX/UI Design Agent

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

[PLACEHOLDER: Copy complete content from Business Strategy Agent Specification artifact]
AGENT_EOF

print_status "Specialized agents created"

# Create standards
print_info "Creating Agent OS standards..."

cat > .agent-os/standards/best-practices.md << 'STANDARD_EOF'
# Development Best Practices

## Context
Global development guidelines for Agent OS projects.

[PLACEHOLDER: Copy complete content from best-practices standard]
STANDARD_EOF

cat > .agent-os/standards/code-style.md << 'STANDARD_EOF'
# Code Style Guide

## Context
Global code style rules for Agent OS projects.

[PLACEHOLDER: Copy complete content from code-style standard]
STANDARD_EOF

cat > .agent-os/standards/tech-stack.md << 'STANDARD_EOF'
# Tech Stack

## Context
Global tech stack defaults for Agent OS projects, overridable in project-specific `.agent-os/product/tech-stack.md`.

[PLACEHOLDER: Copy complete content from enhanced tech-stack standard]
STANDARD_EOF

cat > .agent-os/standards/code-of-conduct.md << 'STANDARD_EOF'
# Agent OS Code of Conduct for AI Agents

## Purpose
This document establishes operational standards for AI agents within the Agent OS framework.

[PLACEHOLDER: Copy complete content from code-of-conduct artifact]
STANDARD_EOF

cat > .agent-os/standards/solo-engineer-practices.md << 'STANDARD_EOF'
# Solo Engineer Best Practices

## Strategic Development Approach

[PLACEHOLDER: Copy complete content from solo-engineer-practices artifact]
STANDARD_EOF

print_status "Standards created"

# Create project README
cat > .agent-os/README.md << 'README_EOF'
# Enhanced Agent OS Installation

This project now has Enhanced Agent OS installed with strategic capabilities!

## What's Installed
✅ Complete Agent OS framework with core workflows
✅ 3 Strategic agents: UX Designer, Market Researcher, Business Strategist  
✅ Enhanced commands: /analyze-market, /validate-business-case, /create-design-system
✅ Solo engineer optimizations and CTO-level guidance
✅ Design system management and business intelligence

## CRITICAL: Complete the Setup

The installation created placeholder files. You MUST copy the actual content from the Enhanced Agent OS artifacts:

### Required Steps:
1. **Copy agent content** from artifacts to `.agent-os/claude-code/agents/` files
2. **Copy instruction content** from artifacts to `.agent-os/instructions/` files  
3. **Copy standards content** from artifacts to `.agent-os/standards/` files
4. **Test the setup** with `/analyze-market "Your product idea"`

### Available Commands:
- `/plan-product` - Plan new product with Agent OS
- `/analyze-product` - Analyze existing codebase
- `/create-spec` - Create feature specifications
- `/create-tasks` - Generate task breakdowns
- `/execute-tasks` - Execute implementation
- `/analyze-market` - 🆕 Market research and competitive analysis
- `/validate-business-case` - 🆕 Business viability validation
- `/create-design-system` - 🆕 Design system consistency

## Quick Start Strategic Workflow:
1. `/validate-business-case "Feature idea"` - Validate before building
2. `/create-spec "Feature name"` - Create enhanced spec with UX + market research
3. `/create-tasks` - Generate implementation tasks
4. `/execute-tasks` - Build with strategic context

## Configuration:
- **Current mode**: `solo_engineer` (strategic features enabled)
- **Change to**: `default` in config.yml for original Agent OS behavior
- **Upgrade to**: `startup_cto` for full competitive monitoring

Your project is now equipped for strategic, data-driven development! 🚀
README_EOF

print_status "Project documentation created"

echo ""
echo "========================================="
print_status "Enhanced Agent OS Installation Complete!"
echo "========================================="
echo ""
print_info "Project structure created:"
echo "   • Complete Agent OS framework with all core workflows"
echo "   • 3 strategic agents for market research, UX design, business strategy"  
echo "   • Enhanced commands for strategic development"
echo "   • Solo engineer optimizations and best practices"
echo ""
print_warning "IMPORTANT: Complete the installation by copying artifact content!"
echo "   • See .agent-os/README.md for detailed instructions"
echo "   • All placeholder files need actual content from artifacts"
echo ""
print_info "Test your installation:"
echo '   /plan-product "My awesome product"'
echo '   /analyze-market "Your market opportunity"'
echo '   /validate-business-case "Feature idea"'
echo ""
print_status "Enhanced Agent OS ready for strategic development! 🚀"


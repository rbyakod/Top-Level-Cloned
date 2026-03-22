# CI/CD Pipeline Setup

**Use this when:** You need to set up automated build, test, and deployment pipelines for your project.

**Skill Level:** Intermediate to Advanced

---

## Copy This Prompt:

```
I need help setting up a CI/CD pipeline for my project. Please help me design and implement automated build, test, and deployment workflows.

## Project Context:
- **Project Type**: [Web app, API, mobile app, library, etc.]
- **Technology Stack**: [Languages, frameworks, build tools]
- **Repository**: [GitHub, GitLab, Bitbucket, etc.]
- **Deployment Target**: [AWS, Azure, Google Cloud, Vercel, Heroku, self-hosted, etc.]
- **Team Size**: [Solo developer, small team, large team]

## Current State:
- **Existing Setup**: [What CI/CD, if any, do you currently have?]
- **Build Process**: [How do you currently build and test?]
- **Deployment Process**: [How do you currently deploy?]
- **Pain Points**: [What manual steps are you trying to automate?]

## Requirements:
- **Automation Goals**: [What processes need to be automated?]
- **Environments**: [Development, staging, production, etc.]
- **Testing Requirements**: [Unit tests, integration tests, e2e tests]
- **Security Requirements**: [Secret management, security scanning, etc.]
- **Performance Requirements**: [Build speed, deployment speed]

## CI/CD Pipeline Design:

Please create a comprehensive CI/CD setup that includes:

### 1. Pipeline Strategy
- Recommend the best CI/CD platform for your setup
- Design the overall pipeline architecture
- Explain branching strategy and workflows
- Define environment promotion strategy

### 2. Build Pipeline
- Automated build configuration
- Dependency management and caching
- Build optimisation strategies
- Artifact generation and storage

### 3. Testing Pipeline
- Automated test execution (unit, integration, e2e)
- Test parallelisation and optimisation
- Code coverage reporting
- Test result notifications

### 4. Security & Quality
- Security vulnerability scanning
- Code quality checks and linting
- Dependency vulnerability scanning
- Static analysis tools integration

### 5. Deployment Pipeline
- Deployment strategies (blue-green, rolling, canary)
- Environment-specific configurations
- Database migration handling
- Rollback procedures

### 6. Monitoring & Notifications
- Build and deployment notifications
- Performance monitoring setup
- Error tracking and alerting
- Dashboard and reporting

### 7. Configuration Files
Provide complete, ready-to-use configuration files for:
- CI/CD platform configuration (GitHub Actions, GitLab CI, etc.)
- Build scripts and commands
- Environment variable management
- Deployment configurations

### 8. Best Practices
- Pipeline security best practices
- Performance optimisation tips
- Troubleshooting common issues
- Scaling considerations

## Specific Deliverables:
- Complete CI/CD configuration files
- Step-by-step setup instructions
- Environment setup guide
- Security configuration checklist
- Troubleshooting guide

Please provide practical, production-ready configurations that can be implemented immediately.
```

---

## Tips for Better Results:

- **Specify your current tools** and any constraints you have
- **Include your deployment frequency** - daily, weekly, on-demand
- **Mention compliance requirements** - SOC2, GDPR, etc.
- **Be clear about your infrastructure** - cloud provider, on-premise, hybrid
- **Include any existing automation** that needs to be integrated 
# Environment Configuration Assistant

**Use this when:** You need to set up and manage configuration across different environments (development, staging, production).

**Skill Level:** Intermediate to Advanced

---

## Copy This Prompt:

```
I need help setting up comprehensive environment configuration management for my application. Please help me design a robust system for managing settings across different environments.

## Project Context:
- **Application Type**: [Web app, API, microservice, mobile backend, etc.]
- **Technology Stack**: [Languages, frameworks, deployment platforms]
- **Environments Needed**: [Development, staging, production, testing, etc.]
- **Deployment Platform**: [AWS, Azure, Google Cloud, Vercel, Heroku, self-hosted]
- **Team Size**: [Solo, small team, large team]

## Current Configuration:
[Describe your current configuration setup, if any]

## Configuration Requirements:
- **Database Settings**: [Connection strings, credentials, etc.]
- **API Keys**: [Third-party services, payment processors, etc.]
- **Feature Flags**: [A/B testing, gradual rollouts, etc.]
- **Security Settings**: [CORS, rate limiting, encryption keys]
- **Performance Settings**: [Caching, connection pools, timeouts]

## Environment Configuration Strategy:

Please create a comprehensive configuration management system that includes:

### 1. Configuration Architecture
- Overall configuration strategy and principles
- Environment hierarchy and inheritance
- Configuration file structure and organization
- Secret management approach

### 2. Environment Definitions
Design configurations for:
- **Development Environment**
  - Local development settings
  - Debug configurations
  - Development database and services
  - Hot reload and development tools

- **Staging Environment**
  - Production-like configuration
  - Test data and scenarios
  - Integration testing setup
  - Performance testing configuration

- **Production Environment**
  - Optimized performance settings
  - Security hardening
  - Monitoring and logging
  - Backup and disaster recovery

### 3. Configuration Management
- **Environment Variables**: Secure variable management
- **Configuration Files**: Structured config files (JSON, YAML, etc.)
- **Secret Management**: Secure handling of sensitive data
- **Runtime Configuration**: Dynamic configuration loading
- **Configuration Validation**: Ensuring valid configurations

### 4. Secrets and Security
- **API Key Management**: Secure storage and rotation
- **Database Credentials**: Connection string security
- **Encryption Keys**: Key management and rotation
- **Certificate Management**: SSL/TLS certificate handling
- **Access Control**: Who can modify configurations

### 5. Feature Flags and Toggles
- **Feature Flag System**: Enabling/disabling features by environment
- **Gradual Rollouts**: Percentage-based feature deployment
- **A/B Testing Configuration**: Experiment configuration
- **Emergency Toggles**: Quick feature disable capabilities

### 6. Database Configuration
- **Connection Management**: Pool sizes, timeouts, SSL
- **Migration Configuration**: Database schema management
- **Backup Settings**: Automated backup configuration
- **Read/Write Splitting**: Database routing configuration

### 7. External Service Configuration
- **API Endpoints**: Different endpoints per environment
- **Service Credentials**: Authentication for external services
- **Rate Limiting**: API call limits and throttling
- **Timeout Configuration**: Service call timeouts
- **Retry Logic**: Failure handling and retries

### 8. Monitoring and Logging
- **Log Levels**: Different verbosity per environment
- **Monitoring Services**: APM and metrics configuration
- **Alert Configuration**: Error and performance alerts
- **Analytics**: Usage tracking and analytics setup

### 9. Performance Configuration
- **Caching Strategy**: Redis, in-memory caching settings
- **CDN Configuration**: Content delivery network setup
- **Resource Limits**: Memory, CPU, connection limits
- **Optimization Settings**: Compression, minification, etc.

### 10. Deployment Configuration
- **Build Settings**: Environment-specific build configuration
- **Container Configuration**: Docker/Kubernetes settings
- **Infrastructure as Code**: Terraform, CloudFormation templates
- **CI/CD Variables**: Pipeline-specific configuration

## Implementation Examples:

Please provide:
- **Configuration file examples** for each environment
- **Environment variable templates** with descriptions
- **Secret management setup** (AWS Secrets Manager, Azure Key Vault, etc.)
- **Feature flag implementation** examples
- **Configuration loading code** examples

## Best Practices:
- Configuration validation and error handling
- Documentation and change management
- Backup and recovery procedures
- Security scanning and compliance
- Configuration drift detection and remediation

## Tools and Integrations:
- Recommend configuration management tools
- Secret management service integration
- Feature flag service recommendations
- Monitoring and alerting setup
- Documentation and change tracking

## Migration Strategy:
If I have existing configuration:
- How to migrate to the new system
- Backwards compatibility considerations
- Rollback procedures
- Testing the new configuration system

Please provide specific, implementable examples that I can use immediately across all my environments.
```

---

## Tips for Better Results:

- **List all your environments** - including any special ones like QA, demo
- **Include your deployment pipeline** - how code moves between environments
- **Mention compliance requirements** - SOC2, GDPR, industry-specific
- **Specify your cloud provider** - for platform-specific recommendations
- **Include team access patterns** - who needs access to what configurations 
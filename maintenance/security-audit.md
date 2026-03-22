# Security Audit Assistant

**Use this when:** You need to identify security vulnerabilities and improve the security posture of your application.

**Skill Level:** Intermediate to Advanced

---

## Copy This Prompt:

```
I need a comprehensive security audit of my application. Please help me identify vulnerabilities, security risks, and provide recommendations for improving security.

## Application Context:
- **Application Type**: [Web app, API, mobile app, desktop app, etc.]
- **Technology Stack**: [Languages, frameworks, databases, cloud services]
- **User Base**: [Public-facing, internal, enterprise, etc.]
- **Data Sensitivity**: [Personal data, financial, healthcare, etc.]
- **Compliance Requirements**: [GDPR, HIPAA, SOC2, PCI-DSS, etc.]

## Current Security Measures:
[Describe any existing security measures - authentication, encryption, monitoring, etc.]

## Code/Architecture to Audit:
[PASTE YOUR CODE OR DESCRIBE THE SYSTEM ARCHITECTURE]

## Security Audit Request:

Please conduct a thorough security assessment covering:

### 1. Authentication & Authorization
- Review authentication mechanisms
- Assess authorization controls and access management
- Check for privilege escalation vulnerabilities
- Evaluate session management security
- Review password policies and storage

### 2. Input Validation & Data Security
- Identify input validation vulnerabilities
- Check for injection attacks (SQL, XSS, LDAP, etc.)
- Assess data sanitization and encoding
- Review file upload security
- Evaluate data validation on client and server

### 3. Data Protection
- Review data encryption at rest and in transit
- Assess sensitive data handling and storage
- Check for data leakage vulnerabilities
- Evaluate backup and recovery security
- Review data retention and deletion policies

### 4. Network & Infrastructure Security
- Assess network security configurations
- Review API security and rate limiting
- Check for insecure direct object references
- Evaluate CORS and CSP policies
- Review SSL/TLS configuration

### 5. Application Security
- Identify business logic vulnerabilities
- Check for insecure cryptographic practices
- Review error handling and information disclosure
- Assess logging and monitoring security
- Evaluate third-party dependency security

### 6. Configuration & Deployment Security
- Review security configurations
- Check for default credentials and settings
- Assess environment variable security
- Review deployment pipeline security
- Evaluate infrastructure as code security

## Security Assessment Report:

Please provide:

### Critical Vulnerabilities
- High-risk security issues requiring immediate attention
- Potential impact and exploitation scenarios
- Specific remediation steps with code examples

### Major Security Concerns
- Important security improvements needed
- Risk assessment and prioritization
- Recommended security enhancements

### Security Best Practices
- General security improvements
- Industry standard recommendations
- Preventive measures for future development

### Compliance Considerations
- Compliance gaps for mentioned regulations
- Required security controls
- Documentation and audit trail requirements

### Security Testing Recommendations
- Suggested security testing approaches
- Tools and techniques for ongoing security assessment
- Automated security scanning integration

### Monitoring & Incident Response
- Security monitoring recommendations
- Incident response planning
- Alerting and notification strategies

## Specific Focus Areas:
Please pay special attention to:
- [Any specific security concerns you have]
- [Recent security incidents or vulnerabilities you've heard about]
- [Specific compliance requirements you need to meet]

## Deliverables Requested:
- Prioritized list of security issues
- Specific remediation code examples
- Security checklist for ongoing maintenance
- Recommendations for security tools and processes

Please be thorough but practical, focusing on actionable security improvements that provide the most security value.
```

---

## Tips for Better Results:

- **Include your full system architecture** - not just code snippets
- **Mention specific compliance requirements** your industry requires
- **Be clear about data types** you handle (PII, financial, etc.)
- **Include your current security measures** to avoid duplicate recommendations
- **Specify your risk tolerance** and security budget constraints
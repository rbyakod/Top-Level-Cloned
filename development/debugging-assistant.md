# Systematic Debugging Assistant

**Use this when:** You're facing a bug or error that you need help diagnosing and fixing.

**Skill Level:** Beginner to Advanced

---

## Copy This Prompt:

```
I'm encountering a bug/error in my code and need help debugging it systematically. Here's the information:

## Problem Description:
- **What's happening**: [Describe the current behavior]
- **What should happen**: [Describe the expected behavior]
- **Error messages**: [Include any error messages, stack traces, or logs]
- **When it occurs**: [Specific conditions, user actions, or data that trigger it]

## Code Context:
[PASTE THE RELEVANT CODE OR DESCRIBE THE FILES INVOLVED]

## Environment:
- **Technology stack**: [Languages, frameworks, versions]
- **Environment**: [Development, staging, production]
- **Recent changes**: [Any recent code changes, deployments, or updates]

## What I've Tried:
[List any debugging steps you've already attempted]

## Debugging Request:

Please help me debug this systematically by:

### 1. Problem Analysis
- Analyse the error message and code to identify potential root causes
- Explain what the error means in plain language
- Identify the most likely culprits based on the symptoms

### 2. Debugging Strategy
- Suggest a step-by-step debugging approach
- Recommend specific debugging techniques or tools
- Prioritise the most promising debugging paths

### 3. Code Investigation
- Point out suspicious code sections that might cause this issue
- Identify potential logic errors, race conditions, or edge cases
- Suggest specific places to add logging or breakpoints

### 4. Testing & Verification
- Recommend ways to reproduce the issue consistently
- Suggest test cases that might reveal the root cause
- Propose methods to verify the fix works

### 5. Solution Options
- Provide multiple potential fixes with explanations
- Explain the pros and cons of each approach
- Recommend the best solution and why

### 6. Prevention Strategies
- Suggest how to prevent similar issues in the future
- Recommend defensive coding practices
- Propose additional testing or monitoring

## Additional Questions:
If you need more information to help debug effectively, please ask specific questions about:
- Code structure or data flow
- Environment setup or configuration
- User input or data scenarios
- System state or timing issues

Please be thorough but start with the most likely causes first.
```

---

## Tips for Better Results:

- **Include complete error messages** with stack traces if available
- **Share relevant code context** - not just the line that errors
- **Describe your debugging attempts** so AI doesn't repeat them
- **Mention timing** - does it happen always, sometimes, or under specific conditions?
- **Include sample data** that triggers the issue if relevant 
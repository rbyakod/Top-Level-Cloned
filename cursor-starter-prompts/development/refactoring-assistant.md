# Code Refactoring Assistant

**Use this when:** You have working code that needs to be improved, cleaned up, or restructured.

**Skill Level:** Intermediate to Advanced

---

## Copy This Prompt:

```
I have working code that needs refactoring to improve its quality, maintainability, and/or performance. Please help me systematically refactor this code.

## Current Code:
[PASTE YOUR CODE HERE]

## Refactoring Goals:
Please check the goals that apply to your situation:
- [ ] Improve code readability and clarity
- [ ] Reduce code duplication
- [ ] Improve performance
- [ ] Better error handling
- [ ] Enhance testability
- [ ] Follow better design patterns
- [ ] Reduce complexity
- [ ] Improve maintainability
- [ ] Better separation of concerns
- [ ] [Other specific goals]

## Context:
- **What the code does**: [Brief description of functionality]
- **Current pain points**: [What's problematic about the current code?]
- **Constraints**: [Any limitations - can't change interfaces, need backward compatibility, etc.]
- **Performance requirements**: [Any specific performance needs]

## Refactoring Analysis:

Please provide:

### 1. Code Assessment
- Identify specific code smells and issues
- Highlight areas that need the most attention
- Explain why these areas are problematic

### 2. Refactoring Strategy
- Suggest a step-by-step refactoring plan
- Prioritise changes by impact and risk
- Recommend which refactorings to do first

### 3. Specific Improvements
For each problematic area, provide:
- **Current code snippet**
- **Refactored version**
- **Explanation** of what was improved and why
- **Benefits** of the change

### 4. Design Pattern Opportunities
- Identify where design patterns could improve the code
- Suggest specific patterns and how to implement them
- Explain the benefits of each pattern

### 5. Testing Strategy
- Recommend how to test the refactored code
- Suggest ways to ensure behavior hasn't changed
- Identify areas that need additional test coverage

### 6. Migration Plan
- If this is a large refactoring, suggest how to do it incrementally
- Identify potential breaking changes
- Recommend rollback strategies

### 7. Performance Implications
- Highlight any performance impacts (positive or negative)
- Suggest performance improvements
- Recommend benchmarking approaches

Please focus on practical, actionable improvements that provide clear benefits. Explain the reasoning behind each suggested change.
```

---

## Tips for Better Results:

- **Include the full context** of what the code does
- **Specify your constraints** - what can and cannot be changed
- **Mention your codebase patterns** - existing conventions to follow
- **Be clear about priorities** - readability vs performance vs maintainability
- **Include related code** that might be affected by changes 
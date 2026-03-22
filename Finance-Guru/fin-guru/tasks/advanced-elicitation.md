<!-- Finance Guru adaptation of BMAD advanced-elicitation -->

# Finance Guru Advanced Elicitation Task

## Purpose

- Deepen understanding of client objectives, risk tolerances, and constraints before committing to strategies.
- Stress-test drafts of reports, models, or recommendations from multiple financial perspectives.
- Ensure compliance, risk, and tax considerations are surfaced before finalizing deliverables.

## When to Use

1. **During template-driven document creation** – after presenting a section, invite the client to explore different analytical lenses.
2. **In free-form conversations** – whenever the user says "review this", "pressure-test", or requests more rigorous questioning.

## Method Selection Framework

Before listing options, analyze:

- **Goal Alignment** – long-term wealth building vs. tactical trade
- **Risk Profile** – conservative income vs. aggressive growth/margin
- **Regulatory Sensitivity** – jurisdictions, disclosures, compliance needs
- **Data Confidence** – real-time market data vs. user-supplied assumptions
- **Artifact Impact** – educational explainer vs. board-ready deliverable

### Core Finance Methods (always include at least 4)

- Expand or Contract for Audience (retail vs. institutional)
- Critique Quantitative Robustness (are risk metrics sufficient?)
- Identify Compliance & Fiduciary Risks
- Assess Alignment with Stated Objectives

### Contextual Enhancements (choose remaining slots)

- Scenario Pressure Test (bull/base/bear stress)
- Margin Buffer Audit (leverage resilience)
- Dividend Sustainability Review (coverage, growth runway)
- Cash-Flow Resilience Check (sequencing & liquidity)
- Tax Drag Optimization (placement, harvest, brackets)
- Strategy Trade-off Debate (margin vs. income vs. growth)

### Menu Presentation Format

Whenever advanced elicitation is triggered, present:

```text
**Finance Guru Advanced Elicitation**
Choose a number (0-8) or 9 to proceed:
0. Expand or Contract for Audience
1. Critique Quantitative Robustness
2. Identify Compliance & Fiduciary Risks
3. Assess Alignment with Stated Objectives
4. Scenario Pressure Test
5. Margin Buffer Audit
6. Dividend Sustainability Review
7. Cash-Flow Resilience Check
8. Tax Drag Optimization
9. Proceed / No Further Actions
```

- Option numbers can be remapped to fit context, but keep `9` as "Proceed".
- When a method is not relevant, replace with another from the contextual list and explain why.

## Execution Guidance

1. **Provide Section Summary** – recap what was drafted (e.g., "Quant section covers Sharpe, Sortino, 3-scenario VaR").
2. **Clarify Scope** – mention whether elicitation can target the whole section or a specific element (e.g., VaR table).
3. **Wait for Selection** – do not proceed without explicit user choice or feedback.
4. **Apply Method** – pull supporting prompts from Finance Guru knowledge base and strategy documents.
   - For risk-focused methods, reference `risk-framework.md` and system prompt assessments.
   - For compliance methods, cite `compliance-policy.md` disclaimers and data handling rules.
   - For strategy-specific reviews, use margin/dividend/cash-flow checklists.
5. **Report Findings** – deliver concise insights, flag data gaps, and recommend adjustments.
6. **Re-offer Menu** – continue until user selects option 9 or directs to move on.

## Response Handling

- If the user gives direct edits instead of a menu number, apply changes, summarize impact, then re-offer the menu.
- Escalate to orchestrator when conflicting requirements emerge (e.g., high leverage request vs. risk tolerance).
- Document key decisions or unresolved questions so follow-up agents (quant, compliance) can act.

## Tone & Compliance

- Maintain mentor-like, professional tone. Highlight educational purpose.
- Remind user when assumptions rely on stale data or need verification.
- Flag if any request would violate compliance policy or tool limitations.

<!-- Finance Guru adaptation of BMAD create-deep-research-prompt -->

# Create Finance Guru Deep Research Prompt

Generate structured research prompts tailored to finance engagements. Leverage system prompt modes (research, code-execution) and strategy files to define scope, methodology, and deliverables.

## Purpose

- Clarify research objectives across macro, security-level, regulatory, or strategy topics
- Specify data sources, cadence, and validation requirements
- Align research outputs with Finance Guru workflows and compliance policy

## Research Focus Selection

Present options and help the user choose the most applicable focus:

1. **Macro & Market Regime Scan** – rates, volatility regimes, liquidity drivers
2. **Security & Peer Deep Dive** – fundamentals, valuation comparables, technicals
3. **Strategy Validation** – dividend, margin, or cash-flow hypotheses stress tests
4. **Risk & Compliance Review** – regulatory landscape, margin rules, policy shifts
5. **Portfolio Diagnostics** – allocation health, diversification, factor exposures
6. **Custom Finance Research** – user-defined scope (document their request verbatim)

If multiple focuses apply, prioritize the one that unlocks downstream decisions first, then schedule secondary prompts.

## Input Processing

- **Existing Documents**: Summarize relevant insights from `/finance/financial-strategies/` and prior outputs.
- **User Briefs**: Extract objectives, constraints, timelines, and required deliverables.
- **Data Gaps**: Flag missing rates, spreads, coverage ratios, or filings that must be researched.

## Prompt Structure

Collaboratively build the prompt with these sections:

### A. Research Objectives

- Primary decision or deliverable supported
- Metrics or thresholds that define success
- Constraints (risk tolerance, margin buffer, policy deadlines)

### B. Key Questions

Split into **Must Answer** vs. **Supporting Insights**.
- Include quantitative metrics (e.g., Sharpe target, payout ratio floor)
- Tie questions to Finance Guru strategy frameworks

### C. Data & Sources

- Preferred tools (Exa, web search, filings, APIs)
- Historical windows and update frequency
- Source credibility criteria; cite if regulatory approval needed

### D. Analytical Methods

- Frameworks to apply (VaR, scenario analysis, factor decomposition)
- Required models or calculations (Monte Carlo, dividend coverage trend)
- Stress scenarios (2008/2020 analogues, rate shocks, margin call triggers)

### E. Deliverables & Format

- Expected outputs (memo, Excel model, PPT deck)
- Required sections (Executive summary, sources & assumptions, recommendations)
- Compliance reminders (educational only, cite sources with timestamps)

### F. Timeline & Handoff

- Urgency and cadence (one-off vs. rolling updates)
- Agents responsible for execution (market researcher, quant analyst, compliance officer)
- Checkpoints for validation or approvals

## Example Prompt Skeleton

```markdown
## Research Objective
[Clear statement tied to decision]

## Background Context
[Summary of current market state, user constraints, existing assumptions]

## Key Questions
### Must Answer
1. ...
### Supporting Insights
1. ...

## Data & Sources
- Tools: Exa, web-search-tool, regulatory filings
- Time Horizon: e.g., last 3 earnings cycles
- Credibility Requirements: cite sources with timestamps

## Analytical Methods
- Scenario set: bull/base/bear with key drivers
- Risk metrics: VaR 95/99, drawdown, liquidity checks
- Strategy lenses: margin buffer, dividend sustainability, cash-flow sequencing

## Deliverables
- Format: PDF briefing + Excel model tabs (Inputs, Calculations, Scenarios, Risk, Outputs)
- Include compliance disclaimer block
- Add Sources & Assumptions appendix

## Timeline & Ownership
- Due date / cadence
- Responsible agent(s)
- Review checkpoints with Compliance Officer
```

## Final Checks

- Confirm user agreement on scope and deliverables.
- Offer to trigger the Market Researcher or Quant Analyst agent with the generated prompt.
- Store prompt in `/finance/outputs/` if the user requests archival.
- Remind user results remain educational and should be reviewed by licensed professionals.

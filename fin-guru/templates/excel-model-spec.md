---
title: "Finance Guru Excel Model Specification"
description: "Template for building Finance Guru-compliant Excel workbooks"
version: 1.0.0
artifact: xlsx
---

## Model Overview

- **Project / Strategy:** <!-- describe focus (e.g., dividend ladder, margin overlay) -->
- **Objective:** <!-- what decision the model informs -->
- **Key Assumptions Timestamp:** <!-- date/time of rates, spreads, etc. -->
- **Data Sources:** <!-- cite with URLs + dates -->

## Workbook Structure

| Tab | Purpose | Required Elements |
| --- | --- | --- |
| Inputs | Capture user-controlled drivers | Data validation lists, scenario toggles (bull/base/bear), color-coded input cells |
| Calculations | Core math and intermediate schedules | Transparent formulas, named ranges, separation of logic and outputs |
| Scenarios | Sensitivity & scenario library | Scenario manager table, tornado chart inputs, key driver overrides |
| Risk | Risk management analytics | VaR 95/99, drawdown, stress cases (2008/2020 analogues), margin call thresholds |
| Outputs | Present results for stakeholders | KPI dashboard, charts (line/bar, histogram, waterfall), summary table ready for copy to PPT |
| Sources & Assumptions | Compliance tracking | Data sources with timestamps, tax rates, fees, limitations, disclaimers |

_Add extra tabs (e.g., Audit, Helper) if needed but maintain clear documentation._

## Quality Standards

- [ ] No hard-coded outputs; formulas recalc when inputs change
- [ ] No circular references unless intentional and documented with toggle switch
- [ ] Use named ranges for major drivers and results
- [ ] Separate inputs (blue) vs. calculations (black) vs. outputs (green)
- [ ] Provide cell comments or legend for non-obvious formulas

## Scenario & Sensitivity Requirements

- Include at least three scenarios (Bull, Base, Bear) referencing macro assumptions (rates, inflation, spreads)
- Provide sensitivity table for primary drivers (e.g., dividend growth vs. payout ratio, margin rate vs. leverage)
- Document how to adjust scenario weights or add new cases

## Risk & Compliance Checks

- Calculate VaR at 95% & 99% across relevant horizons (1d/1w/1m)
- Model stress cases referencing system prompt shocks (2008/2020 analogues)
- Show maintenance vs. available margin buffer if leverage involved (≥2× requirement)
- Highlight liquidity metrics (ADV, spreads) when applicable
- Include compliance disclaimer block on Outputs tab:
  - "Educational analysis; not personalized investment advice."
  - "Past performance does not guarantee future results."
  - "Consult a licensed advisor before acting."

## Documentation & Handoff

- Provide step-by-step usage guide (3-5 bullets) on Outputs tab
- List outstanding data gaps or assumptions needing validation
- Specify next review date / monitoring cadence
- Link to related deliverables (presentation, report) if applicable

<!-- Finance Guru adaptation of BMAD execute-checklist -->

# Finance Guru Checklist Execution Task

This workflow validates Finance Guru deliverables against the risk, compliance, and quality guardrails defined in the system prompt and knowledge base. Use it whenever a user asks to "run a checklist" or requests sign-off on an analysis, model, or presentation.

## Available Finance Checklists

Checklists live under `{project-root}/fin-guru/checklists/`.

- `analyst-checklist.md` – end-to-end research → quant → strategy quality gates
- `margin-strategy.md` – leverage buffers, financing cost coverage, forced-liquidation modelling
- `dividend-framework.md` – yield sustainability, coverage ratios, distribution pacing
- `cashflow-policy.md` – cash management cadence, diversification buffers, risk triggers

If the user does not specify which checklist to run, list these options (plus any new ones added later) and help them choose the most relevant scope. For composite deliverables run the analyst checklist first, then any strategy-specific list that applies.

## Execution Steps

1. **Confirm Checklist & Mode**
   - Fuzzy match the requested checklist name to available files. Clarify if multiple matches exist.
   - Ask whether the user wants to process:
     - `interactive` mode – section by section with pauses for guidance, or
     - `summary` mode – run through everything and deliver a consolidated report.
   - Log the choice in the session transcript so the orchestrator can reference it later.

2. **Gather Inputs & Artifacts**
   - Each checklist header lists required artifacts. Typical sources include:
     - Draft analysis report or briefing memo under `/finance/reports/`
     - Excel models from the modeling phase (`/finance/models/`)
     - Research notes and citation packs (`/finance/outputs/`)
   - If artifacts are missing, pause and request them before continuing. Remind the user the review cannot complete without the right files.

3. **Run Section Checks**
   - Follow the order given in the checklist. For every item:
     - Read the referenced Finance Guru resource (knowledge base, strategy docs, compliance policy).
     - Verify evidence exists in the deliverable. Distinguish between **explicit** proof (e.g., VaR table present) and **implicit** coverage (e.g., risk statement referencing VaR results).
     - Record outcome using:
       - ✅ PASS – requirement fully satisfied
       - ❌ FAIL – requirement missing or incorrect
       - ⚠️ PARTIAL – incomplete or needs revision
       - N/A – not applicable; include justification tied to user scope
   - Highlight finance-critical controls:
     - Research → Quant handoff maintains cited/timestamped data
     - Margin buffers meet ≥2× maintenance per system prompt
     - Output policy applied (sources, assumptions, limitations block)
     - Compliance disclaimers present verbatim

4. **Interactive Guidance (if in interactive mode)**
   - After each section share a short summary: pass rate, major risks, and required fixes.
   - Offer to dive deeper into failed items or demonstrate how to remediate using Finance Guru tasks (e.g., rerun quantitative-analysis, request compliance-review).
   - Wait for user confirmation before advancing.

5. **Summary Mode Reporting**
   - Compile a single report covering:
     - Overall pass rate
     - Section-by-section table of PASS/FAIL/PARTIAL counts
     - Detailed notes for every ❌ or ⚠️ item with remediation guidance referencing Finance Guru workflows
     - Disclaimers reminding results are educational per compliance policy
   - Suggest next steps (e.g., "rerun margin stress scenarios", "update report template to include assumptions block").

6. **Final Sign-Off**
   - Confirm with the user whether corrections are needed immediately or should be logged for later.
   - Offer to hand off to the Compliance Officer agent for a final disclaimer sweep if applicable.
   - Archive findings in the chosen output file or knowledge base location when requested.

## Best Practices

- Always cite the checklist section name when flagging issues so the user can map findings back quickly.
- Note any missing data, outdated market figures, or unverified assumptions as separate compliance risks.
- Reinforce that Finance Guru deliverables are educational and should be reviewed by a licensed professional before implementation.

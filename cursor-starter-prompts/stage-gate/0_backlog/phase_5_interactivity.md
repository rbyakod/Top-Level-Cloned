# Phase 5: Interactivity & Data Binding

**Goal:** Implement dynamic dashboard interactions, data fetching, and filtering capabilities.

**Tasks:**

*   [ ] **Configure Drag-and-Drop & Resize:**
    *   [ ] Set up `react-grid-layout` configuration for dragging and resizing widgets.
    *   [ ] Implement state management for layout changes.
    *   [ ] Create functions to persist layout changes to local storage/backend.
*   [ ] **Implement Data Binding:**
    *   [ ] Connect widgets to tRPC procedures/API routes for F1 data.
    *   [ ] Create widget data fetching hooks based on widget configuration.
    *   [ ] Add loading states/skeletons for widgets during data fetching:
        *   [ ] `pnpm dlx shadcn@latest add skeleton`
    *   [ ] Handle error states for data fetching issues.
*   [ ] **Create Global Filters & Variables:**
    *   [ ] Design and implement filter UI in dashboard header/sidebar:
        *   [ ] Season filter (dropdown)
        *   [ ] Team filter (dropdown)
        *   [ ] Driver filter (dropdown)
        *   [ ] Track filter (dropdown)
    *   [ ] Implement filter state management (e.g., React Context).
    *   [ ] Integrate filters with widget data fetching.
    *   [ ] Example: Filtering by "2023 Season" should update all relevant widgets.

*Reference: Steps 12-14 in project_plan_steps.md* 
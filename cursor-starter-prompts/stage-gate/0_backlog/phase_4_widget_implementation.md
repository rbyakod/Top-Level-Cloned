# Phase 4: Widget Implementation

**Goal:** Create the core widget components and configuration UI for the dashboard.

**Tasks:**

*   [ ] **Develop Widget Components:**
    *   [ ] Create base Widget wrapper component.
    *   [ ] Implement specific widget types:
        *   [ ] Bar Chart Widget (`src/components/widgets/BarChartWidget.tsx`)
        *   [ ] Line Chart Widget (`src/components/widgets/LineChartWidget.tsx`) 
        *   [ ] Stat Card Widget (`src/components/widgets/StatCardWidget.tsx`)
        *   [ ] Data Table Widget (`src/components/widgets/DataTableWidget.tsx`)
    *   [ ] Ensure all widgets use shadcn's `Card` components as base containers.
*   [ ] **Implement Dynamic Widget Rendering:**
    *   [ ] Create `WidgetRegistry` to map widget types to components.
    *   [ ] Implement logic to fetch dashboard layout (initially hardcoded/local storage).
    *   [ ] Render widgets dynamically based on layout configuration.
*   [ ] **Create Widget Configuration UI:**
    *   [ ] Implement configuration dialog/sheet UI for widget settings.
    *   [ ] Create form elements for data source selection, dimensions, metrics.
    *   [ ] Enable chart type selection where applicable.
    *   [ ] Add F1-specific configuration options (e.g., select drivers, teams, seasons).

*Reference: Steps 9-11 in project_plan_steps.md* 
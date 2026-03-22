# Project Plan Steps: PowerBI-like F1 Dashboard

This document outlines the steps to build a simplified PowerBI-like dashboard application using an existing T3 stack (Next.js, TypeScript, Tailwind CSS), focusing on a Formula 1 data example using a local JSON dataset.

**Core Technologies:**

*   **Framework:** Next.js (App Router) - *Existing T3 Setup*
*   **Language:** TypeScript - *Existing T3 Setup*
*   **Styling:** Tailwind CSS - *Existing T3 Setup*
*   **UI Components:** shadcn/ui
*   **Data Handling:** Local JSON File (`docs/dataset/f1_data.json`)
*   **Potential Backend:** Next.js API Routes or tRPC - *Existing T3 Setup (likely tRPC)*
*   **Package Manager:** pnpm

**Phase 1: Project Setup & Foundation**

1.  **Verify T3 Project Setup:**
    *   Ensure the current T3 project structure is ready (Next.js, TypeScript, Tailwind, tRPC/API Routes).
    *   Confirm necessary base configurations are in place.
2.  **Setup shadcn/ui:**
    *   If not already done, integrate shadcn/ui.
    *   Command: `pnpm dlx shadcn@latest init` (Follow prompts for configuration).
3.  **Project Structure Review:**
    *   Review the existing T3 structure (`src/app`, `src/components`, `src/lib`, `src/server/api` etc.). Adapt if necessary for dashboard-specific components/logic. Refer to Next.js best practices ([https://nextjs.org/docs/app/getting-started/project-structure](https://nextjs.org/docs/app/getting-started/project-structure)).
4.  **Install Core Dependencies:**
    *   Add libraries for charting and drag-and-drop functionality.
    *   Example: `pnpm add recharts` (or other charting library) ; `pnpm add react-grid-layout @types/react-grid-layout` (or similar).

**Phase 2: Data Preparation & Backend Logic**

5.  **Create Local F1 Dataset:**
    *   Create a new file: `docs/dataset/f1_data.json`.
    *   Populate this file with mock F1 data (drivers, teams, race results, track info, seasons, etc.). Structure it logically for easy parsing.
    *   *Example Structure:* Could be an object with keys like `drivers`, `teams`, `races`, where `races` is an array of objects containing results and linking to driver/team IDs.
6.  **Backend API/Procedures:**
    *   Set up tRPC procedures or API routes for:
        *   Fetching dashboard layout configuration (initially maybe hardcoded or from another simple JSON/local storage).
        *   Saving/updating dashboard layout configuration (to local storage or a simple file for persistence during development).
        *   Fetching data *from* the `f1_data.json` file based on widget configurations and filters.
    *   *F1 Example:* A procedure `getF1Results(input: { driverId?: string; trackId?: string; season?: number })` would read `f1_data.json`, filter based on input, and return the relevant data.

**Phase 3: Core Dashboard UI**

7.  **Dashboard Layout Component:**
    *   Create a main dashboard page (e.g., `src/app/dashboard/page.tsx` or `src/app/dashboard/[dashboardId]/page.tsx` if multiple dashboards are planned later).
    *   Implement `react-grid-layout` (or chosen alternative) for the main dashboard structure.
8.  **Add Required shadcn Components:**
    *   Install the necessary shadcn components for the core UI and widget interactions.
    *   Likely components:
        *   `button`: For actions like adding widgets, saving.
        *   `card`, `card-header`, `card-content`, `card-title`, `card-description`, `card-footer`: For structuring individual widgets.
        *   `dialog`: For widget configuration modals.
        *   `sheet`: Alternative for configuration sidebars.
        *   `dropdown-menu`: For filter selections, widget options.
        *   `select`: Simpler dropdowns for filters.
        *   `input`: For any text-based configuration.
        *   `label`: For form elements in configuration.
        *   `resizable`: Potentially useful for direct resizing handles if not using a grid library that handles it.
        *   `tooltip`: For hints or extra info.
        *   `table`, `table-header`, `table-body`, `table-row`, `table-head`, `table-cell`: For data table widgets.
        *   `separator`: Visual dividers.
    *   Command: `pnpm dlx shadcn@latest add button card dialog sheet dropdown-menu select input label resizable tooltip table separator` (Install as needed).

**Phase 4: Widget Implementation**

9.  **Widget Components:**
    *   Develop individual React components within `src/components/widgets/` (e.g., `BarChartWidget.tsx`, `StatCardWidget.tsx`, `DataTableWidget.tsx`).
    *   Use the chosen charting library (e.g., `recharts`) inside these components.
    *   Wrap widget content within shadcn `Card` components.
10. **Dynamic Widget Rendering:**
    *   Fetch the dashboard layout configuration (from local storage/file initially) and dynamically render the configured widgets onto the `react-grid-layout` based on stored positions/sizes.
11. **Widget Configuration UI:**
    *   Implement the configuration interface using shadcn `Dialog` or `Sheet`.
    *   Use components like `Select`, `Input`, `Label` for setting data source keys, dimensions, metrics, chart types etc.
    *   *F1 Example:* Configure a bar chart widget: Select 'races' as source, 'driver.name' as dimension, 'points' as metric.

**Phase 5: Interactivity & Data Binding**

12. **Drag-and-Drop & Resize:**
    *   Configure `react-grid-layout` to allow dragging and resizing.
    *   Implement callback functions (`onLayoutChange`) to capture position/size changes and update the layout state (and persist to local storage/file).
13. **Data Binding:**
    *   Connect widgets to the backend API/tRPC procedures.
    *   Widgets should call the procedures with their specific configuration to get data from the `f1_data.json`.
    *   Implement loading states using conditional rendering or shadcn `skeleton` component while data is fetched/processed.
    *   Command: `pnpm dlx shadcn@latest add skeleton`
14. **Filters & Variables:**
    *   Add global filter controls (e.g., shadcn `Select` or `DropdownMenu` for season, track, team) likely in the main dashboard layout, outside the grid.
    *   Pass filter state down to widgets or make it accessible via context/state management.
    *   *F1 Example:* Selecting '2023' in a Season dropdown triggers relevant widgets to refetch data, passing `season: 2023` to the backend procedure.

**Phase 6: Persistence & Refinement**

15. **Dashboard Saving (Local):**
    *   Implement a "Save Layout" button that persists the current grid layout (widget types, positions, sizes, configurations) to the browser's local storage or a simple backend endpoint that writes to a local file.
16. **Dashboard Loading (Local):**
    *   On page load, attempt to load the saved layout configuration from local storage/file.
17. **Refinement:**
    *   Add error handling (e.g., file not found, JSON parsing errors).
    *   Improve styling and responsiveness.
    *   Ensure smooth interaction between filters, widget configurations, and data display.

This updated plan focuses on using the local JSON dataset and integrates more tightly with the expected T3 and shadcn/ui setup. 
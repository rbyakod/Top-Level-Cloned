# Phase 2: Data Preparation & Backend Logic

**Goal:** Set up the local data source and backend procedures to access it.

**Tasks:**

*   [ ] **Create Local F1 Dataset:** Verify `docs/dataset/f1_data.json` exists and contains structured mock data (drivers, teams, races, etc.).
*   [ ] **Implement Backend API/Procedures (tRPC/API Routes):**
    *   [ ] Create endpoint/procedure to fetch dashboard layout configuration (initially hardcoded/local storage).
    *   [ ] Create endpoint/procedure to save/update dashboard layout configuration (to local storage/simple file).
    *   [ ] Create endpoint/procedure (`getF1Data`?) to read `f1_data.json` and filter based on input parameters (e.g., `driverId`, `trackId`, `season`).

*Reference: Steps 5-6 in project_plan_steps.md* 
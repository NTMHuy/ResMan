# Project Plan Generation Prompt

## Role

You are a Senior Product Manager, Project Manager, Business Analyst, and Software Delivery Planner.

Your task is to transform the existing project analysis and Feature Breakdown into a structured and realistic **Project Plan** for the Restaurant Management System.

The Project Plan must describe how the project should be organized and built from the current requirements analysis.

This document will become a primary input for:

**Step 8 — PRD Generation**

---

# Project

Project name:

**Xây dựng hệ thống quản lí nhà hàng**

The confirmed primary actors are:

* Customer
* Order Staff
* Kitchen Staff
* Warehouse Staff
* Manager

The project is intended to build a complete restaurant management system.

The project applies AI throughout the software development lifecycle to assist with:

* project analysis
* requirements analysis
* planning
* feature decomposition
* implementation
* testing
* review
* documentation

The product may also contain AI-powered features, including food recommendations based on customer ordering behavior.

---

# Input Documents

Before generating the Project Plan, read:

```text
docs/requirements/01-project-vision.md
docs/requirements/02-actor-analysis.md
docs/requirements/03-user-flows.md
docs/requirements/04-use-cases.md
docs/requirements/05-system-model.md
docs/requirements/06-feature-breakdown.md
```

The primary direct input is:

```text
docs/requirements/06-feature-breakdown.md
```

Use the previous documents to understand:

* project objectives
* actors
* user flows
* Use Cases
* System Areas
* Components
* Features
* priorities
* MVP scope
* dependencies

Do not contradict confirmed requirements.

---

# Main Objective

Create a Project Plan that transforms:

```text
Project Vision
        ↓
Requirements
        ↓
System Model
        ↓
Features
        ↓
Priorities
        ↓
Dependencies
        ↓
Development Phases
        ↓
Milestones
        ↓
Project Plan
```

The Project Plan must answer:

1. What should be built first?
2. What can be built later?
3. Which Features belong to the MVP?
4. Which Features depend on other Features?
5. How should Features be grouped into development phases?
6. What should be delivered at the end of each phase?
7. What are the major project milestones?
8. What are the major risks?
9. What information is still missing?
10. How can the project move from planning toward implementation?

---

# Important Scope Rule

This Project Plan is primarily a:

* Product Development Plan
* Feature Delivery Plan
* Requirements Delivery Plan

It is NOT yet:

* source code plan
* API design
* database schema
* cloud deployment plan
* programming language decision
* framework selection
* technical architecture document

Do not introduce unnecessary technology decisions.

The focus is:

> What should be built, in what order, and why?

---

# Step 1 — Review the Project Scope

Review all previous documents.

Identify:

* project objectives
* confirmed actors
* confirmed requirements
* MVP requirements
* Post-MVP requirements
* Future requirements

Clearly separate:

```text
Confirmed Scope
Derived Scope
Suggested Scope
Future Scope
```

Do not silently convert Suggested or Future scope into confirmed MVP requirements.

---

# Step 2 — Identify the Core Product Journey

Identify the minimum end-to-end journey that demonstrates the core value of the Restaurant Management System.

For example, a possible structure could be:

```text
Actor
        ↓
Core Action
        ↓
System Processing
        ↓
Next Actor
        ↓
Process Completion
```

Do not assume the exact restaurant workflow.

Derive it from the existing User Flows and Features.

The MVP must support at least one meaningful end-to-end product journey.

---

# Step 3 — Confirm the MVP Scope

Review all Features and identify the minimum Feature set required for the MVP.

For every Feature classify:

```text
Required for MVP
Post-MVP
Future
```

The MVP must:

* demonstrate the main project objective
* support the main actors
* support the core workflow
* avoid unnecessary scope expansion
* be realistic for a student project

Do not automatically include all Must Have Features if doing so makes the MVP unnecessarily large.

Explain any differences between:

```text
Must Have
```

and:

```text
Required for MVP
```

when they occur.

---

# Step 4 — Analyze Feature Dependencies

Analyze the Feature Dependency Map.

Determine:

* prerequisite Features
* dependent Features
* independent Features
* critical path Features

Create a logical build order.

Example:

```text
Feature A
        ↓
Feature B
        ↓
Feature C
```

Do not create circular dependencies.

---

# Step 5 — Create Development Phases

Group Features into meaningful development phases.

A phase should represent a coherent product milestone.

Possible examples:

```text
Phase 1 — Foundation
Phase 2 — Core Operations
Phase 3 — Core Workflow Completion
Phase 4 — Management Functions
Phase 5 — Enhancement
```

These are examples only.

Do not blindly use these names.

The phases must be derived from the project.

For every phase define:

* Phase ID
* Phase Name
* Objective
* Included Features
* Related System Areas
* Related Actors
* Dependencies
* Deliverables
* Completion Criteria

---

# Step 6 — Define Feature Sequence

For each Feature identify:

* Recommended development phase
* Reason for placement
* Dependencies
* Priority
* MVP status

Use a table:

| Feature | Phase | Priority | MVP Status | Dependencies | Reason |
| ------- | ----- | -------- | ---------- | ------------ | ------ |

---

# Step 7 — Define Milestones

Create meaningful project milestones.

Each milestone must represent a demonstrable project outcome.

Examples:

```text
M1 — Core requirements finalized
M2 — Core ordering workflow complete
M3 — Kitchen workflow complete
M4 — MVP workflow complete
M5 — Project ready for testing
M6 — Final project complete
```

These are examples only.

Do not automatically use them.

For every milestone define:

* Milestone ID
* Name
* Related Phase
* Objective
* Deliverables
* Completion Criteria

---

# Step 8 — Define Phase Deliverables

For every phase define what should exist after the phase is completed.

Examples may include:

* Feature specification completed
* Core workflow available
* Actor workflow available
* MVP workflow demonstrable
* Feature ready for testing

Do not specify source code structure.

Focus on deliverable outcomes.

---

# Step 9 — Define Acceptance Criteria at Phase Level

For every development phase define high-level acceptance criteria.

Example:

```text
The phase is complete when:

1. All planned Features are implemented.
2. The related User Flows can be completed.
3. Major Use Cases are supported.
4. Known critical issues are resolved.
```

Use project-specific criteria where possible.

---

# Step 10 — Identify Critical Path

Identify the Features or Phases that are essential for completing the MVP.

Represent:

```text
Critical Path
```

as a logical sequence.

Example:

```text
Core Feature
        ↓
Core Workflow
        ↓
Dependent Feature
        ↓
MVP Completion
```

Use only actual dependencies.

---

# Step 11 — Risk Analysis

Identify project risks.

Consider:

* scope expansion
* unclear requirements
* dependency issues
* incomplete MVP workflow
* AI-generated requirement inconsistencies
* duplicated functionality
* missing acceptance criteria

Do not invent technical risks unless supported by the project context.

For every risk define:

* Risk ID
* Description
* Impact
* Probability
* Mitigation

---

# Step 12 — AI-Assisted Development Plan

The project explicitly applies AI throughout the development process.

Identify how AI can support each project phase.

Examples:

```text
Requirement Analysis
        ↓
AI reviews consistency

Feature Planning
        ↓
AI detects dependencies

Implementation Planning
        ↓
AI generates task breakdown

Testing
        ↓
AI generates test scenarios

Review
        ↓
AI checks consistency
```

Do not claim AI can automatically guarantee correctness.

Clearly state that AI output must be reviewed.

---

# Step 13 — Project Governance and Review Points

Define review checkpoints.

For example:

```text
Requirements Review
        ↓
Feature Review
        ↓
MVP Scope Review
        ↓
Phase Completion Review
        ↓
Final Review
```

At each checkpoint identify:

* What is reviewed
* Expected outcome
* Possible decision

---

# Step 14 — Traceability

Ensure the Project Plan remains traceable.

Use:

```text
Project Vision
        ↓
Actor
        ↓
User Flow
        ↓
Use Case
        ↓
System Area
        ↓
Component
        ↓
Feature
        ↓
Phase
        ↓
Milestone
```

Every major MVP Phase should contain Features that can be traced back to previous requirements.

---

# Required Output

Generate the final document using exactly this structure:

# Project Plan

## 1. Project Overview

Explain:

* project objective
* project scope
* main actors
* purpose of the Project Plan

---

## 2. Planning Principles

Describe:

* requirement-driven planning
* dependency-driven sequencing
* MVP-first approach
* incremental delivery
* AI-assisted development with human review

---

## 3. Scope Classification

### 3.1 Confirmed Scope

### 3.2 Derived Scope

### 3.3 Suggested Scope

### 3.4 Future Scope

---

## 4. Core Product Journey

Describe the minimum end-to-end workflow that demonstrates the project's value.

Include a Mermaid diagram.

---

## 5. MVP Scope

Create:

| Feature | Priority | MVP Status | Reason |
| ------- | -------- | ---------- | ------ |

Then explain why this Feature set represents the MVP.

---

## 6. Feature Dependency Analysis

Create:

| Feature | Depends On | Dependency Type | Impact |
| ------- | ---------- | --------------- | ------ |

Then provide a Mermaid dependency diagram.

---

## 7. Development Phases

For every phase:

### Phase X — Phase Name

**Objective:**
**Included Features:**
**Related System Areas:**
**Related Actors:**
**Dependencies:**
**Deliverables:**
**Completion Criteria:**

---

## 8. Feature-to-Phase Mapping

Create:

| Feature | Phase | Priority | MVP Status | Dependencies | Reason |
| ------- | ----- | -------- | ---------- | ------------ | ------ |

---

## 9. Project Milestones

Create:

| Milestone | Phase | Objective | Deliverables | Completion Criteria |
| --------- | ----- | --------- | ------------ | ------------------- |

---

## 10. Critical Path

Describe the sequence of Features or Phases required to complete the MVP.

Include a Mermaid diagram.

---

## 11. Phase Deliverables

Create:

| Phase | Deliverable | Purpose |
| ----- | ----------- | ------- |

---

## 12. Phase Acceptance Criteria

For each phase provide clear acceptance criteria.

---

## 13. Risk Analysis

Create:

| Risk ID | Risk | Probability | Impact | Mitigation |
| ------- | ---- | ----------- | ------ | ---------- |

---

## 14. AI-Assisted Development Plan

Create:

| Project Activity | AI Assistance | Human Responsibility |
| ---------------- | ------------- | -------------------- |

Clearly state that human review is required.

---

## 15. Project Review Checkpoints

Create:

| Checkpoint | What Is Reviewed | Expected Outcome |
| ---------- | ---------------- | ---------------- |

---

## 16. Traceability Summary

Create:

| Phase | Features | Use Cases | User Flows | Actors |
| ----- | -------- | --------- | ---------- | ------ |

---

## 17. Open Questions

For every unresolved item provide:

* Question
* Related Phase
* Why it matters
* Possible options
* Recommended option if appropriate

---

## 18. Final Project Roadmap

Provide a concise high-level roadmap:

```text
Project Vision
        ↓
Requirements Analysis
        ↓
Feature Definition
        ↓
MVP Planning
        ↓
Phase 1
        ↓
Phase 2
        ↓
...
        ↓
MVP Complete
        ↓
Post-MVP
        ↓
Future Features
```

Use the actual project phases.

---

## 19. Consistency Check

Before completing the document verify:

1. The MVP scope supports the main project objective.
2. The MVP includes a meaningful end-to-end workflow.
3. Features are placed in logical phases.
4. Dependencies are respected.
5. The critical path is identified.
6. Every major phase has deliverables.
7. Every major phase has completion criteria.
8. Project risks are identified.
9. AI assistance is clearly defined.
10. Human review remains part of the process.
11. Project phases are traceable to Features.
12. Features remain traceable to previous requirements.
13. Suggested features are not silently treated as confirmed scope.
14. The plan is suitable as input for PRD generation.

---

# Final Instruction

Do not generate the PRD yet.

Do not generate source code.

Do not generate database schemas.

Do not generate APIs.

Do not generate technical architecture.

Do not select programming languages or frameworks.

Your only task is to create:

**docs/requirements/07-project-plan.md**

This document will become a primary input for:

**Step 8 — PRD Generation.**

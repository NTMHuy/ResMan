# Product Requirements Document Generation Prompt

## Role

You are a Senior Product Manager, Business Analyst, Product Owner, Requirements Engineer, and Product Documentation Specialist.

Your task is to consolidate all existing project analysis documents into one complete and internally consistent **Product Requirements Document (PRD)** for the Restaurant Management System.

The PRD must become the central product document for the project.

It must provide a clear and structured definition of:

* the product vision
* the problem being solved
* project objectives
* target users
* actors
* user needs
* product scope
* system capabilities
* functional requirements
* feature requirements
* user flows
* use case coverage
* MVP scope
* priorities
* dependencies
* acceptance criteria
* future scope
* open questions

The PRD must be suitable for use as input for future AI-assisted development activities.

---

# Project

Project name:

**Xây dựng hệ thống quản lí nhà hàng**

The primary actors are:

* Customer
* Order Staff
* Kitchen Staff
* Warehouse Staff
* Manager

The system is intended to support the main operations of a restaurant.

The project applies AI throughout the software development lifecycle to assist with:

* requirements analysis
* documentation
* planning
* feature decomposition
* development planning
* implementation
* testing
* review

The product may also contain AI-powered product features, including food recommendations based on customer ordering behavior.

---

# Input Documents

Before generating the PRD, read and analyze all of the following documents:

```text
docs/requirements/01-project-vision.md
docs/requirements/02-actor-analysis.md
docs/requirements/03-user-flows.md
docs/requirements/04-use-cases.md
docs/requirements/05-system-model.md
docs/requirements/06-feature-breakdown.md
docs/requirements/07-project-plan.md
```

These documents are the source of truth.

Do not ignore previous decisions.

Do not introduce contradictions.

The PRD must consolidate the information from these documents rather than independently redesigning the product.

---

# Core Principle

The PRD must follow:

```text
Confirmed Requirements
        +
Validated Analysis
        +
Feature Breakdown
        +
Project Plan
        ↓
Complete Product Requirements Document
```

The PRD must NOT:

* invent major new requirements
* silently promote suggested features into confirmed requirements
* silently move future features into MVP
* introduce technical architecture
* select programming languages
* select frameworks
* design APIs
* design databases
* generate source code

If a requirement is unclear:

1. Do not invent the answer.
2. Record the issue.
3. Explain why it matters.
4. Add it to Open Questions.

---

# Step 1 — Analyze and Consolidate Requirements

Review all previous documents.

Identify:

## Confirmed Requirements

Requirements explicitly supported by the source documents.

## Derived Requirements

Requirements logically necessary to support confirmed flows or features.

Clearly mark them as derived.

## Suggested Requirements

Potential improvements not yet confirmed.

Clearly mark them as suggested.

## Future Requirements

Features intentionally outside the MVP.

Clearly mark them as future scope.

Do not mix these categories.

---

# Step 2 — Define the Product

Clearly define:

* product name
* product purpose
* problem being solved
* target users
* primary actors
* product value

The description must remain consistent with the Project Vision.

---

# Step 3 — Define Product Goals

Identify:

* primary goals
* secondary goals
* success criteria

Goals must be measurable where possible.

Do not invent arbitrary numerical metrics unless supported by previous documents.

If a measurable metric is unavailable, mark it as an Open Question.

---

# Step 4 — Define Users and Actors

For every actor describe:

* actor name
* role
* primary objectives
* major needs
* main interactions
* related system areas

Do not duplicate the entire Actor Analysis document.

Summarize the information required for the PRD.

---

# Step 5 — Define Product Scope

Separate:

```text
In Scope
Out of Scope
MVP Scope
Post-MVP Scope
Future Scope
```

Every item must be traceable to previous documents.

Do not classify suggested features as confirmed scope.

---

# Step 6 — Define the Core Product Journey

Describe the minimum end-to-end workflow demonstrating the main value of the system.

Use:

```text
Actor
↓
Action
↓
System Processing
↓
Next Actor
↓
Process Completion
```

The journey must be based on existing User Flows and Project Plan.

Include a Mermaid diagram.

---

# Step 7 — Consolidate Functional Requirements

Convert confirmed Features into clear functional requirements.

Use IDs:

```text
FR-001
FR-002
FR-003
```

For every Functional Requirement define:

* Requirement ID
* Requirement Name
* Description
* Related Feature
* Related Actor
* Priority
* MVP Status
* Source Classification

Use Source Classification:

```text
Confirmed
Derived
Suggested
Future
```

Do not create Functional Requirements without traceability.

---

# Step 8 — Feature Requirements

For every major Feature provide:

* Feature ID
* Feature Name
* Description
* Primary Actor
* Related Actors
* Related System Area
* Related Use Cases
* Functional Requirements
* Priority
* MVP Status
* Dependencies

Do not duplicate unnecessary details from the Feature Breakdown.

The PRD should summarize and structure the information.

---

# Step 9 — User Flow Requirements

Include the most important User Flows.

For each flow define:

* Flow ID
* Flow Name
* Primary Actor
* Trigger
* Main Steps
* Expected Outcome
* Related Features

Do not reproduce every analysis detail unless necessary.

Prioritize:

* core workflows
* MVP workflows
* cross-actor workflows

---

# Step 10 — Use Case Coverage

Provide a summary showing that major Use Cases are supported.

Create:

| Use Case | Related Features | Related Functional Requirements | Coverage Status |
| -------- | ---------------- | ------------------------------- | --------------- |

Use:

```text
Complete
Partial
Missing
```

Explain Partial or Missing coverage.

---

# Step 11 — MVP Requirements

Clearly define the minimum Feature and Functional Requirement set required for the MVP.

The MVP must support a complete end-to-end restaurant workflow.

For every MVP item explain:

* why it is required
* which workflow it supports
* what dependencies exist

---

# Step 12 — Feature Priority

Use:

```text
Must Have
Should Have
Could Have
Won't Have for MVP
```

Do not automatically classify everything as Must Have.

Create a prioritized Feature list.

---

# Step 13 — Dependencies

Identify important product dependencies.

Examples:

```text
Feature A
        ↓
Feature B
```

Create:

| Item | Depends On | Dependency Type | Reason |
| ---- | ---------- | --------------- | ------ |

Do not include technical dependencies.

---

# Step 14 — Acceptance Criteria

Define high-level acceptance criteria for each major Feature.

Use clear product behavior.

Example:

```text
Given a valid actor,
When the actor completes the required action,
Then the expected system result must be available.
```

Do not define test code.

Acceptance criteria should be specific enough for later testing.

---

# Step 15 — Business Rules

Consolidate confirmed business rules from previous documents.

For every rule define:

* Rule ID
* Description
* Related System Area
* Related Feature
* Source Classification

Do not invent restaurant policies that were never established.

---

# Step 16 — AI Product Requirements

Separate two concepts clearly.

## AI-Assisted Development

AI is used during project development for:

* analysis
* planning
* documentation
* implementation assistance
* testing assistance
* review

This is part of the development methodology.

## AI Product Features

AI functionality available to users inside the product.

For every AI product feature define:

* Feature
* Purpose
* Input
* Output
* Related Actor
* Classification

Classification:

```text
Confirmed
Suggested
Future
```

Do not describe:

* specific AI models
* algorithms
* embeddings
* vector databases
* training pipelines

Those belong to later technical design.

---

# Step 17 — Project Phases

Summarize the development phases from the Project Plan.

For every phase define:

* phase
* objective
* included features
* expected deliverables
* milestone

The PRD should reference the Project Plan rather than duplicate unnecessary planning details.

---

# Step 18 — Risks and Constraints

Consolidate product-level risks and constraints.

Possible categories:

* Scope
* Requirement clarity
* Dependency
* MVP completeness
* AI-generated inconsistency

For every item define:

* ID
* Description
* Impact
* Mitigation

Do not introduce unsupported technical risks.

---

# Step 19 — Open Questions

Collect unresolved questions from all previous documents.

For every question define:

* Question ID
* Question
* Related Area
* Why It Matters
* Possible Options
* Recommended Direction
* Status

Use:

```text
Open
Needs Decision
Resolved
```

Only mark Resolved if supported by the source documents.

---

# Step 20 — Traceability

Create a traceability chain:

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
Feature
        ↓
Functional Requirement
        ↓
MVP Phase
```

Create a summary matrix.

---

# Step 21 — Consistency Review

Before generating the final PRD verify:

1. The PRD is consistent with the Project Vision.
2. All primary actors are represented.
3. Major User Flows are represented.
4. Major Use Cases have Feature coverage.
5. Features have Functional Requirement coverage.
6. MVP scope is clearly separated.
7. Post-MVP and Future scope are clearly separated.
8. Suggested requirements are not treated as confirmed.
9. Dependencies are valid.
10. Acceptance Criteria exist for major Features.
11. Business Rules are traceable.
12. AI development usage is separated from AI product features.
13. Open Questions are clearly recorded.
14. No technical architecture has been introduced.
15. The PRD is suitable as the central product document.

---

# Required Output

Generate the final document using exactly the following structure:

# Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Product Name

### 1.2 Product Purpose

### 1.3 Problem Statement

### 1.4 Product Vision

---

## 2. Product Goals

### 2.1 Primary Goals

### 2.2 Secondary Goals

### 2.3 Success Criteria

---

## 3. Target Users and Actors

Create:

| Actor | Role | Primary Goal | Main Interaction |
| ----- | ---- | ------------ | ---------------- |

---

## 4. Product Scope

### 4.1 In Scope

### 4.2 Out of Scope

### 4.3 MVP Scope

### 4.4 Post-MVP Scope

### 4.5 Future Scope

---

## 5. Core Product Journey

Describe the core end-to-end workflow.

Include a Mermaid diagram.

---

## 6. System Capability Overview

Create:

| System Area | Main Capability | Primary Actors |
| ----------- | --------------- | -------------- |

---

## 7. Feature Overview

Create:

| Feature ID | Feature | Primary Actor | Priority | MVP Status |
| ---------- | ------- | ------------- | -------- | ---------- |

---

## 8. Functional Requirements

Create:

| Requirement ID | Requirement | Feature | Actor | Priority | MVP Status | Source |
| -------------- | ----------- | ------- | ----- | -------- | ---------- | ------ |

Then provide detailed requirements where necessary.

---

## 9. Major Feature Requirements

For every major Feature:

### Feature ID — Feature Name

**Purpose:**
**Primary Actor:**
**Related Actors:**
**Related System Area:**
**Related Use Cases:**
**Functional Requirements:**
**Priority:**
**MVP Status:**
**Dependencies:**

---

## 10. Core User Flows

For every important flow:

### Flow ID — Flow Name

**Primary Actor:**
**Trigger:**
**Main Steps:**
**Expected Outcome:**
**Related Features:**

---

## 11. Use Case Coverage

Create:

| Use Case | Features | Functional Requirements | Coverage |
| -------- | -------- | ----------------------- | -------- |

---

## 12. MVP Requirements

Create:

| Feature / Requirement | Reason | Supported Workflow | Dependencies |
| --------------------- | ------ | ------------------ | ------------ |

Then explain the complete MVP workflow.

---

## 13. Feature Priority

Create:

| Feature | Priority | Reason |
| ------- | -------- | ------ |

---

## 14. Product Dependencies

Create:

| Item | Depends On | Dependency Type | Reason |
| ---- | ---------- | --------------- | ------ |

---

## 15. Acceptance Criteria

For every major Feature define high-level acceptance criteria.

---

## 16. Business Rules

Create:

| Rule ID | Rule | System Area | Feature | Source |
| ------- | ---- | ----------- | ------- | ------ |

---

## 17. AI Requirements

### 17.1 AI-Assisted Development

### 17.2 AI Product Features

Create:

| AI Feature | Purpose | Input | Output | Actor | Classification |
| ---------- | ------- | ----- | ------ | ----- | -------------- |

---

## 18. Project Delivery Plan

Create:

| Phase | Objective | Included Features | Deliverable | Milestone |
| ----- | --------- | ----------------- | ----------- | --------- |

---

## 19. Risks and Constraints

Create:

| ID | Risk / Constraint | Impact | Mitigation |
| -- | ----------------- | ------ | ---------- |

---

## 20. Open Questions

Create:

| ID | Question | Related Area | Why It Matters | Status |
| -- | -------- | ------------ | -------------- | ------ |

---

## 21. Traceability Matrix

Create:

| Vision / Goal | Actor | User Flow | Use Case | Feature | Functional Requirement | Phase |
| ------------- | ----- | --------- | -------- | ------- | ---------------------- | ----- |

---

## 22. Final Consistency Summary

Summarize:

* confirmed requirements
* derived requirements
* suggested requirements
* future requirements
* MVP completeness
* unresolved questions

---

# Final Instruction

Do not generate:

* source code
* database schemas
* APIs
* technical architecture
* programming language decisions
* framework decisions
* deployment architecture

Your only task is to create:

**docs/requirements/08-prd.md**

This PRD must become the central product requirements document for the Restaurant Management System.

All future development planning should trace back to this PRD and the original analysis documents.

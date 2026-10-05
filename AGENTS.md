# ResMan Agent Instructions

## 1. Project Context

ResMan is a multi-platform restaurant management system.

The system serves different users and operational contexts, including:

* Customer
* Order Staff
* Kitchen Staff
* Warehouse Staff
* Cashier
* Manager

Different roles may use different devices and interfaces.

The project may include:

* Customer-facing interfaces
* Staff mobile interfaces
* Kitchen interfaces
* Cashier interfaces
* Warehouse interfaces
* Management interfaces
* Restaurant operational workflows
* AI-powered features

The agent must understand the existing project documentation before making decisions.

---

## 2. Source of Truth

When making project decisions, use the following priority:

1. Explicit user instruction in the current task
2. Project requirements and approved PRD
3. Project Vision
4. Existing approved project documentation
5. Existing implementation
6. Applicable skills
7. General technical knowledge

Do not override a higher-priority source with a lower-priority source.

If sources conflict, identify the conflict instead of silently choosing one.

---

## 3. Project Scope

The agent must respect the project's defined scope.

Do not:

* Add unrequested features.
* Expand the product scope without approval.
* Remove existing requirements without approval.
* Introduce unnecessary technical complexity.
* Change approved project decisions without justification.

When a requested task appears to require a scope change, clearly identify it before implementation.

---

## 4. Documentation First

Before performing a non-trivial task, inspect the relevant project documentation.

Prioritize:

```text
AGENTS.md
    ↓
Project Vision
    ↓
Relevant PRD
    ↓
Relevant system analysis
    ↓
Relevant architecture documentation
    ↓
Existing implementation
```

Do not make assumptions about existing project decisions when the information can be obtained from project documentation.

---

## 5. Skill System

Skills provide specialized procedures and knowledge for specific types of tasks.

Available skills:

```text
ai/skills/
├── project-analysis/
├── requirements-analysis/
├── system-analysis/
├── architecture-design/
├── database-design/
├── api-design/
├── ui-ux-design/
└── code-review/
```

Each skill contains its own `SKILL.md`.

The agent must select the smallest relevant set of skills for the current task.

Do not load or apply unrelated skills.

---

## 6. Skill Selection Rules

### Project Analysis

Use:

```text
ai/skills/project-analysis/SKILL.md
```

when the task requires understanding:

* Project scope
* Project state
* Existing decisions
* Dependencies
* Documentation
* Project direction

---

### Requirements Analysis

Use:

```text
ai/skills/requirements-analysis/SKILL.md
```

when the task involves:

* Requirements
* Features
* Business rules
* Acceptance criteria
* Ambiguity
* Requirement conflicts

---

### System Analysis

Use:

```text
ai/skills/system-analysis/SKILL.md
```

when the task involves:

* Actors
* Use cases
* User flows
* Business processes
* Modules
* State transitions
* System interactions

---

### Architecture Design

Use:

```text
ai/skills/architecture-design/SKILL.md
```

when the task involves:

* System architecture
* Application layers
* Component boundaries
* Service communication
* External integrations
* Data flow

---

### Database Design

Use:

```text
ai/skills/database-design/SKILL.md
```

when the task involves:

* Database schema
* Entities
* Relationships
* ERD
* Constraints
* Indexes
* Data integrity
* Transactions

---

### API Design

Use:

```text
ai/skills/api-design/SKILL.md
```

when the task involves:

* REST APIs
* Endpoints
* Request/response contracts
* Validation
* API errors
* Authentication
* Authorization

---

### UI/UX Design

Use:

```text
ai/skills/ui-ux-design/SKILL.md
```

when the task involves:

* UI
* UX
* Screens
* Navigation
* User interaction
* Responsive design
* Role-specific interfaces
* Device-specific interfaces

---

### Code Review

Use:

```text
ai/skills/code-review/SKILL.md
```

when the task involves:

* Reviewing implementation
* Pull requests
* Refactoring
* Feature verification
* Code quality
* Security review
* Requirement compliance

---

## 7. Multiple Skills

A task may require multiple skills.

When multiple skills are required, use them in a logical dependency order.

For example:

```text
Requirements Analysis
        ↓
System Analysis
        ↓
Architecture Design
        ↓
Database Design
        ↓
API Design
        ↓
UI/UX Design
        ↓
Implementation
        ↓
Code Review
```

Do not automatically execute every skill in this sequence.

Only use the skills required by the current task.

---

## 8. Analysis Before Implementation

For non-trivial tasks, do not immediately write code.

First determine:

1. What is being requested?
2. Which requirement does it belong to?
3. Which actors are affected?
4. Which modules are affected?
5. Which existing decisions are relevant?
6. Which skills are required?
7. What dependencies exist?
8. What could be affected by the change?

Then implement only after the scope is understood.

---

## 9. Requirements and PRD

The PRD describes what the product should do.

Skills describe how the agent should approach the work.

Never use a skill to create new product requirements unless explicitly requested.

The agent must not treat implementation preferences as product requirements.

Example:

```text
PRD:
Customer can place an order using a restaurant tablet.

Skill:
UI/UX skill determines how to design the interface
for that customer and device context.
```

The skill must not independently decide that customer ordering is a required feature.

---

## 10. Role and Device Awareness

ResMan is a multi-platform system.

The agent must consider both:

```text
User Role
+
Device / Platform
+
Operational Context
```

when designing workflows or interfaces.

For example:

```text
Customer
    → Tablet
    → Browse menu
    → Select dishes
    → Place order

Order Staff
    → Mobile
    → Monitor tables
    → Assist customers

Kitchen
    → Desktop
    → Receive orders
    → Update preparation status

Cashier
    → Desktop
    → Process payment

Warehouse
    → Desktop
    → Manage inventory

Manager
    → Desktop
    → Monitor and manage operations
```

Do not assume that all roles should use the same interface or workflow.

---

## 11. Architecture Consistency

When modifying one part of the system, consider its relationship with:

```text
Frontend
Backend
Database
Authentication
Authorization
External Services
AI Services
```

Avoid isolated changes that break established system boundaries.

Any architecture-changing decision should be explicitly identified.

---

## 12. Database Consistency

Database changes must be validated against:

* Requirements
* Business rules
* System flows
* API contracts
* Existing entities
* Data integrity

Do not create database structures merely because a UI component requires them.

---

## 13. API Consistency

API design must remain consistent with:

* Domain responsibilities
* Business rules
* Authentication
* Authorization
* Database model
* Frontend requirements

Do not expose internal implementation details unnecessarily.

---

## 14. UI/UX Consistency

All interfaces should maintain:

* Consistent terminology
* Consistent interaction patterns
* Consistent visual language
* Clear information hierarchy
* Appropriate responsive behavior

However, consistency does not mean every role must have the same interface.

Role and device context take priority over unnecessary visual uniformity.

---

## 15. AI Usage

AI features must be treated as system components, not as an independent product layer.

When designing AI functionality:

```text
User Requirement
      ↓
Business Problem
      ↓
Required Data
      ↓
AI Capability
      ↓
Backend Integration
      ↓
User Interface
```

Do not introduce AI simply because the project is labeled as an AI project.

Each AI feature must have:

* A clear purpose
* A defined input
* A defined output
* A place in the system workflow
* A measurable or observable benefit

---

## 16. Implementation Principles

When implementation begins:

* Prefer simple solutions.
* Reuse existing project patterns.
* Avoid unnecessary dependencies.
* Avoid premature abstraction.
* Keep modules focused.
* Keep business logic separate from presentation.
* Follow the existing project architecture.
* Do not rewrite unrelated code.

Changes should be incremental and easy to review.

---

## 17. Validation

Before considering a task complete, verify:

### Requirements

* Does the implementation satisfy the intended requirement?

### Architecture

* Does it follow the existing architecture?

### Data

* Are database changes correct and consistent?

### API

* Are API contracts consistent?

### UI/UX

* Does the interface match the intended role and device?

### Security

* Are authentication and authorization requirements respected?

### Code Quality

* Is the implementation maintainable?

### Regression

* Could the change break existing functionality?

---

## 18. Code Review

After completing a significant implementation, use:

```text
ai/skills/code-review/SKILL.md
```

to review the result.

Review the implementation against:

1. Requirements
2. Architecture
3. Security
4. Data consistency
5. API consistency
6. UI/UX behavior
7. Maintainability
8. Testing

Do not report subjective preferences as defects.

---

## 19. Uncertainty Handling

When information is missing:

* Do not invent requirements.
* Do not silently change project scope.
* Clearly identify assumptions.
* Prefer existing project documentation.
* Ask for clarification when the missing information materially affects the implementation.

For minor implementation details, use the simplest reasonable approach that is consistent with the project.

---

## 20. Change Discipline

Every change should have a clear reason.

Before modifying existing code or documentation, determine:

* Why the change is needed.
* What depends on the changed component.
* Whether the change affects other modules.
* Whether documentation must also be updated.

Avoid unrelated changes.

---

## 21. Communication

When explaining work:

* Be concise.
* Clearly separate confirmed facts from assumptions.
* Explain important architectural decisions.
* Identify risks when relevant.
* Do not claim something was completed unless it was actually completed.
* Do not claim tests were executed unless they were actually executed.

For complex tasks, explain the plan before implementation.

---

## 22. Definition of Done

A task is complete only when:

* The requested functionality or artifact exists.
* It follows the applicable project requirements.
* It follows the established architecture.
* Relevant documentation is updated when necessary.
* The implementation has been reviewed when appropriate.
* No known critical issue remains unresolved.

---

## 23. General Principle

The agent should behave as a project-aware engineering agent rather than a generic code generator.

Always prefer:

```text
Understand
    ↓
Analyze
    ↓
Plan
    ↓
Design
    ↓
Implement
    ↓
Review
    ↓
Validate
```

over:

```text
Request
    ↓
Generate Code
```

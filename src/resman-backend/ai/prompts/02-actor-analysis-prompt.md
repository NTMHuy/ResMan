# Actor & User Needs Analysis Prompt

## Role

You are a Senior Business Analyst.

Your task is to analyze the actors and user needs of the Restaurant Management System.

Use the approved Project Vision as the primary source of truth.

Do not focus on programming languages, frameworks, databases, APIs, or implementation details.

---

## Input

Read the following project documentation:

`docs/01-project-vision.md`

Use the Project Vision to understand:

* Project purpose
* Project goals
* Target users
* Project scope
* Core system areas
* AI role

---

## Current Confirmed Actors

The following actors have been identified:

1. Customer
2. Order Staff
3. Kitchen Staff
4. Warehouse Staff
5. Manager

These actors must be analyzed.

Do not remove or replace confirmed actors without providing a clear reason.

You may identify additional potential actors, but clearly label them as:

* Suggested Actor
* External Actor
* Optional Actor

Do not automatically add suggested actors to the confirmed system scope.

---

## Analysis Tasks

### 1. Actor Identification

For each actor, determine:

* Who they are
* Their role in the restaurant
* Their main objective
* Their relationship with the system

---

### 2. User Needs

For each actor, identify their main needs.

Group the needs into logical categories.

For example:

* Information
* Ordering
* Management
* Monitoring
* Communication
* Reporting

Do not define detailed UI or technical implementation.

---

### 3. Actor Responsibilities

Determine what each actor is responsible for within the restaurant operation.

Avoid overlapping responsibilities unless the same activity legitimately requires multiple roles.

---

### 4. Actor Goals

For each actor, identify the main outcomes they expect from the system.

Focus on user goals rather than system functions.

---

### 5. Actor-System Relationship

Describe how each actor interacts with the system at a high level.

Do not create detailed user flows yet.

---

### 6. Actor Matrix

Create a matrix showing which actors are associated with the major functional areas identified in the Project Vision.

Use:

* ✓ = Primary responsibility
* ○ = Secondary interaction
* — = No direct responsibility

---

### 7. Potential Missing Actors

Analyze whether important actors are missing.

If additional actors are identified:

* Explain why they may be necessary.
* Clearly label them as suggested or external.
* Do not treat them as confirmed.

---

## Consistency Rules

The analysis must:

1. Remain consistent with `01-project-vision.md`.
2. Keep the five confirmed actors.
3. Avoid introducing unnecessary actors.
4. Avoid detailed use cases.
5. Avoid detailed user flows.
6. Avoid technical implementation.
7. Distinguish confirmed information from assumptions.
8. Keep the project realistic for a student project.

---

## Output

Generate the result in the following Markdown structure:

# Actor & User Needs Analysis

## 1. Actor Overview

## 2. Actor Analysis

### 2.1 Customer

### 2.2 Order Staff

### 2.3 Kitchen Staff

### 2.4 Warehouse Staff

### 2.5 Manager

## 3. User Needs

## 4. Actor Responsibilities

## 5. Actor Goals

## 6. Actor-System Relationships

## 7. Actor Matrix

## 8. Potential Additional Actors

## 9. Open Questions

---

## Quality Check

Before producing the result, verify:

* All five confirmed actors are included.
* Their responsibilities do not unnecessarily overlap.
* User needs are consistent with the Project Vision.
* Suggested actors are clearly separated from confirmed actors.
* No detailed technical design has been introduced.
* No detailed user flow has been created.

Return only the completed Actor & User Needs Analysis document.

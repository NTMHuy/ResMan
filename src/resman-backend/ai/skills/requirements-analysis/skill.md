# Requirements Analysis

## Purpose

Transform project requirements into clear, consistent, testable requirements without changing the intended scope.

## When to Use

Use this skill when:

* Analyzing a new feature.
* Reviewing a PRD.
* Breaking a feature into functional requirements.
* Identifying business rules.
* Detecting ambiguous or conflicting requirements.

## Inputs

Use:

* Project Vision
* PRD
* User flows
* Use cases
* Existing system documentation
* Explicit user instructions

## Responsibilities

The agent must:

* Identify functional requirements.
* Identify non-functional requirements.
* Identify actors involved in each requirement.
* Identify inputs and outputs.
* Identify business rules.
* Identify dependencies.
* Identify edge cases.
* Identify ambiguous or conflicting requirements.

## Rules

* The PRD is the primary source of product requirements.
* Do not invent business rules.
* Do not add features merely because they are technically convenient.
* Separate requirements from implementation details.
* Requirements must describe expected system behavior.
* Identify uncertainty instead of silently making assumptions.
* Preserve terminology used by the project.

## Workflow

1. Read the relevant project requirements.
2. Identify actors and affected modules.
3. Extract functional requirements.
4. Extract business rules.
5. Identify non-functional requirements.
6. Identify dependencies and edge cases.
7. Check for contradictions.
8. Produce structured requirements.

## Output

For each feature, provide where appropriate:

* Feature goal
* Actor
* Preconditions
* Main flow
* Alternative flows
* Business rules
* Inputs
* Outputs
* Exceptions
* Dependencies
* Acceptance criteria

## Restrictions

Do not:

* Redesign the product during requirement analysis.
* Add unrequested functionality.
* Convert requirements into code.
* Treat implementation preferences as product requirements.

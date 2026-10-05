# Architecture Design

## Purpose

Design a maintainable system architecture that satisfies the project's requirements and constraints.

## When to Use

Use this skill when:

* Designing the overall system architecture.
* Defining application layers.
* Defining frontend/backend boundaries.
* Planning service communication.
* Integrating external or AI services.

## Responsibilities

The agent must define:

* System components
* Application boundaries
* Layer responsibilities
* Communication paths
* Data flow
* External dependencies
* Authentication boundaries
* Integration boundaries

## Rules

* Architecture must be derived from project requirements.
* Prefer simple architecture over unnecessary complexity.
* Each component must have a clear responsibility.
* Separate business logic from presentation concerns.
* Define clear boundaries between frontend, backend, database, and external services.
* Avoid introducing infrastructure that is not required.
* Architecture decisions must be explainable.

## Workflow

1. Analyze requirements.
2. Identify major system components.
3. Define responsibilities.
4. Define communication between components.
5. Define data flow.
6. Identify external dependencies.
7. Evaluate security and scalability requirements.
8. Validate the architecture against the project scope.

## Output

Produce:

* Architecture overview
* Component responsibilities
* Data flow
* Communication flow
* Integration points
* Important architecture decisions
* Architecture risks

## Restrictions

Do not:

* Choose technologies solely because they are popular.
* Introduce microservices without a clear requirement.
* Over-engineer the system.
* Ignore existing project technology decisions.

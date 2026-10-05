# API Design

## Purpose

Design clear, consistent, secure, and maintainable APIs for communication between system components.

## When to Use

Use this skill when:

* Designing REST APIs.
* Defining endpoints.
* Designing request and response models.
* Connecting frontend and backend.
* Designing service integrations.

## Responsibilities

The agent must define:

* Resources
* Endpoints
* HTTP methods
* Request parameters
* Request bodies
* Response structures
* Validation rules
* Error responses
* Authentication requirements
* Authorization requirements

## Rules

* APIs must represent business capabilities rather than UI actions.
* Use consistent naming conventions.
* Use appropriate HTTP methods.
* Validate input at the API boundary.
* Return predictable response structures.
* Return meaningful error information without exposing sensitive internals.
* Authorization must be considered for protected operations.
* API design must remain consistent with the domain model.

## Workflow

1. Identify the required business operation.
2. Identify the resource or resources involved.
3. Define endpoint and HTTP method.
4. Define request structure.
5. Define response structure.
6. Define validation rules.
7. Define authorization requirements.
8. Define error cases.
9. Validate the API against frontend and backend responsibilities.

## Output

For each endpoint, provide:

* Method
* Path
* Purpose
* Authentication
* Authorization
* Request
* Response
* Validation
* Error cases

## Restrictions

Do not:

* Design APIs around individual UI components.
* Expose database entities directly without considering API contracts.
* Expose secrets or sensitive internal information.
* Create endpoints without a corresponding business requirement.

# Project Analysis

## Purpose

Analyze the project context before making implementation or design decisions.

The goal is to help the agent understand the project's purpose, scope, users, constraints, existing documentation, and current development state before proposing or executing changes.

## When to Use

Use this skill when:

* Starting work on a new project or major project phase.
* The user asks to analyze the project.
* The agent needs to understand existing project documentation.
* A task depends on existing project decisions.
* There is uncertainty about project scope or responsibilities.

## Inputs

Prioritize the following sources:

1. `AGENTS.md`
2. Project Vision
3. Product requirements and PRD
4. Existing architecture documentation
5. Existing system analysis
6. Existing source code
7. Existing README and project documentation

Do not assume information that is not supported by project sources.

## Responsibilities

The agent must:

* Identify the project's primary goal.
* Identify target users and actors.
* Identify the project's scope.
* Identify major features and modules.
* Identify important business constraints.
* Identify technical constraints that are already established.
* Identify dependencies between modules.
* Identify completed, planned, and unresolved work.
* Detect contradictions between project documents.
* Identify missing information that materially affects the task.

## Rules

* Treat project documentation as the primary source of project intent.
* Do not invent requirements.
* Do not expand the project scope without explicit approval.
* Do not replace existing project decisions without explaining the reason.
* Distinguish confirmed requirements from assumptions.
* Preserve consistency with previously approved project decisions.
* Prefer the smallest change that satisfies the requested goal.

## Workflow

1. Read the relevant project documentation.
2. Identify the current project phase.
3. Identify the task's relationship to the existing project.
4. Identify applicable requirements and constraints.
5. Identify dependencies and potential conflicts.
6. Determine what information is confirmed and what is unknown.
7. Produce a concise analysis before implementation when the task is complex.

## Output

The analysis should clearly identify:

* Project context
* Relevant requirements
* Relevant constraints
* Current state
* Task scope
* Dependencies
* Risks or contradictions
* Recommended next action

## Restrictions

Do not:

* Generate implementation code during pure project analysis.
* Invent missing business requirements.
* Modify the PRD without explicit instruction.
* Treat assumptions as confirmed requirements.
* introduce unrelated features.

# Code Review

## Purpose

Review implementation quality, correctness, maintainability, security, and consistency with project requirements.

## When to Use

Use this skill when:

* Reviewing completed code.
* Reviewing a pull request.
* Completing a feature.
* Refactoring existing code.
* Verifying implementation against requirements.

## Responsibilities

The agent must review:

* Correctness
* Requirement compliance
* Architecture consistency
* Code organization
* Maintainability
* Error handling
* Security
* Performance
* Testing
* Duplication
* Naming and readability

## Rules

* Review code against project requirements first.
* Identify actual problems rather than subjective preferences.
* Distinguish critical issues from improvements.
* Do not recommend unnecessary refactoring.
* Preserve established architecture unless there is a justified reason to change it.
* Security issues must be treated as high priority.
* Do not claim code has been tested unless it has actually been tested.

## Workflow

1. Read the relevant requirements.
2. Understand the intended behavior.
3. Inspect the implementation.
4. Check architecture consistency.
5. Check correctness.
6. Check error handling and security.
7. Check tests.
8. Identify issues by severity.
9. Provide concrete fixes.

## Output

Organize findings by severity:

### Critical

Issues that can cause security problems, data loss, system failure, or severe incorrect behavior.

### High

Issues that significantly affect functionality or maintainability.

### Medium

Issues that should be addressed but do not block functionality.

### Low

Minor improvements and cleanup.

For each issue include:

* Problem
* Why it matters
* Location
* Recommended fix

## Restrictions

Do not:

* Rewrite working code without justification.
* Introduce unrelated architectural changes.
* Report style preferences as critical defects.
* Claim tests were executed when they were not.

# Database Design

## Purpose

Design a consistent, maintainable, and reliable data model based on system requirements.

## When to Use

Use this skill when:

* Designing or reviewing the database.
* Creating entities and relationships.
* Designing ERD.
* Reviewing data integrity.
* Planning database migrations.

## Responsibilities

The agent must:

* Identify entities.
* Identify attributes.
* Define relationships.
* Define primary keys.
* Define foreign keys.
* Define constraints.
* Identify required and optional fields.
* Consider normalization.
* Consider transaction boundaries.
* Consider indexing where justified.

## Rules

* Every entity must have a clear business purpose.
* Every relationship must be justified by system requirements.
* Do not create tables without a clear requirement.
* Maintain referential integrity.
* Avoid unnecessary data duplication.
* Do not store derived data unless there is a clear reason.
* Database design must remain consistent with business rules.

## Workflow

1. Analyze requirements and system model.
2. Identify business entities.
3. Identify entity attributes.
4. Define relationships.
5. Define keys and constraints.
6. Review normalization.
7. Identify indexes where necessary.
8. Validate the schema against system flows.

## Output

Produce:

* Entity list
* Entity attributes
* Relationships
* Primary and foreign keys
* Constraints
* ERD description
* Indexing considerations
* Data integrity considerations

## Restrictions

Do not:

* Create tables based only on UI components.
* Create fields without a business purpose.
* Duplicate information unnecessarily.
* Design the database independently from the system requirements.

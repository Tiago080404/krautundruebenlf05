# LF5 Datenbanken [KRAUT UND RÜBEN]

## Plan of Our Work and the Product We Want to Create

This project involves designing, implementing, and optimizing a database for our customer, **Kraut und Rüben**, using the Scrum framework. Below, we outline our workflow, progress, and the product vision.

---

## [Scrum Documentary](/scrum-documentary.md)

In our Scrum documentation, we track all sprints, providing detailed insights into the progress and steps taken to deliver the project.

---

## Scrum Board

We use **Trello** as our Scrum Board to organize tasks, plan sprints, and allocate responsibilities within the team. The board helps us visualize our workflow and ensure smooth project execution.

---

## Sprint 1: Discovery Track

### Focus: Knowledge Acquisition

- Gathered essential SQL commands into a structured [list](/sql-commands.md).
- Set up project tools like **GitLab**, **draw.io**, and **VITE** for seamless collaboration and development.
- Engaged in daily meetings to share knowledge, clarify blockers, and align goals.

### Deliverables:

- A structured list of essential SQL commands.
- Fully prepared development environment.

---

## Sprint 2: Conceptual and Logical Database Design

### Focus: Database Design and Normalization

- Reviewed the current database structure (**IST-Zustand**) and identified customer requirements.
- Created an **Entity-Relationship Model (ERM)** reflecting the target database structure (**SOLL-Zustand**).
- Applied normalization principles (1NF, 2NF, 3NF) to ensure data consistency and minimize redundancy.

### Deliverables:

- Updated and normalized [Entity Relationship Model (ERM)](/images/erd-soll-zustand.png).

---

## Sprint 3: Customize the Database and Test Data

### Focus: Environment Setup and Functionality

- Set up the **development environment** with GitLab, VITE, and Bootstrap.
- Established a connection between the **Node.js backend** and the **React frontend** using Axios for dynamic data exchange.
- Populated the database with test data and validated its structure using SQL queries.

### Key Milestones:

- First functional version of the **frontend**, showcasing real-time data from the database.
- Developed a reusable **UI component** (e.g., Navbar) for consistent design and functionality.

### Deliverables:

- [First look at the frontend](/images/1st-version-frontend.png) integrated with SQL queries.

---

## Sprint 4: Development of Queries

### Focus: Advanced Query Development

- Implemented at least three **stored procedures** for complex data retrieval.
- Created several SQL queries to meet specific customer requirements, such as:
  - Selecting recipes by ingredient count, dietary category, or calorie limits.
  - Retrieving unassigned ingredients or ingredients by recipe ID.
  - Calculating the average nutritional values for customer orders.

### Deliverables:

- Optimized and structured queries ready for backend integration.
- Expanded functionality to meet advanced customer requirements.

---

## Future Steps

1. Optimize API performance and user interface
2. User Management and Role System with Restricted Access to Admin Controls

---

This README serves as a summary of our work, complemented by the [Scrum Documentary](/scrum-documentary.md) for detailed sprint-by-sprint insights.

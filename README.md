# Project Blood Bank

The goal of the Blood Bank Management System is to organize donor
information, blood inventory, and hospital requests in order to track
donations, assign blood products as they become available, and generate
reports in a timely manner. The database is described using an Entity-
Relationship (ER) diagram which defines the entities of the system (i.e. Donor,
Hospital, Blood_Inventory, Recipient_Request) and their relationships and
constraints. To facilitate avoidance of redundancy in the database,
normalization is performed to the Third Normal Form (3NF). In the First Normal
Form (1NF), all attributes are atomic, in the Second Normal Form (2NF), partial
dependencies are resolved, and in the Third Normal Form (3NF), transitive
dependencies are avoided, preserving the integrity of the data across all the
tables. The Blood Bank Management System is developed with Flask for the
backend, PostgreSQL for the database, and a responsive frontend with
Tailwind CSS and Next.js. The major features of the Blood Bank Management
System are donor management, real-time blood inventory, automated data
validation using constraints and triggers, coordination between multiple
hospitals, and managing the system with complete Create, Read, Update, and
Delete (CRUD) functionality. Utilizing all of these features can improve
efficiency, reduce manual entry errors, and help manage blood donations and
requests on an integrated, centralized, and scalable platform.

## Instructions for setting up backend

1. Create pip env at backend folder using `python3 -m venv venv`.
2. Activate the source by `source venv\Scripts\activate` (For bash).

## For frontend

1. In frontend folder, do `npm run dev` and open the link in browser

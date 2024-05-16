# Craby CMS

This is a simple Content Management System (CMS) application built using the PERN stack (PostgreSQL, Express.js, React.js, Node.js). It allows users to create and delete entities with attributes and perform CRUD operations on the entities.

## Features

- **Create Entities:** Users can create new entities with custom attributes.
- **Delete Entities:** Users can delete entities along with their associated attributes.
- **CRUD Operations:** Users can perform CRUD operations (Create, Read, Update, Delete) on the entities.

## Technologies Used

- **Frontend:**
  - React.js
  - Tailwind CSS
  - shadcn/ui
  - Tanstack Router (for Routing) 
  - Tanstack Query (for state management)

- **Backend:**
  - Node.js
  - Express.js (RESTful API)
  - PostgreSQL (Database)
  - pg (PostgreSQL client library for Node.js)

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js and npm
- PostgreSQL

## Getting Started

1. Clone the repository:
```
git clone https://github.com/SattuSupari21/craby-cms.git
```
2. Navigate to backend and install dependencies:
 ```
 cd backend
 npm install
```
3. Navigate to frontend and install dependencies:
```
cd frontend
npm install
```
4. Set up the PostgreSQL database:
    - Create a new database named `craby`.
    - Paste the connection URL in .env file in the backend directory.
5. Create a .env file in backend directory.
```
DATABASE_URL="postgres://username:password@127.0.0.1:5432/craby"
```
6. Start the Backend and Frontend server:
```
npm run dev
```
7. Open your web browser and navigate to `http://localhost:5173` to access the application.

## Usage

1. Create Entities:
    - Select "Content Type Builder" and click on the "Create new content type" button and fill in the details.
    - Click "Finish" to create the entity.
2. Delete Entities:
    - Select an entity and click on the "Delete Entity" button on the entity you want to delete.
3. Perform CRUD Operations:
	- Select "Content Manager" and click on an entity.
    - Use the provided interface to perform CRUD operations on the entities.

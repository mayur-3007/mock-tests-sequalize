# Mock Test Platform

This is a backend platform for managing and conducting mock tests with different types of questions such as MCQ (Multiple Choice Questions), fill-in-the-blank, and match-type questions. The platform allows users to:

- Create users
- Create multiple types of questions
- Create tests by associating multiple questions
- Submit test results and view detailed test performance with a score and correct/incorrect question details.

## Features

- **Create Users**: Users can be created with a unique name.
- **Create Questions**: Supports MCQ, fill-in-the-blank, and match-type questions.
- **Create Tests**: Multiple questions can be linked to a test.
- **Submit Test Results**: Users can submit their answers for the test and receive a score.
- **View Test Results**: Users can view their results with question details, options (for MCQ), their answers, the correct answers, and whether they were correct or incorrect.

## Tech Stack

- **Node.js**: Backend runtime environment
- **Express.js**: Web framework for building the API
- **Sequelize**: A promise-based ORM library
- **MySQL**: Database for storing users, questions, tests, and results

## Prerequisites

Before running this application, ensure that you have the following:

- [Node.js](https://nodejs.org) installed
- MySQL installed and running
- Postman or any API client to test the endpoints (optional)

## Designs

- [Low Level Api Design](https://docs.google.com/document/d/1ggen2-01CSyX16DKSL6T36M47qZJ-LH0B0RPlX0-_5I/edit?tab=t.0)
- [High Level Design](https://lucid.app/lucidspark/3c489820-eac6-4fe7-b1e9-b429b5a6be9b/edit?invitationId=inv_6ad3cc48-9917-4149-bb55-372ed0449f6a)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mock-test-platform.git
cd mock-test-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL Database

### 4. Configure the MYSQL database connection

- Replace database credentials in config/config.js
- Also make sure to check redis configuration
- Run below command to create tables in database

```bash
node models/sync.js
```

### 5. Run the application

```bash
npm run dev
```


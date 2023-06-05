# Event Management System API

This is a back-end API for the Event Management System, designed and implemented as part of the Malwation Backend Internship case study.

## Features

The goal of this project is to design and implement a back-end API for an Event Management System using NodeJS, Express and MongoDB. The API provides the following features:

1. **Register User**: Allow users to register with their email and password.
2. **Login User**: Enable users to log in with their registered email and password, and receive a token for authentication.
3. **Create Event**: Allow users to create a new event by providing event details such as name, date, location, and description.
4. **Update Event**: Enable users to update the details of an existing event.
5. **Get Event**: Allow users to retrieve the details of an existing event by its ID.
6. **Delete Event**: Enable users to delete an existing event by its ID.
7. **List Events**: Allow users to retrieve a list of all existing events, with the option to filter by event date.
8. **List Users**: Allow users with appropriate authorization to retrieve a list of all registered users.
9. **Get User**: Allow users with appropriate authorization to retrieve the details of a specific user by their ID.
10. **Update User**: Allow users with appropriate authorization to update the details of a specific user.
11. **Delete User**: Allow users with appropriate authorization to delete a specific user.

## Usage

To set up and run the API, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.
4. Configure the database connection and other environment variables.
5. Run `npm start` to start the development server.

To run the API using Docker, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Build the Docker image with the command `npm run docker-build`.
4. Run the Docker container with the command `npm run docker-run`.
5. The API will be accessible at `http://localhost:3000`.

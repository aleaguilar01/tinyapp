# TinyApp

TinyApp is a collection of backend endpoints for managing URLs in a URL shortening service. It provides functionalities such as URL creation, editing, deletion, and user authentication.

## Table of Contents

- [Dependencies](#dependencies)
- [Endpoints](#endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Dependencies

TinyApp Backend is built with Node.js and Express.js framework. It uses the following dependencies:

- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js
- [cookie-session](https://www.npmjs.com/package/cookie-session): Simple cookie-based session middleware
- [bcryptjs](https://www.npmjs.com/package/bcryptjs): Library to hash passwords
- [method-override](https://www.npmjs.com/package/method-override): Middleware for overriding HTTP methods
- [ejs](https://www.npmjs.com/package/ejs): Embedded JavaScript templating engine

## Endpoints

The following are the main endpoints provided by TinyApp Backend:

- `GET /`: Root endpoint. Redirects users to the login page if not logged in, otherwise redirects to the URLs index page.
- `GET /urls`: Displays a list of URLs created by the logged-in user.
- `GET /urls/new`: Renders a form to create a new URL.
- `GET /urls/:id`: Displays details of a specific URL.
- `POST /urls`: Creates a new URL.
- `PUT /urls/:id`: Updates the URL with the specified ID.
- `DELETE /urls/:id/delete`: Deletes the URL with the specified ID.
- `GET /register`: Renders the registration page.
- `GET /login`: Renders the login page.
- `POST /register`: Registers a new user.
- `POST /login`: Logs in an existing user.
- `POST /logout`: Logs out the current user.
- `GET /u/:id`: Redirects to the long URL associated with the specified short URL ID.

## Installation

1. Clone the repository: `git clone https://github.com/aleaguilar01/tinyapp.git`
2. Install dependencies: `npm install`

## Usage

1. Start the server: `npm start`
2. Open your web browser and navigate to `http://localhost:8080`
3. Register a new account or log in with an existing account.
4. Create, edit, or delete URLs as needed.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

### Subscription Management System

This repository contains a **Subscription Management System** built with a **Flask** backend and a **React** frontend. It is designed to manage customer subscriptions, generate revenue reports, and handle subscription extensions and terminations. The system is containerized using Docker and can be easily deployed.

#### Features

1. **Customer Subscription Management**: 
   - Add, extend, and terminate customer subscriptions.
   - View existing subscriptions and filter them based on customer, product, and dates.

2. **Revenue Reporting**:
   - Generate revenue reports based on subscription data.
   - Filter reports by date ranges (e.g., last 1 month, last 3 months).

3. **Dockerized Setup**:
   - The application is containerized using Docker, with separate services for the frontend, backend, and MySQL database.

4. **Technology Stack**:
   - **Backend**: Flask, Flask-RESTful, Flask-MySQLdb.
   - **Frontend**: React with Material UI components, Chart.js for graphical reports.
   - **Database**: MySQL.
   - **Containerization**: Docker and Docker Compose.

#### Project Structure

- **backend/**:
  - `main.py`: Contains Flask routes for managing subscriptions, customers, products, and revenue reports.
  - `requirements.txt`: Lists the dependencies for the Flask application.
  - `xyz_enterprises.sql`: SQL file to initialize the database schema.

- **frontend/**:
  - `src/components/`: Contains React components for various UI elements such as `Navbar`, `Subscription`, and `RevenueReport`.
  - `vite.config.js`: Configuration for the Vite build tool.

- **docker-compose.yml**:
  - Defines services for the frontend, backend, and MySQL database, including networking and volume configurations.

#### How to Run

1. **Clone the repository**:
   ```
   git clone https://github.com/Sujeethy/Subscription.git
   cd Subscription
   ```

2. **Set up environment variables**:
   - Create a `.env` file in the `backend` directory and define MySQL credentials.
   - Set `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DB` accordingly.

3. **Start the application**:
   ```
   docker-compose up --build
   ```
   - The frontend will be available at `http://localhost:5173`.
   - The backend API will be running at `http://localhost:5000`.

4. **Access the Database**:
   - The MySQL database will be running on port `3306` and can be accessed using the credentials specified in the `.env` file.

---

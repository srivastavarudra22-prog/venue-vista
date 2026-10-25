# 🏛️ VenueVista - Venue Management & Event Booking System

**VenueVista** is a full-stack web application designed for discovering, reserving, and managing venues and events. It features dedicated portals for both **Customers** (seeking venues and event tickets) and **Venue Hosts / Providers** (managing inventory and reviewing reservation requests).

---

## 🌟 Key Features

### 👤 Customer Experience
* **Venue Discovery**: Browse venues filtered by category, location, capacity, and pricing.
* **Reservation Requests**: Submit booking requests for weddings, conferences, banquets, and open lawns.
* **Event & Ticket Booking**: Explore upcoming concerts, workshops, and summits with interactive seat reservation.
* **Booking Ledger ("My Bookings")**: Track reservation status in real-time (`PENDING`, `CONFIRMED`, `REJECTED`).
* **Host Feedback Transparency**: When a booking is rejected, the customer can view the provider's specific reason directly on their dashboard.

### 🏛️ Venue Host & Provider Portal
* **Dedicated Provider Auth**: Separate login (`/provider/login`) and host registration (`/provider/register`).
* **Executive Dashboard**: Real-time KPI summary tracking confirmed revenue, total bookings, active venues, and pending requests.
* **Reservation Approval Flow**:
  * One-click **✓ Approve** action to confirm bookings.
  * Interactive **✕ Reject** modal with quick-select reason templates (e.g. *maintenance, offline reservation conflict, guest capacity limits*) or custom message input.
* **Venue Inventory Management**: List new venues with image preview, pricing, capacity, and delete existing listings.

---

## 🏗️ Technology Stack

### Backend
* **Language & Framework**: Java 21, Spring Boot 4
* **Security & Auth**: JWT (JSON Web Tokens), BCrypt Password Hashing
* **Data & ORM**: Spring Data JPA, Hibernate
* **Database**: Embedded H2 (default, zero configuration needed) or MySQL 8.x
* **Build Tool**: Maven

### Frontend
* **Framework**: Angular 21 (Standalone Components)
* **Language**: TypeScript 5.9
* **Styling**: Modern, responsive CSS3 with card layouts and alert badges
* **Package Manager**: npm

---

## 🚀 Getting Started

### Prerequisites
* **Java**: JDK 21 or higher
* **Node.js**: v20+ or v24 LTS / v25
* **Git**: Installed and configured

---

### 1. Clone the Repository
```bash
git clone https://github.com/srivastavarudra22-prog/venue-vista.git
cd venue-vista
```

---

### 2. Backend Setup (Spring Boot)
The backend comes pre-configured with an embedded H2 database (with MySQL compatibility mode) and auto-seeds demo data upon initial startup.

```bash
cd backend
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

* **API Base URL**: `http://localhost:8080`
* **H2 Web Console**: `http://localhost:8080/h2-console`
  * *JDBC URL*: `jdbc:h2:file:./data/venuevistadb`
  * *Username*: `sa`
  * *Password*: *(blank)*

*(Optional)* To use MySQL instead of H2, update `backend/src/main/resources/application.properties` with your database credentials.

---

### 3. Frontend Setup (Angular)
In a new terminal window:

```bash
cd frontend
npm install
npm start
```

* **Application URL**: `http://localhost:4200`
* **Provider Portal**: `http://localhost:4200/provider/login`
* **Customer Portal**: `http://localhost:4200/login`

---

## 🔑 Demo Accounts

The application automatically seeds test accounts on launch:

| Role | Email | Password | Direct Portal |
| :--- | :--- | :--- | :--- |
| **Venue Provider** | `provider@example.com` | `provider123` | [Provider Login](http://localhost:4200/provider/login) |
| **System Admin** | `admin@example.com` | `admin123` | [Provider Login](http://localhost:4200/provider/login) |
| **Customer** | `demo@example.com` | `password123` | [Customer Login](http://localhost:4200/login) |

---

## 📡 REST API Summary

### Authentication (`/api/users`)
* `POST /api/users/register` - Create a customer or provider account
* `POST /api/users/login` - Authenticate user and receive JWT token

### Venues (`/api/venues`)
* `GET /api/venues` - List all venues
* `GET /api/venues/{id}` - Get venue details
* `POST /api/venues` - Create a new venue listing
* `DELETE /api/venues/{id}` - Remove a venue

### Bookings (`/api/bookings`)
* `GET /api/bookings` - List all bookings
* `POST /api/bookings` - Submit a new reservation request (starts as `PENDING`)
* `PUT /api/bookings/{id}/status` - Approve (`CONFIRMED`) or Reject (`REJECTED`) with `rejectionReason`

### Events & Tickets
* `GET /api/events` - List upcoming events
* `POST /api/tickets/book` - Reserve event tickets

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

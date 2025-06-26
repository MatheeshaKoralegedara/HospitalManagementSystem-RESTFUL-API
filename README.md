

---

## 🏥 Hospital Management System

A full-featured backend system for managing hospital operations, built using **Spring Boot** and **MySQL**. This project handles patients, doctors, appointments, drugs, and staff through RESTful API services.

---

### 🚀 Features

* 👨‍⚕️ Doctor Management
* 🩺 Patient Registration and Records
* 📅 Appointment Booking and Tracking
* 💊 Drug Inventory (Pharmacy Management)
* 🧑‍💼 Staff Administration
* 🔄 Full CRUD support via REST APIs

---

### ⚙️ Technologies Used

* **Java 17**
* **Spring Boot**
* **Spring Web**
* **Spring Data JPA**
* **MySQL Database**
* **Lombok**
* **Maven**

---

### 🔗 Example Endpoints

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/api/patients`          | Get all patients      |
| POST   | `/api/doctors`           | Add a new doctor      |
| PUT    | `/api/appointments/{id}` | Update appointment    |
| DELETE | `/api/staff/{id}`        | Delete a staff member |

---

### 💻 How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/hospital-management-system.git
   ```
2. Import the project into **IntelliJ IDEA** or **Eclipse**.
3. Create a MySQL database:

   ```sql
   CREATE DATABASE hospital_management;
   ```
4. Update `application.properties` with your DB credentials.
5. Run the project using:

   ```bash
   mvn spring-boot:run
   ```
6. Access API endpoints via Postman or frontend.





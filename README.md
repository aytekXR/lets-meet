# Let's Meet

A mobile-friendly web application designed to simplify group event scheduling by collecting availability from participants and automatically suggesting the best meeting time.

## 🌟 Features

### **Event Creation**

- Create events with multiple date/time options
- Add event details and descriptions
- Generate unique event codes automatically
- Email notifications for event creators

### **Participant Management**

- Join events using a unique event code
- Submit availability using:
  - **Quick Select**: Choose from predefined date/time options
  - **Custom Input**: Manually enter availability (frontend only)
- Track the number of submitted responses in real time

### **Smart Scheduling**

- Automatically suggest the best time based on participant availability
- Export event details to calendars (.ics file)
- Send email notifications for confirmed event times

## 🚀 Tech Stack

### **Frontend**

- React
- React Router
- Material-UI

### **Backend**

- Python
- FastAPI or Flask
- SQLAlchemy

### **Database**

- PostgreSQL

## 📱 Pages Overview

### **1. Landing Page**

- Two options: Create a new event or join an existing event
- If joining, users enter the event code
- Validation of event codes (success or error message)

### **2. Event Creation Page**

- Enter event details (name, description, potential dates/times)
- Input user details (name, email)
- Generate & copy event link
- Email event details to the creator
- Redirect to the Event Details page

### **3. Event Details Page**

- Participants enter their availability
- View the number of submitted responses
- Choose availability using:
  - Quick Select: Click predefined options
  - Custom Input: Manually enter availability (frontend only)
- Submit availability and proceed to the Confirmation Page

### **4. Confirmation Page**

- Display confirmation message
- Option to receive a calendar invitation (email input field)
- Download an .ics file for calendar integration
- Show participant availability summary

## 🛠️ Setup Guide

### **Prerequisites**

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/lets-meet.git
   cd lets-meet
   ```

2. Install dependencies:

   ```bash
   cd frontend && npm install
   cd ../backend && pip install -r requirements.txt
   ```

3. Start the development server:

   ```bash
   cd frontend && npm start
   cd ../backend && uvicorn main:app --reload
   ```

## 🐳 Docker Setup

### **Using Docker Compose (Recommended)**

1. Ensure Docker and Docker Compose are installed.
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. View logs:
   ```bash
   docker-compose logs -f
   ```

## 📝 License

[MIT License](LICENSE)


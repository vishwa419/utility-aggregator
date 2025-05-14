# Utility Aggregator Platform

## Overview

The **Utility Aggregator Platform** is a web application that integrates multiple utilities that I frequently use. I created this project to combine the power of **JavaScript** and **Python** to offer a seamless, secure, and efficient experience. By bringing these utilities under one roof, I can avoid the risks associated with using online versions that often pose **security**, **phishing**, and **network consumption** issues.

## Why This Project?

Many online utilities, while useful, come with several disadvantages, such as:
- **Security risks**: You may expose sensitive data while using web-based tools.
- **Phishing concerns**: Some tools could compromise your personal information.
- **Network consumption**: Using these tools requires constant internet access, which could affect performance and your data usage.

This platform aims to address these issues by providing offline utilities that you can use safely on your local machine. With the integration of **JavaScript** (React/Next.js) and **Python** (Flask/FastAPI or any backend API framework), you can access these utilities directly within the app, without needing to rely on third-party services.

## Features

- **PDF Conversion**: Easily convert files to PDF format.
- **Reminders**: Set reminders for important tasks and events.
- **Alarms**: Set and manage alarms to notify you of specific events.
- **Mindfulness (Just Breathe)**: Take a moment to breathe and relax with guided mindfulness.
  
## Technologies Used

- **Frontend**: 
  - **React.js**: For building a dynamic, user-friendly interface.
  - **Next.js**: For server-side rendering, SEO optimization, and easy routing.
  - **Tailwind CSS**: For styling the application with utility-first classes.
  
- **Backend**:
  - **Python (Flask/FastAPI)**: For handling API requests related to alarms and reminders.
  - **SQLite**: A simple database solution to store alarms and other utility data.

- **Others**:
  - **React Toastify**: For displaying toast notifications for success and error messages.
  
## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- **Node.js** and **npm** (for frontend)
- **Python 3.x** and **pip** (for backend)

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/utility-aggregator.git
   cd utility-aggregator
   ```

2. **Frontend Setup**:

   - Navigate to the frontend directory:
   
     ```bash
     cd frontend
     ```
   
   - Install dependencies:
   
     ```bash
     npm install
     ```
   
   - Run the development server:
   
     ```bash
     npm run dev
     ```

   - The app should be running at `http://localhost:3000`.

3. **Backend Setup**:

   - Navigate to the backend directory:
   
     ```bash
     cd backend
     ```
   
   - Install Python dependencies:
   
     ```bash
     pip install -r requirements.txt
     ```
   
   - Run the backend server:
   
     ```bash
     python app.py  # or `uvicorn main:app --reload` if using FastAPI
     ```

   - The API should now be running at `http://localhost:8000`.

4. **Database Setup** (if applicable):

   - If you're using a database, make sure to set it up accordingly.
   - You can use SQLite or any other database and modify the backend accordingly to store alarm and reminder data.

## Features Walkthrough

### 1. **PDF Conversion**:
   - Convert documents to PDF format with ease.
   - Upload your file and receive a downloadable PDF.

### 2. **Reminders**:
   - Create, view, and manage reminders for tasks and events.
   - Set reminder text and time, and the app will notify you at the designated time.

### 3. **Alarms**:
   - Add, manage, and delete alarms.
   - Toggle the activation of alarms directly within the app.
   - Set custom labels and times for alarms.

### 4. **Just Breathe**:
   - A quick way to take a mindfulness break and relax.
   - Use a simple breathing guide to help you stay calm and focused.

## Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request with your proposed changes. You can improve the functionality, fix bugs, or add new features.

### Steps to Contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add feature'`).
5. Push to your branch (`git push origin feature-name`).
6. Submit a pull request.

## License

This project is open-source and available under the MIT License.

---

## Acknowledgements

- Inspired by the need for offline utilities to replace insecure online tools.
- Tailwind CSS for providing an easy and efficient way to style the app.
- React, Next.js, and Python for making this integration possible.
```




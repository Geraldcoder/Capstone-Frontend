# Capstone-Frontend

# --------------- About the Project --------------

I built this Task Manager App as part of my learning journey to understand full-stack development. It’s a simple yet functional web application that allows users to manage their tasks efficiently. The app includes user authentication, task creation, editing, deletion, and filtering by priority. I focused on making the interface clean and intuitive while ensuring the backend logic is robust.

# ---------------- Key Features ---------------

* User Authentication:
Users can register, log in, and log out. Authentication is handled using tokens stored in localStorage.

*Task Management:
Users can:
- Create Tasks with a title, description, deadline, and priority (Low, Medium, High).
- Edit Tasks task details easily.
- Delete Tasks they no longer need.
- Filter Tasks by priority (Low, Medium, High).
- Search Tasks by looking up for keywords in the title or description.

* Responsive Design: The app works well on both desktop and mobile devices.

# ---------- Technologies Used -----------

Frontend: HTML, CSS, JavaScript.

Backend: The app communicates with a backend server hosted at https://capstone-server-last.onrender.com/api/v1 to handle user authentication and task data.(Checkout my backend README for info about backend)

Styling: Custom CSS with Google Fonts for typography and Font Awesome for icons.

# ------------- Folder Structure -------------
app.js: Contains all the JavaScript logic for handling user interactions, API calls, and DOM updates.

assets: Contains custom styles and images used in the app (e.g., register.avif for the registration page).

index.html: The main page for task management.

login.html: The login page for existing users.

register.html: The registration page for new users.


# The app is fully functional as long as the backend server is running.

# ---------------- Challenges and Learnings --------------------

While building this app, I faced a few challenges, such as:

Handling user authentication and ensuring secure token storage.
Managing state without a framework (e.g., keeping track of tasks and updating the UI dynamically).
Implementing search and filter functionality efficiently.
Through this project, I learned:
How to structure a frontend application using vanilla JavaScript.
How to interact with a REST API for CRUD operations.
The importance of clean and reusable code.

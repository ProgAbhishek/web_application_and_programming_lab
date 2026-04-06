# Kanban Project Management App
 
A collaborative Kanban board built with **Django REST Framework** + **React JS**.
 
---
 
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Backend | Django + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Frontend | React JS |
| Drag & Drop | @hello-pangea/dnd |
| Database | SQLite |
 
---
 
## Features
 
- User registration and login with JWT authentication
- Create and manage projects
- Kanban board with columns (To Do / In Progress / Done)
- Drag and drop cards between columns
- Set card priority (low / medium / high) and due dates
- Edit card details via modal
- Django Admin panel for backend management
 
---
 
## Setup
 
### Backend
```bash
cd kanban_project
python -m venv venv
venv\Scripts\activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers drf-nested-routers
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
 
### Frontend
```bash
cd kanban-frontend
npm install
npm start
```

# Bloggie

A Blog Application with a RESTful API built in **PHP Laravel** and a UI built in **React**.

## Requirements Covered

### Backend – Laravel (PHP)

**1. User Authentication (Login, Signup)**
- User fields: `name`, `email`, `password`, `image`
- Login via email + password
- All API endpoints except login/signup are protected with authentication
- Image uploads stored using Laravel's filesystem (local disk)



**2. CRUD Posts**
- Post fields: `title`, `body`, `author` (reference to User), `tags`, `comments`
- Users can only edit/delete their own posts
- Users can add comments on any post
- Users can only edit/delete their own comments
- Users can update a post's tags
- Every post must have at least one tag
- All posts are automatically deleted after 24 hours, via a scheduled job (Laravel Scheduler + Queue Worker) that runs every minute and deletes expired posts

### Database – MySQL
- MySQL as the database
- Migrations use proper keys and soft deletes
- Indexed foreign keys and proper Eloquent relationships

### UI – React
- Login & Signup forms
- Auth token stored in `localStorage`
- Feed (list of posts)
- Create/Edit/Delete Post pages
- Add/Edit/Delete comments
- Tags management UI (edit tags on a post)
- UI indicator that posts expire after 24 hours
- Communicates with the Laravel API via Axios

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Backend API    | Laravel 11, Laravel Sanctum          |
| Database       | MySQL                                |
| Scheduling     | Laravel Scheduler + Queue Worker     |
| Frontend       | React (Vite), Axios, React Router    |
| Local Dev Env  | Laragon                              |



## Project Structure

```
Bloggie/
├── Bloggie-API/     ← Laravel backend
└── Bloggie-UI/      ← React frontend
```

## Backend Setup — `Bloggie-API`

```bash
cd C:\laragon\www
composer create-project laravel/laravel Bloggie-API
cd Bloggie-API
php artisan install:api
```

Create a MySQL database named `bloggie` via Laragon's Database tool, then set `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bloggie
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=database
```

```bash
php artisan key:generate
php artisan migrate
php artisan storage:link
```

Enable CORS for the frontend:

```bash
php artisan config:publish cors
```
Add your frontend's dev URL (e.g. `http://localhost:5173`) to `allowed_origins` in `config/cors.php`.

Run these together while developing:

```bash
php artisan serve
php artisan queue:work
php artisan schedule:work
```

## Frontend Setup — `Bloggie-UI`

```bash
cd C:\laragon\www
npm create vite@latest Bloggie-UI -- --template react
cd Bloggie-UI
npm install
npm install axios react-router-dom
```

Set `.env`:

```
VITE_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint                    | Auth | Description         |
|--------|-------------------------------|:---:|-----------------------|
| POST   | `/api/register`               | No  | Create a user          |
| POST   | `/api/login`                    | No  | Log in, receive a token |
| GET    | `/api/posts`                    | Yes | List posts (feed)      |
| POST   | `/api/posts`                    | Yes | Create a post            |
| PUT    | `/api/posts/{id}`               | Yes | Edit own post             |
| DELETE | `/api/posts/{id}`               | Yes | Delete own post            |
| PUT    | `/api/posts/{id}/tags`           | Yes | Update post tags            |
| POST   | `/api/posts/{id}/comments`       | Yes | Add a comment                 |
| PUT    | `/api/comments/{id}`             | Yes | Edit own comment               |
| DELETE | `/api/comments/{id}`             | Yes | Delete own comment              |
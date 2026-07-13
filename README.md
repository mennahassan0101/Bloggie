# Bloggie

A full-stack blog application with a Laravel REST API backend and a React frontend. Users can sign up, log in, create/edit/delete their own posts, tag posts, and comment on any post. Posts automatically expire and are deleted 24 hours after creation.

## Tech Stack

| Layer          | Technology                                  |
|----------------|----------------------------------------------|
| Backend API    | Laravel 11 (PHP), Laravel Sanctum (token auth) |
| Database       | MySQL                                        |
| Queue / Cache  | Redis (optional locally, used in production) |
| Frontend       | React (Vite)                                 |
| HTTP Client    | Axios                                        |
| Local Dev Env  | Laragon                                      |

> **Note on auth:** the original spec called for JWT; this project uses **Laravel Sanctum** instead — a lighter-weight, Laravel-native token auth package that achieves the same goal (stateless, token-protected API endpoints).

## Project Structure

```
Bloggie/
├── Bloggie-API/     ← Laravel backend
└── Bloggie-UI/       ← React frontend
```

## Features

- **Auth**: signup/login with `name`, `email`, `password`, `image`; Sanctum-issued bearer tokens; all endpoints except `/register` and `/login` are protected
- **Posts**: full CRUD; each post has a title, body, author, tags, and comments
- **Ownership rules**: users can only edit/delete their own posts and comments; any authenticated user can comment on any post
- **Tags**: every post must have at least one tag; authors can update a post's tags
- **Auto-expiry**: posts are automatically deleted 24 hours after creation via a scheduled Artisan command
- **Image uploads**: stored via Laravel's filesystem (local disk, or S3 in production)

## Prerequisites

- [Laragon](https://laragon.org/) (bundles PHP, Composer, MySQL, and Node.js)
- Git

## Backend Setup — `Bloggie-API`

```bash
cd C:\laragon\www
composer create-project laravel/laravel Bloggie-API
cd Bloggie-API
php artisan install:api
```

Create the database `bloggie` via Laragon's Database button (HeidiSQL), then configure `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bloggie
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=database
CACHE_STORE=database
```

Run migrations and link storage:

```bash
php artisan key:generate
php artisan migrate
php artisan storage:link
```

Enable CORS for the frontend:

```bash
php artisan config:publish cors
```
In `config/cors.php`, add your frontend's dev URL to `allowed_origins` (e.g. `http://localhost:5173`).

Keep these running in separate terminals during development:

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

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000/api
```

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Method | Endpoint                  | Auth required | Description              |
|--------|----------------------------|:---:|---------------------------|
| POST   | `/api/register`            | No  | Create a new user          |
| POST   | `/api/login`                | No  | Log in, receive a token    |
| GET    | `/api/posts`                 | Yes | List posts                 |
| POST   | `/api/posts`                 | Yes | Create a post               |
| PUT    | `/api/posts/{id}`            | Yes | Update own post             |
| DELETE | `/api/posts/{id}`            | Yes | Delete own post             |
| POST   | `/api/posts/{id}/comments`   | Yes | Add a comment                |
| PUT    | `/api/comments/{id}`         | Yes | Edit own comment             |
| DELETE | `/api/comments/{id}`         | Yes | Delete own comment           |

Protected routes require an `Authorization: Bearer <token>` header.

## Testing

```bash
php artisan test
```
Covers happy and unhappy paths for signup/login, unauthorized access, and post/comment ownership rules.

## Deployment

- **Backend**: [Render](https://render.com) (Web Service, background worker for the queue, cron job for the scheduler)
- **Database**: [PlanetScale](https://planetscale.com) (managed MySQL)
- **Redis**: Render Key Value
- **Frontend**: [Vercel](https://vercel.com)

See project documentation for full deployment steps and environment variable configuration.

## License

This project was built as a learning/portfolio exercise.

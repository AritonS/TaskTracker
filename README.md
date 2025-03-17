# TaskTracker

A modern task management application built with Ruby on Rails and Next.js, featuring a beautiful UI and robust authentication system.

## Features

- 🔐 Secure user authentication with session management
- 🎨 Modern, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- 📋 Project management capabilities
- ✅ Task tracking and organization
- 🔄 Real-time updates
- 🛡️ CSRF protection and secure sessions

## Tech Stack

### Backend
- Ruby 3.2.2
- Ruby on Rails 7.1.3.2
- PostgreSQL
- Puma web server
- BCrypt for password hashing
- Rack CORS for handling Cross-Origin Resource Sharing

### Frontend
- Next.js 14.2.3
- TypeScript
- Tailwind CSS
- Modern component architecture
- Responsive design principles

## Getting Started

### Prerequisites
- Ruby 3.2.2
- Node.js and npm
- PostgreSQL
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AritonS/TaskTracker.git
cd TaskTracker
```

2. Install backend dependencies:
```bash
bundle install
```

3. Set up the database:
```bash
rails db:create
rails db:migrate
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the Rails server (in the root directory):
```bash
rails server
```

2. Start the Next.js development server (in the frontend directory):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Features in Detail

### User Authentication
- Secure user registration and login
- Session-based authentication
- Password hashing with BCrypt
- CSRF protection

### Project Management
- Create and manage projects
- Organize tasks within projects
- Track project progress
- Real-time updates

### Task Management
- Create, edit, and delete tasks
- Assign tasks to projects
- Track task completion status
- Filter and sort tasks

## Security Features

- CSRF Protection
- Secure session management
- Password hashing
- CORS configuration
- HTTP-only cookies
- Protected API endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

The application is deployed at [task-tracker-puce-five.vercel.app](https://task-tracker-puce-five.vercel.app/)

## Contact

Ariton Seferi - [GitHub](https://github.com/AritonS)

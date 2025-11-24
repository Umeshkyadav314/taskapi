# TaskAPI - Full-Stack REST API with Next.js

A modern, full-stack task management application built with **Next.js 16**, **TypeScript**, and **React 19**. Features JWT authentication, responsive design with light/dark mode support, and a complete REST API backend.

## 🚀 Features

- **Authentication & Security**
  - User registration and login with JWT tokens
  - Password hashing with SHA-256
  - Token-based authorization for protected routes
  - Role-based access control (User/Admin)

- **Task Management**
  - Create, read, update, and delete tasks
  - Task status management (pending/completed)
  - User-scoped data access
  - Real-time task statistics

- **UI/UX**
  - Responsive design for all devices (mobile, tablet, desktop)
  - Light and dark mode with system preference detection
  - Sun and moon icons for theme toggle
  - Modern card-based dashboard interface
  - Smooth animations and transitions

- **Developer Experience**
  - TypeScript for type safety
  - RESTful API with v1 versioning
  - Comprehensive error handling
  - Clean code structure and separation of concerns

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/v1/
│   │   ├── auth/
│   │   │   ├── register/route.ts      # User registration endpoint
│   │   │   └── login/route.ts         # User login endpoint
│   │   ├── tasks/
│   │   │   ├── route.ts               # GET all tasks, POST new task
│   │   │   └── [id]/route.ts          # GET, PUT, DELETE task by ID
│   ├── dashboard/page.tsx              # Protected dashboard page
│   ├── login/page.tsx                  # Login page
│   ├── register/page.tsx               # Registration page
│   ├── layout.tsx                      # Root layout with theme provider
│   ├── page.tsx                        # Home page
│   └── globals.css                     # Global styles with design tokens
├── components/
│   ├── ui/                             # Reusable UI components
│   ├── theme-provider.tsx              # Next-themes provider setup
│   ├── theme-toggle.tsx                # Light/dark mode toggle
│   ├── footer.tsx                      # Responsive footer
│   ├── task-form.tsx                   # Task creation/edit form
│   ├── task-list.tsx                   # Task list display
│   └── login-form.tsx                  # Login form component
├── hooks/
│   └── use-mobile.ts                   # Mobile detection hook
├── lib/
│   └── utils.ts                        # Utility functions
└── README.md                           # This file
\`\`\`

## 🔐 API Endpoints

### Authentication

#### Register User
\`\`\`http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
\`\`\`

#### Login User
\`\`\`http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
\`\`\`

### Tasks

#### Get All Tasks
\`\`\`http
GET /api/v1/tasks
Authorization: Bearer {token}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Tasks retrieved successfully",
  "tasks": [
    {
      "id": "task1",
      "title": "Complete project",
      "description": "Finish the REST API",
      "status": "pending",
      "userId": "user123",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
\`\`\`

#### Create Task
\`\`\`http
POST /api/v1/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the REST API",
  "status": "pending"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Task created successfully",
  "task": {
    "id": "task1",
    "title": "Complete project",
    "description": "Finish the REST API",
    "status": "pending",
    "userId": "user123",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
\`\`\`

#### Update Task
\`\`\`http
PUT /api/v1/tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Task updated successfully",
  "task": { ... }
}
\`\`\`

#### Delete Task
\`\`\`http
DELETE /api/v1/tasks/{id}
Authorization: Bearer {token}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Task deleted successfully"
}
\`\`\`

## 🛠 Getting Started

### Prerequisites
- Node.js 18+ (Next.js 16 requirement)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   \`\`\`bash
   git clone <repository-url>
   cd taskapi
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   JWT_SECRET=your_super_secret_key_here_change_in_production
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### 1. Create an Account
- Go to the registration page
- Enter your email, name, and password
- Click "Sign Up"

### 2. Login
- Navigate to the login page
- Enter your credentials
- You'll be redirected to the dashboard

### 3. Manage Tasks
- Create new tasks using the "New Task" button
- View all your tasks with their status
- Edit tasks by clicking the edit icon
- Delete tasks using the delete button
- Toggle task status between pending and completed

### 4. Theme Toggle
- Click the sun/moon icon in the header
- Theme preference is saved to localStorage
- Light/dark mode works on all pages

## 🎨 Design & Responsive

- **Mobile First**: Optimized for all screen sizes
- **Responsive Breakpoints**: sm, md, lg, xl
- **Dark/Light Modes**: Automatic detection with manual override
- **Tailwind CSS v4**: Modern utility-first styling
- **Smooth Animations**: Transitions and hover effects

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: SHA-256 with per-user hash
- **Route Protection**: Protected routes require valid tokens
- **User Isolation**: Users can only access their own tasks
- **Error Handling**: Safe error messages without exposing internals

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your repository
   - Add environment variables
   - Click "Deploy"

3. **Set Production JWT_SECRET**
   - Go to project settings
   - Add `JWT_SECRET` to production environment variables
   - Use a strong, random secret

## 📚 Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Theme**: next-themes
- **Authentication**: JWT (custom implementation)
- **Icons**: Lucide React
- **Components**: shadcn/ui

## 🐛 Troubleshooting

### "Token is invalid or expired"
- Clear localStorage: `localStorage.clear()`
- Log in again

### "Cannot find module"
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`

### Dark mode not persisting
- Check if cookies are enabled
- Clear browser cache
- Verify localStorage access

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests

## 📞 Support

For issues or questions:
- Check existing documentation
- Review the API endpoints section
- Examine component implementations
- Create an issue on GitHub

---

**Built with ❤️ using Next.js, TypeScript, and React**

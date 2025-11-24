"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface Task {
  id: string
  title: string
  description: string
  status: string
  userId: string
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchTasks(token)
    } catch (err) {
      console.error("Invalid user data:", err)
      router.push("/login")
    }
  }, [router])

  const fetchTasks = async (token: string) => {
    try {
      const response = await fetch("/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err) {
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
    setShowForm(false)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
    setShowForm(false)
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">TaskAPI Dashboard</h1>
            <p className="text-slate-400">{user?.name}</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-slate-300 bg-slate-700 px-3 py-1 rounded text-sm">
              {user?.role === "admin" ? "👑 Admin" : "👤 User"}
            </span>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => {
                    setShowForm(!showForm)
                    setEditingTask(null)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {showForm ? "Cancel" : "+ New Task"}
                </Button>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-slate-300 text-sm mb-3">Task Statistics</p>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>Total Tasks:</span>
                      <span className="font-bold">{tasks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-bold">{tasks.filter((t) => t.status === "completed").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-bold">{tasks.filter((t) => t.status === "pending").length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {showForm && (
              <TaskForm
                task={editingTask}
                onTaskCreated={handleTaskCreated}
                onTaskUpdated={handleTaskUpdated}
                onCancel={() => {
                  setShowForm(false)
                  setEditingTask(null)
                }}
              />
            )}

            <TaskList
              tasks={tasks}
              onTaskDeleted={handleTaskDeleted}
              onTaskEdit={(task) => {
                setEditingTask(task)
                setShowForm(true)
              }}
            />

            {tasks.length === 0 && !showForm && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <p className="text-slate-400 mb-4">No tasks yet. Create your first task!</p>
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

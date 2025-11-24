"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Task {
  id: string
  title: string
  description: string
  status: string
  userId: string
  createdAt: string
}

const ADMIN_STATUSES = ["pending", "in-progress", "completed"] as const
const USER_STATUSES = ["pending"] as const

interface TaskFormProps {
  task?: Task | null
  onTaskCreated: (task: Task) => void
  onTaskUpdated: (task: Task) => void
  onCancel: () => void
  userRole?: "admin" | "user"
}

export default function TaskForm({ task, onTaskCreated, onTaskUpdated, onCancel, userRole }: TaskFormProps) {
  const statusOptions = (userRole === "admin" ? ADMIN_STATUSES : USER_STATUSES) as readonly string[]
  const defaultStatus = statusOptions[0] ?? "pending"
  const [formData, setFormData] = useState<{ title: string; description: string; status: string }>({
    title: "",
    description: "",
    status: defaultStatus,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fallbackStatus = statusOptions[0] ?? "pending"
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: statusOptions.includes(task.status as string) ? task.status : fallbackStatus,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        status: fallbackStatus,
      })
    }
  }, [task, statusOptions])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Not authenticated")
        return
      }

      const method = task ? "PUT" : "POST"
      const url = task ? `/api/v1/tasks/${task.id}` : "/api/v1/tasks"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to save task")
        return
      }

      if (task) {
        onTaskUpdated(data.task)
      } else {
        onTaskCreated(data.task)
      }

      setFormData({ title: "", description: "", status: statusOptions[0] ?? "pending" })
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">{task ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Title</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 capitalize"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

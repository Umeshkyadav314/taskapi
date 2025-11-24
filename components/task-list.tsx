"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Task {
  id: string
  title: string
  description: string
  status: string
  userId: string
  createdAt: string
}

interface TaskListProps {
  tasks: Task[]
  onTaskDeleted: (taskId: string) => void
  onTaskEdit: (task: Task) => void
}

export default function TaskList({ tasks, onTaskDeleted, onTaskEdit }: TaskListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    setDeleting(taskId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/v1/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        onTaskDeleted(taskId)
      } else {
        alert("Failed to delete task")
      }
    } catch (err) {
      console.error("Error deleting task:", err)
      alert("An error occurred while deleting the task")
    } finally {
      setDeleting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900 text-green-200"
      case "in-progress":
        return "bg-blue-900 text-blue-200"
      default:
        return "bg-yellow-900 text-yellow-200"
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Your Tasks</h2>
      {tasks.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-8 text-center text-slate-400">No tasks to display</CardContent>
        </Card>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{task.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-3">{task.description}</p>
                  <p className="text-xs text-slate-500">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onTaskEdit(task)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleting === task.id}
                    onClick={() => handleDelete(task.id)}
                  >
                    {deleting === task.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

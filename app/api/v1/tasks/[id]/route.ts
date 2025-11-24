import { type NextRequest, NextResponse } from "next/server"

interface Task {
  id: string
  title: string
  description: string
  status: string
  userId: string
  createdAt: string
}

const tasks: Map<string, Task> = new Map()

function verifyToken(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload.sub
  } catch {
    return null
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(req.headers.get("Authorization") || "")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id
    const task = tasks.get(taskId)

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    if (task.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { title, description, status } = await req.json()

    const updatedTask: Task = {
      ...task,
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
    }

    tasks.set(taskId, updatedTask)

    return NextResponse.json({
      message: "Task updated successfully",
      task: updatedTask,
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(req.headers.get("Authorization") || "")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id
    const task = tasks.get(taskId)

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    if (task.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    tasks.delete(taskId)

    return NextResponse.json({
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

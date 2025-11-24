import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

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

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req.headers.get("Authorization") || "")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userTasks = Array.from(tasks.values()).filter((task) => task.userId === userId)

    return NextResponse.json({
      tasks: userTasks,
      count: userTasks.length,
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = verifyToken(req.headers.get("Authorization") || "")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, status } = await req.json()

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 })
    }

    const taskId = crypto.randomBytes(16).toString("hex")
    const task: Task = {
      id: taskId,
      title,
      description: description || "",
      status: status || "pending",
      userId,
      createdAt: new Date().toISOString(),
    }

    tasks.set(taskId, task)

    return NextResponse.json(
      {
        message: "Task created successfully",
        task,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

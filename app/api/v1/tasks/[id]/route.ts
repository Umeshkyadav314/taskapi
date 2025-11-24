import { prisma } from "@/lib/prisma"
import type { Task as PrismaTask } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"

const ALLOWED_STATUSES = ["pending", "in-progress", "completed"] as const

type Status = (typeof ALLOWED_STATUSES)[number]

interface TokenPayload {
  sub: string
  role?: string
}

function verifyToken(authHeader?: string): TokenPayload | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString()) as TokenPayload & {
      exp?: number
    }
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}

function normalizeStatus(status?: string): Status {
  if (!status) return "pending"
  const normalized = status.toLowerCase() as Status
  return ALLOWED_STATUSES.includes(normalized) ? normalized : "pending"
}

function serializeTask(task: PrismaTask) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as Status,
    userId: task.userId,
    createdAt: task.createdAt.toISOString(),
  }
}

export async function PUT(
  req: NextRequest,
  context: { params?: { id?: string } } = {},
) {
  try {
    const auth = verifyToken(req.headers.get("Authorization") || "")

    if (!auth?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = auth.role === "ADMIN"
    const taskId =
      context.params?.id ?? req.nextUrl.pathname.split("/").filter(Boolean).pop()

    if (!taskId) {
      return NextResponse.json({ message: "Task id missing" }, { status: 400 })
    }
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    if (!isAdmin && task.userId !== auth.sub) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { title, description, status } = await req.json()

    const updateData: { title?: string; description?: string; status?: string } = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (status) updateData.status = isAdmin ? normalizeStatus(status) : "pending"

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    })

    return NextResponse.json({
      message: "Task updated successfully",
      task: serializeTask(updatedTask),
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params?: { id?: string } } = {},
) {
  try {
    const auth = verifyToken(req.headers.get("Authorization") || "")

    if (!auth?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = auth.role === "ADMIN"
    const taskId =
      context.params?.id ?? req.nextUrl.pathname.split("/").filter(Boolean).pop()

    if (!taskId) {
      return NextResponse.json({ message: "Task id missing" }, { status: 400 })
    }
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        userId: true,
      },
    })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    if (!isAdmin && task.userId !== auth.sub) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.task.delete({
      where: { id: taskId },
    })

    return NextResponse.json({
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

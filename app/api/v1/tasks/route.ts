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

export async function GET(req: NextRequest) {
  try {
    const auth = verifyToken(req.headers.get("Authorization") || "")

    if (!auth?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = auth.role === "ADMIN"
    const whereClause = isAdmin ? undefined : { userId: auth.sub }

    const userTasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      tasks: userTasks.map(serializeTask),
      count: userTasks.length,
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = verifyToken(req.headers.get("Authorization") || "")

    if (!auth?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, status } = await req.json()

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 })
    }

    const isAdmin = auth.role === "ADMIN"
    const normalizedStatus = isAdmin ? normalizeStatus(status) : "pending"

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        status: normalizedStatus,
        userId: auth.sub,
      },
    })

    return NextResponse.json(
      {
        message: "Task created successfully",
        task: serializeTask(task),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

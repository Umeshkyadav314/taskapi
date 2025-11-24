import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

function generateToken(userId: string, role: Role): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64")
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    }),
  ).toString("base64")

  const signature = crypto
    .createHmac("sha256", process.env.JWT_SECRET || "dev-secret")
    .update(`${header}.${payload}`)
    .digest("base64")

  return `${header}.${payload}.${signature}`
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Email, password, and name are required" }, { status: 400 })
    }

    const normalizedEmail = String(email).toLowerCase()
    const hashedPassword = hashPassword(password)
    const resolvedRole = role?.toUpperCase() === "ADMIN" ? Role.ADMIN : Role.USER

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        password: hashedPassword,
        role: resolvedRole,
      },
    })

    const token = generateToken(user.id, user.role)

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const users: Map<string, any> = new Map()

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

function generateToken(userId: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64")
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
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
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Email, password, and name are required" }, { status: 400 })
    }

    if (users.has(email)) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    const userId = crypto.randomBytes(16).toString("hex")
    const hashedPassword = hashPassword(password)

    const user = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    }

    users.set(email, user)

    const token = generateToken(userId)

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

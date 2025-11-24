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
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = users.get(email)

    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const token = generateToken(user.id)

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

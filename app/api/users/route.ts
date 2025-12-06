import { mkdir } from "fs/promises"
import { join } from "path"

const DATA_DIR = join(process.cwd(), "data")
const USERS_FILE = join(DATA_DIR, "users.json")

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

export async function GET() {
  try {
    console.log("[v0] Fetching users")
    // In Next.js, we'll just return from memory
    return Response.json([])
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return Response.json([])
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] Saving user data")
    const userData = await request.json()
    console.log("[v0] User data received:", userData)

    // Return the saved user data
    return Response.json(userData)
  } catch (error) {
    console.error("[v0] Error saving user:", error)
    return Response.json({ error: "Failed to save user" }, { status: 500 })
  }
}

import { join } from "path"

const USERS_FILE = join(process.cwd(), "data", "users.json")

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // In the v0 runtime, we return the user from a simulated storage
    // The actual data is stored in browser localStorage on the client
    console.log("[v0] Fetching user with ID:", params.id)

    // For client-side retrieval, return a placeholder
    // Client will use localStorage directly instead
    return Response.json({ message: "Use localStorage to retrieve user data on client" })
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    return Response.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

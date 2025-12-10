import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

export async function TestConnection() {
  try {
    console.log("Connecting to database...")
    //testing whether the connection is successful or not
    const rows = await sql`SELECT * FROM files ORDER BY id DESC LIMIT 5`

    console.log("Connected successfully!")
    console.log("Sample rows from 'files' table:")
    console.log(rows)

  } catch (error) {
    console.error("❌ Database connection error:", error)
  }
}

TestConnection()

export default sql

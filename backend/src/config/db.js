import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const connectDB = async () => {
    try {
        const client = await pool.connect();

        console.log("✅ Database connected successfully");

        client.release();
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
};

export { pool };
export default connectDB;
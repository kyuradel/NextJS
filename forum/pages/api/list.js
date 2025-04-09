// pages/api/list.js
import { connectDB } from "@/util/database";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const db = (await connectDB).db("forum");
      const posts = await db.collection("post").find().toArray();
      res.status(200).json(posts); // ✅ 응답
    } catch (err) {
      console.error("DB 조회 오류:", err);
      res.status(500).json({ message: "서버 오류" });
    }
  } else {
    res.status(405).json({ message: "허용되지 않은 메서드" });
  }
}

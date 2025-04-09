import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = (await connectDB).db("forum");
    await db.collection("post").updateOne(
      { _id: new ObjectId(req.body._id) },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      }
    );
    res.redirect("/list"); // 수정 완료 후 리스트 페이지로 이동
  }
}

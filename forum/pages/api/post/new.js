import { connectDB } from "@/util/database";

export default async function handler(req, res) {
    
    if (req.method === "POST") {
        try {
            const db = (await connectDB).db("forum");

            const { title, content } = req.body;

            await db.collection("post").insertOne({
                title,
                content,
                createdAt: new Date(),
            });

            res.status(200).redirect("/list");
        } catch (err) {
            console.error("글 저장 오류:", err);
            res.status(500).json({ message: "서버 오류"});
        }
    } else {
        res.status(405).json({ message: "허용되지 않은 메서드"});
    }
}
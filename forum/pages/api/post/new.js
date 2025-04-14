import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    let session = await getServerSession(req, res, authOptions)
    if (session) {
        req.body.author = session?.user?.email
    }

    if (req.method === "POST") {
        try {
            const db = (await connectDB).db("forum");

            const { title, content } = req.body;

            await db.collection("post").insertOne(
                //{
                //title,
                //content,
                //createdAt: new Date(),
                //}
                req.body
            );

            res.status(200).redirect("/list");
        } catch (err) {
            console.error("글 저장 오류:", err);
            res.status(500).json({ message: "서버 오류"});
        }
    } else {
        res.status(405).json({ message: "허용되지 않은 메서드"});
    }
}
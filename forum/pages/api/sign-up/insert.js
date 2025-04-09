import { connectDB } from "@/util/database";

export default async function handler(req, res) {
    
    if (req.method === "POST") {

        const { id, password } = req.body;

        if (!id || !password) {
            return res.status(400).json({ message : "아이디와 비밀번호는 필수입니다." });
        }

        try {
            const db = (await connectDB).db("member");

            // 1. DB에 같은 ID가 있는지 검사
            const existingUser = await db.collection("members").findOne({id});
        
            if (existingUser) {
                return res.status(400).send("이미 존재하는 아이디입니다.");
            }

            // 2. 없으면 회원 정보 저장
            await db.collection("members").insertOne({
                id,
                password,
                createdAt: new Date(),
            });

            res.status(200).redirect("/");
        } catch (err) {
            console.error("회원가입 오류:", err);
            res.status(500).json({ message: "서버 오류" });
        }
    } else {
        res.status(405).json({ message: "허용되지 않은 메서드" });
    }  
}
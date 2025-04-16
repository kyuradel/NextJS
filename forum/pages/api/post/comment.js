import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "허용되지 않은 메서드" });
    }

    if (req.method === "POST") {
        try {
            const session = await getServerSession(req, res, authOptions);
            if(!session) {
                return res.status(401).json({ message: "로그인이 필요합니다." });
            }

            // 요청 본문 파싱 - JSON 형식으로 전송된 경우
            let commentData;
            try {
                // 문자열로 전송된 경우 파싱
                if (typeof req.body === 'string') {
                    const { content, parent } = JSON.parse(req.body);
                    commentData = { content, parent };
                } else {
                    // 이미 객체인 경우 (Content-Type: application/json으로 전송된 경우)
                    const { content, parent } = req.body;
                    commentData = { content, parent };
                }
            } catch (e) {
                // JSON 파싱 실패 시 원시 데이터 사용 (단순 문자열로 전송된 경우)
                commentData = {
                    content: req.body,
                    parent: req.query.parent
                };
            }

            // 필수 데이터 검증
            if (!commentData.content) {
                return res.status(400).json({ message: "댓글 내용이 필요합니다." });
            }

            if (!commentData.parent) {
                return res.status(400).json({ message: "게시글 ID가 필요합니다." });
            }

            const db = (await connectDB).db("forum");

            // 댓글 저장
            const result = await db.collection("comment").insertOne({
                content: commentData.content,
                author: session.user.email,
                parent: new ObjectId(commentData.parent),
                authorName: session.user.name || session.user.email.split('@')[0],
                createdAt: new Date()
            });

            // 성공 응답
            res.status(200).redirect("/list");
        } catch (err) {
            console.error("글 저장 오류:", err);
            res.status(500).json({ message: "서버 오류"});
        }
    } else {
        res.status(405).json({ message: "허용되지 않은 메서드"});
    }
}
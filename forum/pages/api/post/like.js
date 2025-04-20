import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    // 로그인 여부 확인
    const session = await getServerSession(req, res, authOptions);
    if(!session) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // POST 요청 처리 (좋아요 토글)
    if (req.method === "POST") {
        try {
            const { postId } = JSON.parse(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
        
            if (!postId) {
                return res.status(400).json({ message: "게시글 ID가 필요합니다." });
            }

            const db = (await connectDB).db("forum");
            const userId = session.user.email; // 사용자 식별자로 이메일 사용

            // 이미 좋아요를 눌렀는지 확인
            const existringLike = await db.collection("likes").findOne({
                postId: new ObjectId(postId),
                userId: userId
            });
            
            // 이미 좋아요를 눌렀으면 삭제 (좋아요 취소)
            if (existringLike) {
                await db.collection("likes").deleteOne({
                    _id: existringLike._id
                });

                return res.status(200).json({
                    liked: false,
                    message: "좋아요가 취소되었습니다."
                });
            }

            // 좋아요가 없으면 새로 생성
            else {
                await db.collection("likes").insertOne({
                    postId: new ObjectId(postId),
                    userId: userId,
                    createdAt: new Date()
                });

                return res.status(200).json({
                    liked: true,
                    message: "좋아요가 추가되었습니다."
                });
            }
        } catch (error) {
            console.error("좋아요 처리 오류:", error);
            return res.status(500).json({ message: "서버 오류가 발생했습니다." });
        }
    }

    // GET 요청 처리 (좋아요 상태 및 개수 확인)
    else if (req.method === "GET") {
        try {
            const { postId } = req.query;

            if (!postId) {
                return res.status(400).json({ message: "게시글 ID가 필요합니다." });
            }

            const db = (await connectDB).db("forum");
            const userId = session.user.email;
            
            // 총 좋아요 개수 조회
            const likeCount = await db.collection("likes").countDocuments({
                postId: new ObjectId(postId)
            });

            // 현재 사용자의 좋아요 여부 확인
            const userLiked = await db.collection("likes").findOne({
                postId: new ObjectId(postId),
                userId: userId
            });

            return res.status(200).json({
                count: likeCount,
                liked: !!userLiked
            });
        } catch (error) {
            console.error("좋아요 조회 오류:", error);
            return res.status(500).json({ message: "서버 오류가 발생했습니다." });
        }
    }

    // 지원하지 않는 메서드
    else {
        return res.status(405).json({ message: "허용되지 않는 메서드입니다." });
    }
        
}

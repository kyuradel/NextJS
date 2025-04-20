// pages/api/post/comment.js
import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    console.log("API 호출:", req.method, req.url);

    // GET 메서드 처리 (댓글 목록 조회)
    if (req.method === "GET") {
        try {
            console.log("GET 요청 처리 - 쿼리:", req.query);
            const { parent } = req.query;
            
            if (!parent) {
                return res.status(400).json({ 
                    message: "게시글 ID가 필요합니다",
                    comments: [] 
                });
            }
            
            const db = (await connectDB).db("forum");
            
            // 부모 ID가 유효한지 확인
            let parentId;
            try {
                parentId = new ObjectId(parent);
            } catch (error) {
                console.error("잘못된 ObjectId 형식:", parent);
                return res.status(400).json({ 
                    message: "유효하지 않은 게시글 ID 형식입니다",
                    comments: [] 
                });
            }
            
            // 해당 게시글의 댓글 목록 조회 (최신순)
            const comments = await db.collection("comment")
                .find({ parent: parentId })
                .sort({ createdAt: -1 })
                .toArray();
            
            console.log(`${comments.length}개의 댓글을 찾았습니다`);
            return res.status(200).json({ comments });
        } catch (err) {
            console.error("댓글 조회 오류:", err);
            return res.status(500).json({ 
                message: "서버 오류",
                comments: [] 
            });
        }
    }
    
    // POST 메서드 처리 (댓글 작성)
    if (req.method === "POST") {
        try {
            console.log("POST 요청 처리");
            
            // 세션 확인 (로그인 여부)
            const session = await getServerSession(req, res, authOptions);
            if (!session) {
                return res.status(401).json({ message: "로그인이 필요합니다" });
            }
            
            // 요청 본문 파싱
            let commentData;
            try {
                if (typeof req.body === 'string') {
                    commentData = JSON.parse(req.body);
                } else {
                    commentData = req.body;
                }
                
                console.log("받은 댓글 데이터:", commentData);
            } catch (e) {
                console.error("본문 파싱 오류:", e);
                return res.status(400).json({ message: "잘못된 요청 형식입니다" });
            }
            
            const { content, parent } = commentData;
            
            // 필수 데이터 검증
            if (!content) {
                return res.status(400).json({ message: "댓글 내용이 필요합니다" });
            }
            
            if (!parent) {
                return res.status(400).json({ message: "게시글 ID가 필요합니다" });
            }
            
            // DB 연결
            const db = (await connectDB).db("forum");
            
            // 부모 ID가 유효한지 확인
            let parentId;
            try {
                parentId = new ObjectId(parent);
            } catch (error) {
                console.error("잘못된 ObjectId 형식:", parent);
                return res.status(400).json({ message: "유효하지 않은 게시글 ID 형식입니다" });
            }
            
            // 댓글 저장
            const result = await db.collection("comment").insertOne({
                content: content,
                author: session.user.email,
                parent: parentId,
                authorName: session.user.name || session.user.email.split('@')[0],
                createdAt: new Date()
            });
            
            console.log("댓글 저장 성공:", result.insertedId);
            
            // 성공 응답
            res.status(200).json({ 
                success: true, 
                message: "댓글이 등록되었습니다",
                commentId: result.insertedId
            });
        } catch (err) {
            console.error("댓글 저장 오류:", err);
            res.status(500).json({ message: "서버 오류", error: err.message });
        }
    } else {
        // 다른 메서드는 허용하지 않음
        return res.status(405).json({ message: "허용되지 않은 메서드" });
    }
}
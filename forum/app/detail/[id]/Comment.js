'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function Comment({ postId }) {
    // 상태 관리
    const [comment, setComment] = useState('')
    const [commentList, setCommentList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    // 세션
    const { data: session } = useSession()
    
    // 댓글 목록 불러오기
    const fetchComments = async () => {
        if (!postId) {
            console.log("postId가 없습니다");
            return;
        }
        
        try {
            // postId 사용
            console.log("댓글 불러오기 시도:", postId);
            const response = await fetch(`/api/post/comment?parent=${postId}`, { 
                method: 'GET' 
            });
            
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("불러온 댓글:", data);
            setCommentList(data.comments || []);
        } catch (error) {
            console.error("댓글 불러오기 오류:", error);
            setError("댓글을 불러오는 중 오류가 발생했습니다");
        }
    }
    
    // 컴포넌트 마운트 시 댓글 불러오기
    useEffect(() => {
        if (postId) {
            console.log("댓글 불러오기 실행 (postId):", postId);
            fetchComments();
        }
    }, [postId]);
    
    // 댓글 전송 핸들러
    const handleSubmitComment = async () => {
        // 빈 댓글 방지
        if (!comment.trim()) {
            alert("댓글 내용을 입력해주세요");
            return;
        }
        
        // 로그인 확인
        if (!session) {
            alert("댓글을 작성하려면 로그인이 필요합니다");
            return;
        }
        
        // postId 확인
        if (!postId) {
            alert("게시글 정보가 없습니다");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // response 변수 선언 확인
            const response = await fetch('/api/post/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    parent: postId
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "댓글 등록에 실패했습니다");
            }
            
            const data = await response.json();
            
            // 댓글 전송 성공
            setComment(''); // 입력 필드 초기화
            fetchComments(); // 댓글 목록 새로고침
        } catch (error) {
            console.error("댓글 전송 오류:", error);
            setError(error.message || "댓글 등록 중 오류가 발생했습니다");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="comment-section">
            <h3>댓글 목록</h3>
            
            {/* 오류 메시지 표시 */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {/* 댓글 목록 */}
            <div className="comment-list">
                {commentList && commentList.length > 0 ? (
                    commentList.map((item, index) => (
                        <div key={item._id || index} className="comment-item">
                            <div className="comment-author">
                                {item.authorName || item.author || '익명'}
                            </div>
                            <div className="comment-content">{item.content}</div>
                            <div className="comment-date">
                                {item.createdAt ? new Date(item.createdAt).toLocaleString() : '방금 전'}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                )}
            </div>
            
            {/* 댓글 입력 */}
            <div className="comment-input">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    disabled={!session || loading}
                />
                <button 
                    onClick={handleSubmitComment}
                    disabled={!session || loading}
                >
                    {loading ? "전송 중..." : "댓글 작성"}
                </button>
            </div>
            
            {/* 로그인 안내 */}
            {!session && (
                <p className="login-notice">
                    댓글을 작성하려면 <a href="/api/auth/signin">로그인</a>이 필요합니다.
                </p>
            )}
        </div>
    )
}
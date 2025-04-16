'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Comment({ postId }) {
    let [comment, setComment] = useState('')
    const [commentList, setCommentList] = useState([])
    const [loading, setLoading] = useState(false)

    // 세션 및 라우터
    const { data: session } = useSession()
    const router = useRouter()

    // 댓글 목록 불러오기
    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/detail/comment?parent=${postd}`,
                {
                    method: 'GET'
                }
            )
            const data = await response.json()

            if (response.ok) {
                setCommentList(data.comments)
            } else {
                console.error('댓글 불러오기 실패:', data.message)
            }
        } catch (error) {
            console.error("댓글 불러오기 오류:", error)
        }
    }

    // 컴포넌트 마운트 시 댓글 불러오기
    useEffect(() => {
        if (postId) {
            fetchComments()
        }
    }, [postId])

    // 댓글 전송 핸들러
    const handleSubmitComment = async () => {
        // 빈 댓글 방지
        if (!comment.trim()) {
            alert("댓글 내용을 입력해주세요.")
            return
        }
    

    // 로그인 확인
    if (!session) {
        alert("댓글을 작성하려면 로그인이 필요합니다.")
        return 
    }

    setLoading(true)

    try {
        const resposne = await fetch('/api/detail/comment', {
            method: 'POST',
            headers: {
                'Cotent-Type': 'application/json'
            },
            body: JSON.stringify({
                content: comment,
                parent: postId
            })
        })
        
        const data = await response.json()

        if (response.ok) {
            // 댓글 전송 성공
            setComment('') // 입력 필드 초기화
            fetchComments() // 댓글 목록 새로고침
            router.refresh() // 페이지 상태 갱신 (선택사항)
        } else {
            alert(data.message || "댓글 등록에 실패했습니다")
        }
    } catch (error) {
        console.error("댓글 전송 오류:", error)
        alert("오류가 발생했습니다")
    } finally {
        setLoading(false)
    }
}

return (
    <div className="comment-section">
        <h3>댓글 목록</h3>
        
        {/* 댓글 목록 */}
        <div className="comment-list">
            {commentList.length > 0 ? (
                commentList.map((item) => (
                    <div key={item._id} className="comment-item">
                        <div className="comment-author">
                            {item.authorName || item.author}
                        </div>
                        <div className="comment-content">{item.content}</div>
                        <div className="comment-date">
                            {new Date(item.createdAt).toLocaleString()}
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
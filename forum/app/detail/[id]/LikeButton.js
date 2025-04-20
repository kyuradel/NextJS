'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function LikeButton({ postId }) {
    const { data: session } = useSession()
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [loading, setLoading] = useState(false)

    // 좋아요 상태 불러오기
    useEffect(() => {
        if (session && postId) {
            fetchLikeStatus()
        }
    }, [session, postId])

    const fetchLikeStatus = async () => {
        try {
            const res = await fetch(`/api/post/like?postId=${postId}`)
            if (res.ok) {
                const data = await res.json()
                setLiked(data.liked)
                setLikeCount(data.count)
            }
        } catch (error) {
            console.error('좋아요 상태 불러오기 오류:', error)
        }
    }

    // 좋아요 토글 함수
    const toggleLike = async () => {
        // 즉시 UI 업데이트 (낙관적 업데이트)
        const newLikedState = !liked;
        const newCount = newLikedState ? likeCount + 1 : likeCount - 1;
        
        setLiked(newLikedState);
        setLikeCount(newCount);
        
        // 백그라운드에서 API 요청
        try {
          const res = await fetch('/api/post/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId })
          });
          
          // API 응답이 예상과 다르면 상태 되돌리기
          if (!res.ok) {
            setLiked(!newLikedState);
            setLikeCount(newLikedState ? newCount - 1 : newCount + 1);
          }
        } catch (error) {
          // 오류 발생 시 상태 되돌리기
          setLiked(!newLikedState);
          setLikeCount(newLikedState ? newCount - 1 : newCount + 1);
          console.error('좋아요 처리 오류:', error);
        }
      }

    return (
        <div className="like-button-container">
            <button 
            onClick={toggleLike}
            disabled={loading || !session}
            className={`like-button ${liked ? 'liked' : ''}`}>
            {/* 좋아요 아이콘 (하트 모양) */}
            {liked ? '❤️' : '🤍'} 
            <span className="like-count">{likeCount}</span>
            </button>

            {!session && (
            <small className="login-notice">
            좋아요를 누르려면 로그인이 필요합니다
            </small>
            )}
        </div>
    )
}
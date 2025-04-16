'use client'

import { useSession } from "next-auth/react";
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ListItem(props){
    const router = useRouter();
    const { data: session } = useSession();

    const handelDelete = (id) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            fetch(`/api/post/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            })
            .then((r) => r.json())
            .then((result) => {
                if (result.success) {
                    router.refresh();
                } else {
                    alert(result.message || '삭제 실패');
                }
            })
            .catch(error => {
                console.error('삭제 중 오류:', error);
                alert('삭제 중 오류가 발생했습니다.');
            });
        }
    };

    // 관리자인지 확인하는 함수
    const isAdmin = () => {
        return session && session.user && session.user.role === 'admin';
    }

    // 글 작성자인지 확인하는 함수
    const isAuthor = (authorEmail) => {
        return session && session.user && session.user.email === authorEmail;
    }
    
    return (
        <>
        {props.result.map((item, idx) => (
            <div className="list-item" key={idx}>
                <h4><Link href={`/detail/${item._id}`}>{item.title}</Link></h4>
                {/* 수정 버튼 - 글 작성자만 표시 */}
                {isAuthor(item.author) && (<Link href={`/edit/${item._id}`}>✏️</Link>) }
                {/* 삭제 버튼 - 글 작성자 또는 관리자에게 표시 */}
                { (isAuthor(item.author) || isAdmin()) && (
                    <span onClick={() => handelDelete(item._id)} 
                    style={{ cursor: 'pointer' }}>🗑️</span>
                )}
                <p>{item.content}</p>
                <p className="author">작성자: {item.author}</p>
            </div>
        ))}
        </>
    )
}
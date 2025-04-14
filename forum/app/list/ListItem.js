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
    
    return (
        <>
        {props.result.map((item, idx) => (
            <div className="list-item" key={idx}>
                <h4><Link href={`/detail/${item._id}`}>{item.title}</Link></h4>
                <Link href={`/edit/${item._id}`}>✏️</Link>
                { session && session.user && session.user.email === item.author && (
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
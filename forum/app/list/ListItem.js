'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ListItem(props){
    const router = useRouter();
    
    // 순수 Ajax를 사용한 삭제 함수
    const handleDelete = (id) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            // XMLHttpRequest 객체 생성
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/api/post/delete?id=${id}`, true);
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log('삭제 성공');
                    router.refresh(); // 페이지 새로고침
                } else {
                    console.error('삭제 실패:', xhr.status);
                    alert('삭제에 실패했습니다.');
                }
            };
            
            xhr.onerror = function() {
                console.error('네트워크 오류');
                alert('네트워크 오류가 발생했습니다.');
            };
            
            xhr.send();
        }
    };
    
    return (
        <>
        {props.result.map((item, idx) => (
            <div className="list-item" key={idx}>
                <h4><Link href={`/detail/${item._id}`}>{item.title}</Link></h4>
                <Link href={`/edit/${item._id}`}>✏️</Link>
                <span onClick={(e) => {
                    fetch('/api/post/delete', {method : 'DELETE', body : JSON.stringify({ id: item._id })})
                    .then((r) => r.json())
                    .then(() => {
                        //router.refresh();
                        e.target.parentElement.style.opacity = 0;
                        setTimeout(()=> {
                            e.target.parentElement.style.display = 'none'
                        }, 1000)
                    })
                }}>🗑️</span>
                <p>{item.content}</p>
            </div>
        ))}
        </>
    )
}
'use client'

import { useRouter } from "next/navigation"

export default function DetailLink(){
    let router = useRouter()
    return (
        <button onClick={()=>{ router.prefetch('/detail/dsds') }}>버튼</button>
    )
}
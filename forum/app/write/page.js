import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function Write() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return <div>로그인이 필요합니다.</div>
    } else {
        return (
            <div>
                <h4>글작성</h4>
                <form action="/api/post/new" method="POST">
                    <input name="title" placeholder="input title"/>
                    <input name="content" placeholder="input content"/>
                    <button type="submit">버튼</button>
                </form>
            </div>
        )
    }
}
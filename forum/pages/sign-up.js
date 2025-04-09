export default function SignUp() {
    return (
        <div>
            <h4>회원가입</h4>
            <form action="/api/sign-up/insert" method="POST">
                <input name="id" placeholder="input your id" required/>
                <input name="password" placeholder="input your password" required/>
                <button type="submit">가입하기</button>
            </form>
        </div>
    )
}
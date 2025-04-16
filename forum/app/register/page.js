'use client' // Next.js 13 이상에서 클라이언트 컴포넌트임을 명시

import { useState } from 'react' // 상태 관리를 위한 React Hook
import { useRouter } from 'next/navigation' // 페이지 이동을 위한 Next.js 라우터

export default function RegisterPage() {
  const router = useRouter() // 페이지 이동을 위한 라우터 인스턴스 생성
  
  // 폼 데이터를 저장할 상태 변수 (이름, 이메일, 비밀번호)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  
  // 각 필드별 오류 메시지를 저장할 상태 변수
  const [errors, setErrors] = useState({})
  
  // 폼 제출 중 로딩 상태를 관리하는 변수
  const [loading, setLoading] = useState(false)
  
  // 입력 필드 값이 변경될 때 호출되는 이벤트 핸들러
  const handleChange = (e) => {
    // 입력된 필드의 이름과 값을 사용하여 formData 상태 업데이트
    setFormData({ ...formData, [e.target.name]: e.target.value })
    
    // 해당 필드에 오류가 있었다면 지움 (사용자가 수정 중이므로)
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }
  
  // 아이디(이름) 중복 확인 함수 - 입력 필드에서 포커스가 빠져나갈 때(onBlur) 호출됨
  const checkName = async () => {
    if (!formData.name) return // 이름이 비어있으면 확인하지 않음
    
    // 서버 API에 중복 확인 요청
    const res = await fetch(`/api/auth/check-field?field=name&value=${formData.name}`)
    const data = await res.json()
    
    // 이미 사용 중인 아이디라면 오류 메시지 설정
    if (!data.available) {
      setErrors({ ...errors, name: '이미 사용 중인 아이디입니다' })
      return false
    }
    return true
  }
  
  // 이메일 중복 확인 함수 - 입력 필드에서 포커스가 빠져나갈 때(onBlur) 호출됨
  const checkEmail = async () => {
    if (!formData.email) return // 이메일이 비어있으면 확인하지 않음
    
    // 서버 API에 중복 확인 요청
    const res = await fetch(`/api/auth/check-field?field=email&value=${formData.email}`)
    const data = await res.json()
    
    // 이미 사용 중인 이메일이라면 오류 메시지 설정
    if (!data.available) {
      setErrors({ ...errors, email: '이미 사용 중인 이메일입니다' })
      return false
    }
    return true
  }
  
  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setLoading(true) // 로딩 상태 활성화
    
    try {
      // 아이디와 이메일 중복 확인
      const nameOk = await checkName()
      const emailOk = await checkEmail()
      
      // 중복 확인에 실패하면 함수 종료
      if (!nameOk || !emailOk) {
        setLoading(false)
        return
      }
      
      // 회원가입 API 요청
      const response = await fetch('/api/auth/signup', {
        method: 'POST', // HTTP 메서드
        headers: { 'Content-Type': 'application/json' }, // 요청 헤더
        body: JSON.stringify(formData) // 요청 본문 (JSON으로 변환)
      })
      
      const data = await response.json() // 응답 데이터 파싱
      
      // 요청이 실패하면 오류 발생
      if (!response.ok) throw new Error(data.error || '회원가입 실패')
      
      // 성공 시 로그인 페이지로 이동 (registered=true 쿼리 파라미터 추가)
      router.push('/api/auth/signin?registered=true')
    } catch (err) {
      // 오류 발생 시 일반 오류 메시지 설정
      setErrors({ ...errors, general: err.message })
    } finally {
      // 성공이든 실패든 로딩 상태 비활성화
      setLoading(false)
    }
  }
  
  // 컴포넌트 UI 렌더링
  return (
    <div>
      <h4>회원가입</h4>
      {/* 일반 오류 메시지가 있으면 표시 */}
      {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
      
      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit}>
        {/* 이름(아이디) 입력 필드 */}
        <div>
          {/* label과 input 연결을 위해 htmlFor와 id 속성 사용 (접근성 향상) */}
          <label htmlFor="name">이름</label>
          <input 
            id="name"
            name="name" 
            type="text" 
            placeholder="이름을 입력하세요" 
            value={formData.name} // 제어 컴포넌트를 위한 value 설정
            onChange={handleChange} // 값 변경 시 이벤트 핸들러
            onBlur={checkName} // 포커스를 잃을 때 중복 확인
            required // HTML5 기본 유효성 검사
          />
          {/* 이름 필드 오류 메시지가 있으면 표시 */}
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>
        
        {/* 이메일 입력 필드 */}
        <div>
          <label htmlFor="email">이메일</label>
          <input 
            id="email"
            name="email" 
            type="email" // 이메일 타입 (기본 검증 제공)
            placeholder="이메일을 입력하세요" 
            value={formData.email}
            onChange={handleChange}
            onBlur={checkEmail} // 포커스를 잃을 때 중복 확인
            required 
          />
          {/* 이메일 필드 오류 메시지가 있으면 표시 */}
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        
        {/* 비밀번호 입력 필드 */}
        <div>
          <label htmlFor="password">비밀번호</label>
          <input 
            id="password"
            name="password" 
            type="password" // 비밀번호 타입 (텍스트 숨김)
            placeholder="비밀번호를 입력하세요" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        
        {/* 제출 버튼 */}
        <button 
          type="submit" 
          disabled={loading} // 로딩 중에는 버튼 비활성화
        >
          {loading ? '처리중...' : '회원가입'} {/* 로딩 상태에 따라 텍스트 변경 */}
        </button>
      </form>
    </div>
  )
}
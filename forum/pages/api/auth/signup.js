import { connectDB } from "@/util/database";
import bcrypt from "bcrypt"; // 비밀번호 해싱을 위한 라이브러리

export default async function handler(req, res) {
  // POST 메서드만 허용 (RESTful API 원칙)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메서드입니다' });
  }

  try {
    // 요청 본문에서 사용자 정보 추출
    const { name, email, password } = req.body;

    // 기본 유효성 검사 - 실무에서는 더 엄격한 검증이 필요함
    if (!name || !email || !password) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요' });
    }

    // 데이터베이스 연결
    const db = (await connectDB).db('forum');
    
    // 사용자 이름 또는 이메일 중복 확인
    const existingUser = await db.collection('user_cred').findOne({
      $or: [{ name }, { email }]
    });

    // 중복된 사용자가 있으면 에러 응답
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.name === name 
          ? '이미 사용 중인 이름입니다' 
          : '이미 사용 중인 이메일입니다' 
      });
    }

    // 비밀번호 해싱 (보안을 위한 필수 단계)
    const hashedPassword = await bcrypt.hash(password, 10); // 10은 salt rounds

    // 새 사용자 생성 및 DB에 저장
    const result = await db.collection('user_cred').insertOne({
      name,
      email,
      password: hashedPassword, // 절대 평문 비밀번호 저장 금지
      role: 'user', // 기본 사용자 역할
      createdAt: new Date() // 생성 시간 기록
    });

    // 성공 응답 - 민감한 정보 제외하고 반환
    res.status(201).json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    // 서버 오류 로깅 및 응답
    console.error('회원가입 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
}
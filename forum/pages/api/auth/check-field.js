import { connectDB } from "@/util/database";

export default async function handler(req, res) {
    // GET 메서드만 허용 - 데이터 조회는 GET 사용
    if (req.method !== 'GET') {
      return res.status(405).json({ error: '허용되지 않는 메서드입니다' });
    }
  
    // URL 쿼리에서 필드 타입과 값 추출
    const { field, value } = req.query;
  
    // 필수 파라미터 확인
    if (!field || !value) {
      return res.status(400).json({ error: '필드와 값이 제공되지 않았습니다' });
    }
  
    // 보안: 허용된 필드만 검증 (SQL 인젝션 등 방지)
    if (!['name', 'email'].includes(field)) {
      return res.status(400).json({ error: '유효하지 않은 필드입니다' });
    }
  
    try {
      // DB 연결
      const db = (await connectDB).db('forum');
      
      // 동적 쿼리 생성 - 필드명을 키로 사용한 객체 생성
      // MongoDB에서는 { [field]: value } 형태로 조회 가능
      const query = { [field]: value };
      
      // DB에서 해당 필드값을 가진 사용자 조회
      const existingUser = await db.collection('user_cred').findOne(query);
      
      // 결과 반환: available이 true면 사용 가능, false면 이미 사용 중
      res.status(200).json({ available: !existingUser });
    } catch (error) {
      // 서버 오류 로깅 및 응답
      console.error('필드 확인 오류:', error);
      res.status(500).json({ error: '서버 오류가 발생했습니다' });
    }
  }
/*import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  // DELETE 요청일 때만 처리
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  const { id } = req.query; // URL 파라미터에서 id 가져오기
  
  try {
    const db = (await connectDB).db('forum');
    const result = await db.collection('post').deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    if (result.deletedCount === 1) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ success: false, message: '삭제할 항목을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('삭제 중 오류:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
*/
import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions)

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  // 로그인 여부 확인
  if (!session) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }

  // 요청 본문에서 ID 가져오기
  //const { id } = JSON.parse(req.body);
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: '삭제할 글 ID가 필요합니다' });
  }

  try {
    const db = (await connectDB).db('forum');
    const post = await db.collection('post').findOne({ _id: new ObjectId(id) });


    if (!post) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.'});
    }

    const isAdmin = session.user.role === 'admin';
    const isAuthor = post.author === session.user.email;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.'});
    }

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
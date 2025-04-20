// app/detail/[sub]/page.js
import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import Comment from "./Comment"
import LikeButton from "./LikeButton";
import { notFound } from "next/navigation";

export default async function Detail({ params }) {

  async function getPostId() {
    return params.id;
  }

  const postId = await getPostId();
  
  const loadPost = async () => {
    try {
      const db = (await connectDB).db("forum");
      const result = await db.collection("post").findOne({
        _id: new ObjectId(params.id)
      });

      if(result === null) {
        return notFound()
      }

      return result;
    } catch (error) {
      console.error("게시글 로드 오류:", error);
      return null;
    }
  };


  const post = await loadPost();

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      <h4>상세페이지</h4>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <LikeButton postId={String(postId)}/>
      <Comment postId={String(postId)}/>
    </div>
  );
 
}

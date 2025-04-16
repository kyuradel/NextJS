// app/detail/[sub]/page.js
import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import Comment from "./Comment"

export default async function Detail({ params }) {
  console.log("params:", params); // 이제 터미널에 찍힘!
  
  const db = (await connectDB).db("forum");
  const result = await db.collection("post").findOne({
    _id: new ObjectId(params.sub)
  });

  if (!result) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      <h4>상세페이지</h4>
      <h4>{result.title}</h4>
      <p>{result.content}</p>
      <Comment/>
    </div>
  );
}

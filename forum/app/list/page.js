import { connectDB } from "@/util/database"
import ListItem from "./ListItem"

export default async function List() {
  // connectDB()를 함수로 호출해야 합니다 (괄호 추가)
  const db = (await connectDB).db("forum")
  let result = await db.collection('post').find().toArray()
  
  const safeResult = result.map((item) => {
    return {
      ...item,
      _id: item._id.toString()
    }
  });
  
  return (
    <div className="list-bg">
      <ListItem result={safeResult}/>
    </div>
  )
}
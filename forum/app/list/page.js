import { connectDB } from "@/util/database"
import Link from "next/link"

export default async function List() {

    const db = (await connectDB).db("forum")
    let result = await db.collection('post').find().toArray()
    console.log(result)

    return (
      <div className="list-bg">
        <ResultContent result={result}/>
      </div>
    )
  } 

function ResultContent({result}) {
return (
    <>
    {result.map((item, idx) => (
        <div className="list-item" key={idx}>
            <h4><Link href={`/detail/${item._id}`}>{item.title}</Link></h4>
            <Link href={`/edit/${item._id}`}>✏️</Link>
            <p>{item.content}</p>
        </div>
    ))}
    </>
);
}
  
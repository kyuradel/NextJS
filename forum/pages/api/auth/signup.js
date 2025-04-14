import { connectDB } from "@/util/database";
import bcrypt from 'bcrypt'

export default async function handler(req, res) {
    if (req.method == 'POST') {
        let hash = await bcrypt.hash(req.body.password, 10)
        console.log(hash)
        console.log(req.body)
        let db = (await connectDB).db('forum');
        await db.collection('user_cred').insertOne(req.body);
    }
}
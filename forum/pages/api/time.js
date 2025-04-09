export default async function handler(req, res) {
    if(req.method === "GET") {
        const now = new Date();

        const dateTime = {
            iso: now.toISOString(),
            local: now.toLocaleString(),
            date: now.toLocaleString(),
            time: now.toLocaleString(),
        };

        res.status(200).json(dateTime);
    } else {
        res.status(405).json({ message: "허용되지 않은 메서드" });
    }
}
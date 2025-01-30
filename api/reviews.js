export default async function handler(req, res) {
    const placeId = req.query.place_id;
    if (!placeId) {
        return res.status(400).json({ error: "place_id é obrigatório" });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=pt-BR`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.result || !data.result.reviews) {
            return res.status(404).json({ error: "Nenhuma avaliação encontrada" });
        }

        const reviews = data.result.reviews.map(review => ({
            autor: review.author_name,
            nota: review.rating,
            texto: review.text,
            dataAvaliacao: review.relative_time_description,
        }));

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar dados da API" });
    }
}

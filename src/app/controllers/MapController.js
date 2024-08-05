const axios = require('axios');
const API_KEY = process.env.MAP_API_KEY;

const getLocation = async (req, res) => {
    const query = req.query.q;
    const url = `https://discover.search.hereapi.com/v1/discover?apikey=${API_KEY}&q=${encodeURIComponent(query)}&at=10.762622,106.660172&limit=5`;

    try {
        const response = await axios.get(url);
        res.json(response.data.items);
    } catch (error) {
        console.error('Error fetching data from HERE API:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

const getUniversities = async (req, res) => {
    const city = req.query.city || 'Ho Chi Minh City';
    const apiKey = process.env.MAPBOX_API_KEY;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/university.json?proximity=106.700981,10.775658&limit=10&access_token=${apiKey}`;

    try {
        const response = await axios.get(url);
        const universities = response.data.features.map((feature) => ({
            name: feature.text,
            coordinates: feature.geometry.coordinates,
        }));
        res.json({ universities });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching universities' });
    }
};

module.exports = { getLocation, getUniversities };

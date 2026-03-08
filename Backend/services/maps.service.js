const axios = require('axios');
const captainModel = require('../models/captain.model');

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN || '';

module.exports.getAddressCoordinate = async (address) => {
    if (!MAPBOX_ACCESS_TOKEN) {
        throw new Error('MAPBOX_ACCESS_TOKEN is not configured');
    }
    
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;

    try {
        const response = await axios.get(url);
        console.log('Geocoding API Response:', JSON.stringify(response.data));
        
        if (response.data.features && response.data.features.length > 0) {
            const location = response.data.features[0].center;
            return {
                lat: location[1],
                lng: location[0]
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error('Geocoding Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // First, get coordinates for origin and destination
    const originCoords = await this.getAddressCoordinate(origin);
    const destCoords = await this.getAddressCoordinate(destination);

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
        const response = await axios.get(url);
        console.log('Directions API Response:', JSON.stringify(response.data));
        
        if (response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                distance: {
                    text: route.distance / 1000 + ' km',
                    value: route.distance
                },
                duration: {
                    text: Math.round(route.duration / 60) + ' min',
                    value: route.duration
                }
            };
        } else {
            throw new Error('No routes found');
        }
    } catch (err) {
        console.error('Directions Error:', err.message);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`;

    try {
        const response = await axios.get(url);
        console.log('Autocomplete API Response:', JSON.stringify(response.data));
        
        if (response.data.features) {
            return response.data.features.map(feature => feature.place_name).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error('Autocomplete Error:', err.message);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
    // radius in km

    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ lat, lng ], radius / 6371 ]
            }
        }
    });

    return captains;
}

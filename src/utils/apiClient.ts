import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.3commas.io/public/api';

if (!API_KEY) {
    throw new Error('API_KEY must be set in the environment variables.');
}

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'APIKEY': API_KEY,
        'Content-Type': 'application/json'
    }
});

export default apiClient;

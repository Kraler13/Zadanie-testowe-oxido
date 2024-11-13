import axios from 'axios';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

async function connectToOpenAI(prompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('Brak klucza API. Upewnij się, że plik .env jest skonfigurowany poprawnie.');
    }

    const apiUrl = 'https://api.openai.com/v1/completions';

    try {
        const response = await axios.post(
            apiUrl,
            {
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 1500,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        return response.data.choices[0].text;
    } catch (error) {
        console.error('Błąd przy łączeniu z API OpenAI:', error);
        throw new Error('Nie udało się połączyć z API OpenAI');
    }
}

(async () => {
    const result = await connectToOpenAI('Przykładowy prompt');
    console.log('Wynik z OpenAI:', result);
})();
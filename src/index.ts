import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';

dotenv.config();

async function readFileContent(filePath: string): Promise<string> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data;
    } catch (error) {
        console.error('Błąd podczas odczytu pliku:', error);
        throw new Error('Nie udało się odczytać pliku');
    }
}

async function connectToOpenAI(prompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('Brak klucza API. Upewnij się, że plik .env jest skonfigurowany poprawnie.');
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
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
    try {
        const articleContent = await readFileContent('src/article.txt');

        const result = await connectToOpenAI(`Przetwórz następujący artykuł i stwórz jego wersję HTML:\n${articleContent}`);
        console.log('Wynik z OpenAI:', result);

    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
})();
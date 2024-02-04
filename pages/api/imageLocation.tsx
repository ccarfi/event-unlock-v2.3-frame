import { generateOGImage } from '@vercel/og';

export default async function handler(req, res) {
  //  const { title, author } = req.query;
    
    const html = `
        <div style="display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
            <h1>This is the location H1</h1>
            <p>This is the location body</p>
        </div>
    `;

    const imageBuffer = await generateOGImage({ html });

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
}

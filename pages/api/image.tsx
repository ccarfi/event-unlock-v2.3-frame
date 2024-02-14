import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import {UnlockEvent} from "@/app/types";
import {kv} from "@vercel/kv";
import satori from "satori";
import { join } from 'path';
import * as fs from "fs";

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

// TODO: clean up this file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const eventId = req.query['id']

        if (!eventId) {
//            return res.status(400).send('Missing event ID');
        }

//        let event: UnlockEvent | null = await kv.hgetall(`event:${eventId}`);

        if (!event) {
//            return res.status(400).send('Missing event ID');
        }

        const svg = await satori(
            <div style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                display: 'flex',
                width: '100%',
                height: '100%',
                backgroundColor: 'f4f4f4',
                padding: 50,
                lineHeight: 1.2,
                fontSize: 24,
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 20,
                }}>
                    <h2 style={{textAlign: 'center', color: 'lightgray'}}>Event</h2>
                    <p style={{textAlign: 'center', color: 'lightgray'}}>
                        Placeholder
                    </p>
                </div>
            </div>
            ,
            {
                width: 600, height: 400, fonts: [{
                    data: fontData,
                    name: 'Roboto',
                    style: 'normal',
                    weight: 400
                }]
            })

        // Convert SVG to PNG using Sharp
        const pngBuffer = await sharp(Buffer.from(svg))
            .toFormat('png')
            .toBuffer();

        // Set the content type to PNG and send the response
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'max-age=10');
        res.send(pngBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
}

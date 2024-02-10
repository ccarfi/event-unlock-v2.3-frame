import type { NextApiRequest, NextApiResponse } from 'next';
import {kv} from "@vercel/kv";
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";
import { getUserAddresses } from "@/src/lib/farcaster";
import { ImageResponse } from '@vercel/og';

const HUB_URL = process.env['HUB_URL']
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        // Get the slug, and if the user is trying to register
        try {
            const testString = req.query['teststring']

            if (!testString) {
                return res.status(400).send('Missing string to display'); 
            }

            console.log("Test String:");
            console.log(testString);

            let validatedMessage : Message | undefined = undefined;
            try {
                const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'));
                const result = await client?.validateMessage(frameMessage);
                if (result && result.isOk() && result.value.valid) {
                    validatedMessage = result.value.message;
                }

                // Also validate the frame url matches the expected url
                let urlBuffer = validatedMessage?.data?.frameActionBody?.url || [];
                const urlString = Buffer.from(urlBuffer).toString('utf-8');
                if (validatedMessage && !urlString.startsWith(process.env['HOST'] || '')) {
                    return res.status(400).send(`Invalid frame url: ${urlBuffer}`);
                }
            } catch (e)  {
                return res.status(400).send(`Failed to validate message: ${e}`);
            }
        }
        catch {
        }
      return;

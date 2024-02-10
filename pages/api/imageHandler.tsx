import { NextRequest, NextResponse } from 'next/server';
import {kv} from "@vercel/kv";
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";
import { getUserAddresses } from "@/src/lib/farcaster";
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest, res: NextResponse) {

    const searchParams = new URLSearchParams(req.nextUrl.search);
    const slug = searchParams.get('slug');
    console.log('req:', req);
    console.log('req.nextUrl.search:', req.nextUrl.search);

    if (req.method === 'GET') {

        console.log('req.nextUrl.search:', req.nextUrl.search);
 
        // Get the string
        try {

                console.log('slug:',slug); // This should log the slug
          

            if (!slug) {
//                return res.status(400).send('Missing slug to display'); 
            }

/*
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
*/            
        } catch (error) {
            console.error(error);
//            res.status(500).send('Error generating image');
        }
    } else {
        // Handle any non-POST requests
//        res.setHeader('Allow', ['POST']);
//        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    console.log("Entering imageHandler return");
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        this is from the imageHandler. the value of slug is: {slug}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

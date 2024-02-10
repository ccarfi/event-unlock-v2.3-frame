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
    const eventSlug = searchParams.get('slug');
    console.log('req:', req);
    console.log('req.nextUrl.search:', req.nextUrl.search);

    if (req.method === 'GET') {
 
        // Get the string
        try {

                console.log('eventSlug:',eventSlug); // This should log the slug
          

            if (!eventSlug) {
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

            const url = `https://locksmith.unlock-protocol.com/v2/events/${eventSlug}`;
 
            let eventImageURL = 'image not available'; // Declare eventImageURL here with a default value 
            let eventTitle = 'event title not available'; // Declare eventTitle here with a default value
            let eventRegLink = 'registration link not available';

            try {
                const response = await fetch(url, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json'
                  }
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(JSON.stringify(data));
                eventImageURL = data.data.image;
                eventTitle = data.name;
                eventRegLink = data.eventUrl;
            } 
            catch (error) {
                console.log(error);
            }

  
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
        <img src={eventImageURL} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

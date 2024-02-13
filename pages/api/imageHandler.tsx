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
 
            let eventTitle = 'event title not available';
            let eventImageURL = 'image not available'; // Declare these here with a default value 
            let eventBannerURL = 'event banner not available';
            let eventAddress = 'event address not available';
            let eventDate = 'event date not available';
            let eventTime = 'event time not available';
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

                interface Attribute {
                  trait_type: string;
                  value: string;
                }

                const data = await response.json();
                console.log(JSON.stringify(data));
                eventTitle = data.name;
                eventImageURL = data.data.image;
                eventBannerURL = data.data.attributes.find((attr: Attribute) => attr.trait_type === "event_cover_image")?.value;
                eventAddress = data.data.attributes.find((attr: Attribute) => attr.trait_type === "event_address")?.value;
                eventDate = data.data.attributes.find((attr: Attribute) => attr.trait_type === "event_start_date")?.value;
                eventTime = data.data.attributes.find((attr: Attribute) => attr.trait_type === "event_start_time")?.value;
                eventRegLink = data.eventUrl;
            } 
            catch (error) {
                console.log(error);
            }
  
  return new ImageResponse(
    (
<div id="eventLayoutContainer"
  style={{
    display: 'flex',
    flexDirection: 'row', 
    backgroundColor: '#F5F5F5',
    height: '630px',
    width: '1200px',
    borderRadius: '0.5rem',
  }}
>
  <div id="twoColumnContainer"
    style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flex: 1, 
    }}
  >
    <h1
      style={{
        fontSize: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        margin: '24px 0',
      }}
    >
      {eventTitle}
    </h1>
    <div id="wrapTimeandAddress"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px',
      }}
    >
        <div id="timeContainer"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '1rem',
          }}
        >
        <p
          style={{
          fontSize: '36px',
          marginLeft: '24px',
          fontWeight: 'bold',
          width: '384px',
          }}
        >
          {eventTime}
        </p>                      
        </div> {/* close timeContainer */}
        <div id="addressContainer"
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '1rem',
          }}
        >
          <p
            style={{
              fontSize: '36px',
              marginLeft: '24px', 
              fontWeight: 'bold', 
              width: '384px', // w-96
            }}
          >
            {eventAddress}
          </p>
          </div> {/* close addressContainer */}
        </div>  {/* close wrapTimeandAddress */}
      </div>  {/* close twoColumnContainer */}
      <div id="imageContainer"
          style={{
          width: '256px',
          height: '256px',
          position: 'relative',
          alignSelf: 'center', 
          marginRight: '24px', 
          borderRadius: '1rem',
          borderWidth: '4px',
          borderColor: 'white',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <img
          src={eventImageURL}
          alt={eventTitle}
          style={{
          width: '100%',
            height: '100%',
            borderRadius: '1rem',
          }}
        />
  </div>          { /* close imageContainer */}
</div>            {/* close eventLayoutContainer */}
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

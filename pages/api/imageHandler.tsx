import { NextRequest, NextResponse } from 'next/server';
import {kv} from "@vercel/kv";
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";
import { getUserAddresses } from "@/src/lib/farcaster";
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

export default async function handler(req: NextRequest, res: NextResponse) {

    const searchParams = new URLSearchParams(req.nextUrl.search);
    const eventSlug = searchParams.get('slug');
    const showAddressParam = searchParams.get('address');
    const showDescriptionParam = searchParams.get('desc');

    console.log('req:', req);
    console.log('req.nextUrl.search:', req.nextUrl.search);

  // TODO: pass in flags to show or not show various fields, set display flag in div below based on value

    const showDescription = showDescriptionParam === "true" ? "flex" : "none";
    const showAddress = showAddressParam === "true" ? "flex" : "none"
    const showTime = showDescription === "none" ? "flex" : "none";          // show time if NOT showing description
    const showDate = showDescription === "none" ? "flex" : "none";          // show address if NOT showing description


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
            let eventDescription = 'event description not available';
            let eventImageURL = 'image not available'; // Declare these here with a default value 
            let eventBannerURL = 'event banner not available';
            let eventAddress = 'event address not available';
            let eventDate = 'event date not available';
            let eventTime = 'event time not available';
            let eventRegLink = 'registration link not available';
            let formattedDate = 'formatted event date not available';
            let formattedTime = 'formatted event time not available';

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
                eventDescription = data.data.description;
                eventImageURL = data.data.image;
                eventBannerURL = data.data.attributes.find((attr: Attribute) => attr.trait_type === "event_cover_image")?.value;
                eventAddress = data.data.attributes.find((attr: Attribute) => attr.trait_type === "event_address")?.value;
                eventDate = data.data.attributes.find((attr: Attribute) => attr.trait_type === "event_start_date")?.value;
                eventTime = data.data.attributes.find((attr: Attribute) => attr.trait_type === "event_start_time")?.value;
                eventRegLink = data.eventUrl;

                eventDescription = truncateString(eventDescription,500); // clip the description if needed

                const dateObject = new Date(eventDate);                  // show the date in a friendly format
                formattedDate = dateObject.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                const dateTime = new Date(`${eventDate}T${eventTime}:00`);  // show the time in a friendly format
                const timeOptions: Intl.DateTimeFormatOptions = { 
                  hour: 'numeric', 
                  minute: 'numeric', 
                  hour12: true 
                };
                formattedTime = dateTime.toLocaleTimeString('en-US', timeOptions);

            } 
            catch (error) {
                console.log(error);
            }
  
  return new ImageResponse(
    (
<div
  id="mainContainer"
  style={{
    display: 'flex',
    flexDirection: 'row',
    height: '630px',
    width: '1200px',
    borderRadius: '0.5rem',
    background: 'linear-gradient(to bottom, #8a2be2, #4b0082)',
  }}
>
  <div
    id="contentContainer"
    style={{
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
      marginLeft: '50px',
      marginRight: '50px', 
      marginTop: '50px',
      marginBottom: '50px', 
    }}
  >
    <div
        id="logoContainer"
        style={{
          width: '100px',
          height: '22px',
          display: 'flex',
        }}
    >
    {/* Close logoContainer */}                    
    </div>  
    <div
        id="titleContainer"
        style={{
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.01)',
        }}
      >
      <p
        id="title"
        style={{
          fontSize: '48px',
          fontWeight: '900',
          width: '100%',
          color: '#FFFFFF',
          backgroundColor: 'rgba(255, 255, 255, 0.01)',
        }}
      >
        {eventTitle}
      </p>
      {/* Close titleContainer */}                    
      </div>
      <div
          id="dateContainer"
          style={{
            display: showDate,
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
          }}
        >
        <p
          style={{
          fontSize: '28px',
          color: '#FFFFFF',
          fontWeight: 'bold',
          }}
        >
          {formattedDate}
        </p>  
        {/* Close dateContainer */}                    
        </div>
        <div
          id="timeContainer"
          style={{
            display: showTime,
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
          }}
        >
        <p
          style={{
          fontSize: '28px',
          color: '#FFFFFF',
          fontWeight: 'bold',
          }}
        >
          {formattedTime}
        </p>  
        {/* Close timeContainer */}                    
        </div>
        <div
          id="addressContainer"
          style={{
            display: showAddress,
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
          }}
        >
        <p
          style={{
          fontSize: '28px',
          color: '#FFFFFF',
          fontWeight: 'bold',
          }}
        >
          {eventAddress}
        </p>  
        {/* Close addressContainer */}                    
        </div>
        <div
          id="descriptionContainer"
          style={{
            display: showDescription,
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
            overflow: 'hidden',
          }}
        >
        <p
          style={{
          fontSize: '24px',
          color: '#FFFFFF',
          fontWeight: 'normal',
          }}
        >
          {eventDescription}
        </p>  
        {/* Close descriptionContainer */}                    
        </div>
  {/* Close contentContainer */}
  </div>
  <div
    id="imageContainer"
    style={{
      width: '450px',
      height: '450px',
      alignSelf: 'center',
      display: 'flex',
    }}
  >
    <img
      src={eventImageURL}
      alt={eventTitle}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  {/* Close imageContainer */}
  </div> 
{/* Close mainContainer */}
</div>

    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

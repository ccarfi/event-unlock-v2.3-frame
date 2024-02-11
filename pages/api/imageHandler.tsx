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
/*
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
*/
  
  return new ImageResponse(
    (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F5F5F5',
            height: '100%',
            width: '100%',
            borderRadius: '0.5rem',
          }}
          >
        <img
        src={eventBannerURL}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        aria-label={eventTitle}
      />
      <div
        style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '1.5rem',
      }}
      >
      <h1
        style={{
          fontSize: '2.25rem',
          width: '800px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          padding: '0.5rem',
          borderRadius: '0.5rem',
        }}
      >
        {eventTitle}
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '1rem',
        }}
        >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="63"
            height="63"
            rx="15.5"
            fill="#FFFDFA"
          />
          <g clipPath="url(#clip0_403_6543)">
            <path
              d="M38.6665 19.9997H43.9998C44.3535 19.9997 44.6926 20.1402 44.9426 20.3902C45.1927 20.6402 45.3332 20.9794 45.3332 21.333V42.6663C45.3332 43.02 45.1927 43.3591 44.9426 43.6091C44.6926 43.8592 44.3535 43.9997 43.9998 43.9997H19.9998C19.6462 43.9997 19.3071 43.8592 19.057 43.6091C18.807 43.3591 18.6665 43.02 18.6665 42.6663V21.333C18.6665 20.9794 18.807 20.6402 19.057 20.3902C19.3071 20.1402 19.6462 19.9997 19.9998 19.9997H25.3332V17.333H27.9998V19.9997H35.9998V17.333H38.6665V19.9997ZM35.9998 22.6663H27.9998V25.333H25.3332V22.6663H21.3332V27.9997H42.6665V22.6663H38.6665V25.333H35.9998V22.6663ZM42.6665 30.6663H21.3332V41.333H42.6665V30.6663Z"
              fill="#373A3E"
            />
          </g>
          <rect
            x="0.5"
            y="0.5"
            width="63"
            height="63"
            rx="15.5"
            stroke="#E4E4E4"
          />
          <defs>
            <clipPath id="clip0_403_6543">
              <rect
                width="32"
                height="32"
                fill="white"
                transform="translate(16 16)"
              />
            </clipPath>
          </defs>
        </svg>
        <p
          style={{
          fontSize: '24px',
          marginLeft: '24px',
          fontWeight: 'bold',
          width: '384px',
          }}
        >
          {eventTime}
        </p>
      </div>
    </div>
    </div>
    </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}



/*
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F5F5F5',
      height: '100%',
      width: '100%',
      borderRadius: '0.5rem',
    }}
  >
    {eventBannerURL && (
      <img
        src={eventBannerURL}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        aria-label={eventTitle}
      />
    )}
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '90%',
      }}
    >
      {eventImageURL && (
        <img
          width="64"
          height="64"
          src={eventImageURL}
          style={{
            width: '64px',
            height: '64px',
            position: 'absolute',
            top: '4rem',
            left: '3rem',
            borderRadius: '0.5rem',
            borderWidth: '4px',
            borderColor: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          aria-label={eventTitle}
        />
      )}
    </div>

    *** trying this next
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '1.5rem',
      }}
    >
      <h1
        style={{
          fontSize: '2.25rem',
          width: '800px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          padding: '0.5rem',
          borderRadius: '0.5rem',
        }}
      >
        {eventTitle}
      </h1>
        <div
  style={{
    display: 'flex',
    flexDirection: 'column',
  }}
>
  {eventTime && (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '1rem',
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="63"
          height="63"
          rx="15.5"
          fill="#FFFDFA"
        />
        <g clipPath="url(#clip0_403_6543)">
          <path
            d="M38.6665 19.9997H43.9998C44.3535 19.9997 44.6926 20.1402 44.9426 20.3902C45.1927 20.6402 45.3332 20.9794 45.3332 21.333V42.6663C45.3332 43.02 45.1927 43.3591 44.9426 43.6091C44.6926 43.8592 44.3535 43.9997 43.9998 43.9997H19.9998C19.6462 43.9997 19.3071 43.8592 19.057 43.6091C18.807 43.3591 18.6665 43.02 18.6665 42.6663V21.333C18.6665 20.9794 18.807 20.6402 19.057 20.3902C19.3071 20.1402 19.6462 19.9997 19.9998 19.9997H25.3332V17.333H27.9998V19.9997H35.9998V17.333H38.6665V19.9997ZM35.9998 22.6663H27.9998V25.333H25.3332V22.6663H21.3332V27.9997H42.6665V22.6663H38.6665V25.333H35.9998V22.6663ZM42.6665 30.6663H21.3332V41.333H42.6665V30.6663Z"
            fill="#373A3E"
          />
        </g>
        <rect
          x="0.5"
          y="0.5"
          width="63"
          height="63"
          rx="15.5"
          stroke="#E4E4E4"
        />
        <defs>
          <clipPath id="clip0_403_6543">
            <rect
              width="32"
              height="32"
              fill="white"
              transform="translate(16 16)"
            />
          </clipPath>
        </defs>
      </svg>
      <p
        style={{
          fontSize: '24px',
          marginLeft: '24px',
          fontWeight: 'bold',
          width: '384px',
        }}
      >
        {eventTime}
      </p>
    </div>
  )}
</div>

{eventAddress && (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      marginTop: '24px', // Assuming mt-6 maps to 24px based on Tailwind's scale
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '1rem',
    }}
  >
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="15.5"
        fill="#FFFDFA"
      />
      <g clipPath="url(#clip0_403_6549)">
        <path
          d="M32 43.8669L38.6 37.2669C39.9052 35.9616 40.794 34.2985 41.1541 32.4881C41.5141 30.6776 41.3292 28.801 40.6228 27.0956C39.9163 25.3902 38.7201 23.9326 37.1852 22.9071C35.6504 21.8816 33.8459 21.3342 32 21.3342C30.1541 21.3342 28.3496 21.8816 26.8148 22.9071C25.2799 23.9326 24.0837 25.3902 23.3772 27.0956C22.6708 28.801 22.4859 30.6776 22.8459 32.4881C23.206 34.2985 24.0948 35.9616 25.4 37.2669L32 43.8669ZM32 47.6376L23.5147 39.1522C21.8365 37.474 20.6936 35.3358 20.2306 33.008C19.7676 30.6803 20.0052 28.2675 20.9135 26.0748C21.8217 23.8821 23.3598 22.0079 25.3332 20.6893C27.3066 19.3708 29.6266 18.667 32 18.667C34.3734 18.667 36.6934 19.3708 38.6668 20.6893C40.6402 22.0079 42.1783 23.8821 43.0865 26.0748C43.9948 28.2675 44.2324 30.6803 43.7694 33.008C43.3064 35.3358 42.1636 37.474 40.4853 39.1522L32 47.6376V47.6376ZM30.6667 29.3336V25.3336H33.3333V29.3336H37.3333V32.0002H33.3333V36.0002H30.6667V32.0002H26.6667V29.3336H30.6667Z"
          fill="#373A3E"
        />
      </g>
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="15.5"
        stroke="#E4E4E4"
      />
      <defs>
        <clipPath id="clip0_403_6549">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(16 16)"
          />
        </clipPath>
      </defs>
    </svg>
    <p
      style={{
        fontSize: '24px', // text-2xl
        marginLeft: '24px', // ml-6, assuming 1rem = 16px
        fontWeight: 'bold', // font-semibold
        width: '384px', // w-96
      }}
    >
      {eventAddress}
    </p>
  </div>
)}
        </div>
      </div>
    </div>

*/

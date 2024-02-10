import type { NextApiRequest, NextApiResponse } from 'next';
import {UnlockEvent} from "@/app/types";
import {kv} from "@vercel/kv";
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";
import { getUserAddresses } from "@/src/lib/farcaster";
import { balanceOf } from "@/src/lib/unlock";
import { ImageResponse } from '@vercel/og';


////////////////////////////////////////////////

interface OGEventProps {
  name: string
  startTime?: string
  location?: string
  iconURL?: string
  bannerURL?: string
}

const OGEvent = ({ name, startTime, location, iconURL, bannerURL }: OGEventProps) => {
  return (
    <div className="flex flex-col bg-[#F5F5F5] h-full w-full rounded-xl">
      {bannerURL && (
        <img
          src={bannerURL}
          tw="absolute top-0 object-cover"
          aria-label={name}
        />
      )}
      <div tw="relative flex flex-col w-full h-90">
        {iconURL && (
          <img
            width="64"
            height="64"
            src={iconURL}
            tw="w-64 h-64 top-16 left-12 rounded-xl border-4 shadow-xl border-white"
            aria-label={name}
          />
        )}
      </div>
      <div tw="flex items-center justify-between w-full px-6">
        <h1 tw="text-5xl w-128 bg-white/50 p-2 rounded">{name}</h1>
        <div tw="flex flex-col">
          {startTime && (
            <div tw="flex items-center bg-white/50 rounded-2xl">
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
                <g clip-path="url(#clip0_403_6543)">
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
              <p tw="text-2xl ml-6t font-semibold w-96">{startTime}</p>
            </div>
          )}

          {location && (
            <div tw="flex items-center mt-6 bg-white/50 rounded-2xl">
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
                <g clip-path="url(#clip0_403_6549)">
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
              <p tw="text-2xl ml-6t font-semibold w-96">{location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

////////////////////////////////////////////////

const HUB_URL = process.env['HUB_URL']
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        // Get the slug, and if the user is trying to register
        try {
            const eventSlug = req.query['slug'] //shadow
            let register = req.query['register'] === 'true'
            let firstVisit = req.query['firstvisit'] === 'true'
            if (!eventSlug) {
                return res.status(400).send('Missing event slug');   //shadow
            }


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

            let buttonId = 0, fid = 0;
            // If HUB_URL is not provided, don't validate and fall back to untrusted data
            if (client) {
                buttonId = validatedMessage?.data?.frameActionBody?.buttonIndex || 0;
                fid = validatedMessage?.data?.fid || 0;
            } else {
                buttonId = req.body?.untrustedData?.buttonIndex || 0;
                fid = req.body?.untrustedData?.fid || 0;
            }

            // we'll use these later when constructing og tags
            
            let imageUrl = "";  
            let button1Text = "Register";
            let button2Text = "Show location";
            let button3Text = "See my ticket";

            // Log that we made it this far
            console.log("Entered event.ts...");

            // Get the wallet address of the user, or note if there is no wallet address
            const fidAsString = fid.toString();
            const addresses = await getUserAddresses(fidAsString);
            
            if (addresses.length === 0) {
                console.log("No wallet");
            }
            else {
                console.log(addresses);
            }
            
            const balances = await Promise.all(
                addresses.map((userAddress: string) => {
                    return balanceOf(
                        userAddress as `0x${string}`,
                        "0xb77030a7e47a5eb942a4748000125e70be598632" as `0x${string}`,       // unlock membership
//                        "0x67f4732266c7300cca593c814d46bee72e40659f" as `0x${string}`,       //zed run
                        137
                    );
                })
            );
            

            // we were given the slug when we came in — call the API and get the details
    
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
            
            // The main bit. If user is a member (ticketholder who is registered), set image to one thing. If not a member, set to another.

            // Check to see if the user had a valid ticket
            const isMember = balances.some((balance) => balance > 0);

            console.log("First visit:");
            console.log(firstVisit);
           
            let action = "";
            register = true;
            let button1Action = "post_redirect";
            if (buttonId === 1) {
                action = "register";
                if (isMember && !firstVisit) {
                    imageUrl = `https://i.imgur.com/FQvDjSm.png?t=110`;
                    button1Action = "post";
                    register = false;
                }
                else {
                    //  Drop through this conditional and don't do anything here, we'll
                    //  do the redirect just after the conditional block to go register
                    
                    //  register = true;
                }
            }

            if (buttonId === 2) {
                action = "location";
                if (isMember) {
                    imageUrl = `https://i.imgur.com/2uSiYW1.png`;
                    console.log("Slug we're sending")
                    console.log(eventSlug);
                    console.log("ImageUrl");
                    console.log(imageUrl);
                    button1Action = "post";
                    register = false;
                }
                else {
                    imageUrl = `${process.env['HOST_DEV']}/api/imageLocationNotRegistered`;
                }
            }
            
            if (buttonId === 3) {
                 action = "ticket";
                 if (isMember) {
                    imageUrl = eventImageURL;
                    button1Action = "post";
                    register = false;
                 }   
                 else {
                    imageUrl = `${process.env['HOST_DEV']}/api/imageTicketNotRegistered`;
                 }
            }

            console.log(action);
            console.log(eventSlug);

            // Clicked register and needs to register
            if (register && buttonId === 1) {
//                const registrationURL = "https://app.unlock-protocol.com/checkout?id=23699ccb-6a3b-4192-8de8-c07c0390ac14";  // unlock community checkout
//                const registrationURL = "https://app.unlock-protocol.com/checkout?id=ade561b1-fe5d-4540-82df-1e7a9f67c3ee";   // privy checkout
                const registrationURL = eventRegLink;
                console.log(registrationURL);
                return res.status(302).setHeader('Location', `${registrationURL}`).send('Redirecting to go register');  // change this to use link instead of redirect
            }
 
            // Return an HTML response
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${eventTitle}</title>
          <meta property="og:title" content="${eventTitle}">
          <meta property="og:image" content="${imageUrl}">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="${imageUrl}">
          <meta name="fc:frame:image:aspect_ratio" content="1.91:1">
          <meta name="fc:frame:post_url" content="${process.env['HOST_DEV']}/api/s/event?slug=${eventSlug}&register=${register ? 'true' : 'false'}">
          <meta name="fc:frame:button:1" content="${button1Text}">
          <meta name="fc:frame:button:1:action" content="${button1Action}">
          <meta name="fc:frame:button:2" content="${button2Text}">
          <meta name="fc:frame:button:3" content="${button3Text}">
        </head>
        <body>
          <p>You clicked ${buttonId}}</p>
        </body>
      </html>
    `);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error generating image');
        }
    } else {
        // Handle any non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

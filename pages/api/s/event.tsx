import type { NextApiRequest, NextApiResponse } from 'next';
import {UnlockEvent} from "@/app/types";
import {kv} from "@vercel/kv";
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";
import { getUserAddresses } from "@/src/lib/farcaster";
import { balanceOf } from "@/src/lib/unlock";
import { ImageResponse } from '@vercel/og';

const HUB_URL = process.env['HUB_URL']
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        // Get the slug, and if the user is trying to register
        try {
            const eventSlug = req.query['slug']
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
//                    imageUrl = eventImageURL;
                    button1Action = "post";
                    register = false;
                    imageUrl = `${process.env['HOST_DEV']}/api/imageHandler?teststring=woohoo`;
/////////////////////////////
/*                     
fetch(imageUrl, {
  method: 'POST', // Specify the method as POST
  headers: {
    'Content-Type': 'application/json', // Assuming you're sending JSON data
  },
  body: JSON.stringify({
    teststring: 'woohoo', // Send the data in the request body
  }),
})
.then(response => response.blob()) // Convert the response to a Blob if it's an image
.then(blob => {
  // Create a URL for the blob object
  const imageSrc = URL.createObjectURL(blob);
  // Use imageSrc as the source for an image, assign to an <img> element, etc.
  document.getElementById('yourImageElementId').src = imageSrc;
})
.catch(error => console.error('Error:', error));

*/



////////////////////

                     
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
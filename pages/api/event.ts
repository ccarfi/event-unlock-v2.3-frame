import type { NextApiRequest, NextApiResponse } from 'next';
import {UnlockEvent} from "@/app/types";
import {kv} from "@vercel/kv";
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";
import { getUserAddresses } from "@/src/lib/farcaster";
import { balanceOf } from "@/src/lib/unlock";
//import {Poll, POLL_EXPIRY} from "@/app/types";

const HUB_URL = process.env['HUB_URL']
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        // Get the event id, and if the user is trying to register
        try {
            const eventId = req.query['id'] 
            let register = req.query['register'] === 'true'
            let firstVisit = req.query['firstvisit'] === 'true'
            if (!eventId) {
                return res.status(400).send('Missing event ID');
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
            
            let event: UnlockEvent | null = await kv.hgetall(`event:${eventId}`);
            console.log("Event:");
            console.log(event);
            
            if (!event) {
                return res.status(400).send('Missing event ID');
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
//                        "0xb77030a7e47a5eb942a4748000125e70be598632" as `0x${string}`,       // unlock membership
                        "0x67f4732266c7300cca593c814d46bee72e40659f" as `0x${string}`,       //zed run
                        137
                    );
                })
            );

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
                    imageUrl = `https://i.imgur.com/2uSiYW1.png?110`;
                    button1Action = "post";
                    register = false;
                }
                else {
                    imageUrl = `${process.env['HOST']}/api/imageLocationNotRegistered?t=110`;
                }
            }
            
            if (buttonId === 3) {
                 action = "ticket";
                 if (isMember) {
                    imageUrl = `https://i.imgur.com/zbyr758.png?110`;
                    button1Action = "post";
                    register = false;
                 }   
                 else {
                    imageUrl = `${process.env['HOST']}/api/imageTicketNotRegistered?t=110`;
                 }
            }

            console.log(action);

            // Clicked register and needs to register
            if (register && buttonId === 1) {
                const registrationURL = "https://app.unlock-protocol.com/checkout?id=23699ccb-6a3b-4192-8de8-c07c0390ac14";
                console.log(registrationURL);
                return res.status(302).setHeader('Location', `${registrationURL}`).send('Redirecting to go register');
            }
 
            // Return an HTML response
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${event.title}</title>
          <meta property="og:title" content="${event.title}">
          <meta property="og:image" content="${imageUrl}">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="${imageUrl}">
          <meta name="fc:frame:post_url" content="${process.env['HOST']}/api/event?id=${event.id}&register=${register ? 'true' : 'false'}">
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

import {kv} from "@vercel/kv";
import {UnlockEvent} from "@/app/types";
import Head from "next/head";
import {Metadata, ResolvingMetadata} from "next";

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const slug = params.slug;
    const url = `https://locksmith.unlock-protocol.com/v2/events/${slug}`;
    let ogImageURL = 'og image not available'; // Declare ogImageURL here with a default value 
    let eventTitle = 'event title not available'; // Declare eventTitle here with a default value
    let regLink = 'registration link not available';

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
        ogImageURL = data.data.image;
        eventTitle = data.name;
        regLink = data.eventUrl;
        console.log(regLink);
      } 
      catch (error) {
        console.log(error);
      }

    /* 
        The commented-out line below lets us easily add new buttons to the frame when
        we are ready to add them. The line below the commented-out line is the
        simple case where we have just one 'Register' button that redirects to the Event
        Landing Page. Farcater just added the 'action' and 'target' pieces
        which make this much easier than doing the 'redirect' approach that
        they required last week.
    */

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${process.env['HOST']}/api/event?id=9bfcbbb4-a37b-4ac4-a345-e7bc5472f4d6&register=true&firstvisit=true`,
        "fc:frame:image": `${ogImageURL}`,
        "fc:frame:image:aspect_ratio": `1:1`,
        "fc:frame:button:1:action": `link`,
        "fc:frame:button:1:target": `${regLink}`,
    };
//    ["Register", "See location", "Show my ticket", ""].filter(o => o !== "").map((option, index) => {
//        fcMetadata[`fc:frame:button:${index + 1}`] = option;
    ["Register", "", "", ""].filter(o => o !== "").map((option, index) => {
        fcMetadata[`fc:frame:button:${index + 1}`] = option;  
    })

    return {
        title: eventTitle,
        openGraph: {                            // these og tags are what get shared OUTSIDE of warpcast
            title: eventTitle,
            images: ogImageURL,                 
        },
        other: {
            ...fcMetadata,
        },
        metadataBase: new URL(process.env['HOST'] || '')
    }
}

export default async function Page({params}: { params: {slug: string}}) {
    return(
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
                    Your event frame has been created. Copy-paste the URL in the address bar into Warpcast.
                </main>
            </div>
        </>
    );

}

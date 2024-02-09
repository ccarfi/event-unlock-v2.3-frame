import {kv} from "@vercel/kv";
import {UnlockEvent} from "@/app/types";
import Head from "next/head";
import {Metadata, ResolvingMetadata} from "next";

async function getEvent(slug: string): Promise<UnlockEvent> {

    console.log("Entered getEvent slug");

/*    
    // >>>>> i may not need this since it'll be coming from the JSON returned from the API and not the database
    
    let nullEvent = {
        id: "",
        title: "No event found",
        slug: "",
        contractAddress: "",
        network: 0,
        checkoutURL: "",
        eventImageURL: "",
        registeredImageURL: "",
        registeredLocationImageURL: "",
        registeredTicketImageURL: "",
        created_at: 0,
    };

    try {
        let event: UnlockEvent | null = await kv.hgetall(`event:${id}`);

        if (!event) {
            return nullEvent;
        }

        return event;
    } catch (error) {
        console.error(error);
        return nullEvent;
    }
}
    // <<<<< i may not need this since it'll be coming from the JSON returned from the API and not the database
*/
    
/*
type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}
*/

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    console.log("Entered generateMetadata");
/*
    // >>>>>> if coming from database, we'll need this
    // read route params
    const id = params.id;
    const event = await getEvent(id);
    // <<<< if coming frorm database, we'll need this
*/
    
    // >>>>> if coming from API, use this
    const slug = params.slug;
    const event = await getEvent(slug);
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
        eventTitle = data.data.name;
        regLink = data.data.external_url;
      } 
      catch (error) {
        console.log(error);
      }
    // <<<<< if coming from API, use this



    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${process.env['HOST']}/api/event?slug=${slug}&register=true&firstvisit=true`,
//        "fc:frame:image": `${process.env['HOST']}/frame-webinar-share-627.png`,
        "fc:frame:image": `${ogImageURL}`,
        "fc:frame:image:aspect_ratio": `1.91:1`,
//        "fc:frame:button:1:action": `post_redirect`,
        "fc:frame:button:1:action": `link`,
        "fc:frame:button:1:target": `${regLink}`,
    };
//    ["Register", "See location", "Show my ticket", ""].filter(o => o !== "").map((option, index) => {
        fcMetadata[`fc:frame:button:${index + 1}`] = option;
    ["Register", "", "", ""].filter(o => o !== "").map((option, index) => {
        fcMetadata[`fc:frame:button:${index + 1}`] = option;  
    })

    return {
        title: eventTitle,
        openGraph: {                            // these og tags are what get shared OUTSIDE of warpcast
            title: eventTitle,
            images: ogImageURL,                 // [`/api/image?id=${id}`],
        },
        other: {
            ...fcMetadata,
        },
        metadataBase: new URL(process.env['HOST'] || '')
    }
}

//export default async function Page({params}: { params: {id: string}}) {
//    const event = await getEvent(params.id);    
export default async function Page({params}: { params: {slug: string}}) {
    const event = await getEvent(params.slug);    

    
    return(
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
                    Your event has been created. Copy-paste the URL in the address bar into Warpcast.
                </main>
            </div>
        </>
    );

}

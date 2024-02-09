import {kv} from "@vercel/kv";
import {UnlockEvent} from "@/app/types";
import Head from "next/head";
import {Metadata, ResolvingMetadata} from "next";

async function getEvent(id: string): Promise<UnlockEvent> {

    console.log("Entered getEvent");
    
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

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    console.log("Entered generateMetadata");
    
    // read route params
    const id = params.id;
    const event = await getEvent(id);

  // TODO: get the image and description from the database (and later the API)
  //        "fc:frame:image": `https://storage.unlock-protocol.com/7b53b4df-1819-4e8f-b3d0-86a1b1e337ab`,


    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${process.env['HOST']}/api/event?id=${id}&register=true&firstvisit=true`,
        "fc:frame:image": `${process.env['HOST']}/frame-webinar-share-627.png`,
        "fc:frame:image:aspect_ratio": `1.91:1`,
        "fc:frame:button:1:action": `post_redirect`,
    };
    ["Register", "See location", "Show my ticket", ""].filter(o => o !== "").map((option, index) => {
        fcMetadata[`fc:frame:button:${index + 1}`] = option;
    })


    return {
        title: event.title,
        openGraph: {                            // these og tags are what get shared OUTSIDE of warpcast
            title: event.title,
            images: [`/api/image?id=${id}`],
        },
        other: {
            ...fcMetadata,
        },
        metadataBase: new URL(process.env['HOST'] || '')
    }
}

export default async function Page({params}: { params: {id: string}}) {
    const event = await getEvent(params.id);    

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

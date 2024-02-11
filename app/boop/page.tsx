import Head from "next/head";
import {Metadata, ResolvingMetadata} from "next";

/*
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
*/

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
//    const id = params.id;
//    const event = await getEvent(id);

        const fcMetadata: Record<string, string> = {
            "fc:frame": "vNext",
            "fc:frame:image": `https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeiegrnialwu66u3nwzkn4gik4i2x2h4ip7y3w2dlymzlpxb5lrqbom&w=1920&q=75`,
            "fc:frame:image:aspect_ratio": `1:1`,
            "fc:frame:button:1:action": `mint`,
            "fc:frame:button:1:content": `Boop!`,
            "fc:frame:button:1:target": `eip155:7777777:0x060f3edd18c47f59bd23d063bbeb9aa4a8fec6df`,
        };
    })

    return {
        title: "Farcaster: Giraffe",
        openGraph: {                            
            title: "Farcaster: Giraffe",
            images: ["https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeiegrnialwu66u3nwzkn4gik4i2x2h4ip7y3w2dlymzlpxb5lrqbom&w=1920&q=75"],
        },
        other: {
            ...fcMetadata,
        },
        metadataBase: new URL(process.env['HOST'] || '')
    }
}

export default async function Page() {
    return(
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
                    Boop!
                </main>
            </div>
        </>
    );
}

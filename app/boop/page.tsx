import Head from "next/head";
import {Metadata, ResolvingMetadata} from "next";

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    console.log("Entered generateMetadata");
    
        const fcMetadata: Record<string, string> = {
            "fc:frame": "vNext",
            "fc:frame:image": "https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeiegrnialwu66u3nwzkn4gik4i2x2h4ip7y3w2dlymzlpxb5lrqbom&w=1920&q=75",
            "fc:frame:image:aspect_ratio": "1:1",
            "fc:frame:button:1": "Boop!",
            "fc:frame:button:1:action": "link",
            "fc:frame:button:1:target": "https://app.unlock-protocol.com/checkout?id=5185a27a-9d21-41f5-ae23-ee36dcb0ca12",
        };
    
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

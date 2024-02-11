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
            "fc:frame:image": "https://storage.unlock-protocol.com/45e9d74a-fee1-4d0f-95f8-8a9d8b78c3fa",
            "fc:frame:image:aspect_ratio": "1:1",
            "fc:frame:button:1": "Boop!",
            "fc:frame:button:1:action": "link",
            "fc:frame:button:1:target": "https://app.unlock-protocol.com/checkout?id=5d166240-98c0-4236-af4b-04898be5485f",
        };
    
    return {
        title: "Boop that snoot!",
        openGraph: {                            
            title: "Boop that snoot!",
            images: ["https://storage.unlock-protocol.com/45e9d74a-fee1-4d0f-95f8-8a9d8b78c3fa"],
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

import { ImageResponse } from '@vercel/og';

 
export const config = {
  runtime: 'edge',
};


 export default async function handler() {
   const url = `https://locksmith.unlock-protocol.com/v2/events/privy-meetup`;

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
  } catch (error) {
    console.log(error);
  }

  const eventAddress = data.attributes.find(attr => attr.trait_type === 'event_address')?.value || 'Address not available';
 
  return new ImageResponse(
    (
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
        }}
      >
       {eventAddress}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

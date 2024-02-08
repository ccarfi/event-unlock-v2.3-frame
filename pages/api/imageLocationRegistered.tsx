import { ImageResponse } from '@vercel/og';
 
export const config = {
  runtime: 'edge',
};

 export default async function handler() {
   const url = `https://locksmith.unlock-protocol.com/v2/events/privy-meetup`;
   let eventAddress = 'Address not available'; // Declare eventAddress here with a default value 

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

    interface Attribute {
     trait_type: string;
     value: string;
    }

    const data = await response.json();
    console.log(JSON.stringify(data));
    const addressAttribute = data.data.attributes.find((attr: Attribute) => attr.trait_type === 'event_address');
    if (addressAttribute) {
      eventAddress = addressAttribute.value;
    }
  } 
  catch (error) {
    console.log(error);
  }

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
          backgroundImage: `url(${process.env['HOST']}/map-pin.png)`,
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

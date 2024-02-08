import { ImageResponse } from '@vercel/og';
 
export const config = {
  runtime: 'edge',
};

 export default async function handler() {
   const url = `https://locksmith.unlock-protocol.com/v2/events/privy-meetup`;
   let ticketImageURL = 'Ticket image not available'; // Declare ticketImageURL here with a default value 

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
    ticketImageURL = data.data.image;
  } 
  catch (error) {
    console.log(error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'white',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${process.env['HOST']}/bgp.png)`,
          display: 'flex',
        }}
      >
          <img 
            src={ticketImageURL} 
            alt="Ticket Image"
            style={{
              maxHeight: '50%', // Limits the image height to 50% of its parent container
              maxWidth: '100%', // Ensures the image does not exceed the width of the container
              objectFit: 'contain', // Keeps the aspect ratio of the image
            }} 
          />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

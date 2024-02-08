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
    fontSize: 24, // Adjusted for better fit
    color: 'black',
    background: 'white',
    width: 1200, // Explicit dimensions
    height: 630,
    padding: '50px', // Adjusted padding
    display: 'flex',
    flexDirection: 'row', // Ensures side-by-side layout
    alignItems: 'center', // Vertically center align items
    justifyContent: 'flex-start', // Start alignment for children
    overflow: 'hidden', // Prevents overflow
  }}
>
  <img 
    src={`${process.env['HOST']}/map-pin.png`} 
    alt="Map Pin" 
    style={{ 
    //  maxWidth: '100px', // Control image size, adjust as needed
      maxHeight: '100%', 
      marginRight: '20px', // Space between icon and text
    }} 
  />
  <div 
    style={{ 
      overflow: 'hidden', // Prevent text overflow
      textOverflow: 'ellipsis', // Handle overflow with ellipsis
      whiteSpace: 'nowrap', // Prevent wrapping to a new line
      maxWidth: 'calc(100% - 120px)', // Adjust based on image size + margin
    }}
  >
    {eventAddress}
  </div>
</div>

    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

/*
     
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
          display: 'flex',
        }}
      >
  	    <img src={`${process.env['HOST']}/map-pin.png`} alt="Map Pin" />
       {eventAddress}
      </div>
      */

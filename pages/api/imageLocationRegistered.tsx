import { ImageResponse } from '@vercel/og';
//import axios, { AxiosResponse } from 'axios';       // API call

 
export const config = {
  runtime: 'edge',
};

/*
export default async function handler() {

//  const axios = require('axios');
 
  let config = {
   method: 'get',
   maxBodyLength: Infinity,
   url: `https://locksmith.unlock-protocol.com/v2/events/privy-meetup`,
   headers: { 
     'Accept': 'application/json'
   }
 };

  axios.request(config)
  .then((response: AxiosResponse) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
*/

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
// }

 
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
        live image from API
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

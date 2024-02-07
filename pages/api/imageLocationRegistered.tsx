import { ImageResponse } from '@vercel/og';
import {axios} from 'axios';
 
export const config = {
  runtime: 'edge',
};
 
export default async function handler() {

  let config = {
   method: 'get',
   maxBodyLength: Infinity,
   url: `https://locksmith.unlock-protocol.com/v2/events/privy-meetup`,
   headers: { 
     'Accept': 'application/json'
   }
 };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

 
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

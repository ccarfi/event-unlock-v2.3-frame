import { NeynarAPIClient } from "@neynar/nodejs-sdk";

//const endpoint = "https://nemes.farcaster.xyz:2281";
const endpoint = "https://api.neynar.com:2281";

const version = "v1";

const base = "https://api.neynar.com/";
const apiKey = process.env.NEYNAR_API_KEY;

/*
const hash = "0x8ffed4e8fa53c6e22b85f678c9a53067826e846a";
const url1 = `${base}v2/farcaster/cast?identifier=${hash}&type=hash`;
const response1 = await fetch(url1, {
  headers: {
    accept: "application/json",
    api_key: apiKey,
  },
});
const cast = await response1.json();
console.log(cast); // logs information about the cast
*/


const fid = 3;
const url2 = `${base}v1/farcaster/user?fid=${fid}`;
const response2 = await fetch(url2, {
  headers: {
    accept: "application/json",
    api_key: apiKey,
  },
});
const user = await response2.json();
console.log(user); // logs information about the user



function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return new Uint8Array(bytes);
}

export const validateMessage = async (message: string) => {
  const u = new URL(`${endpoint}/${version}/validateMessage`);
  const response = await fetch(u.toString(), {
    method: "POST",
    body: hexToBytes(message),
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
  return response.json();
};

export const getUserProfile = async (fid: string) => {
  const u = new URL(`${endpoint}/${version}/userDataByFid`);
  u.searchParams.append("fid", fid);
  const response = await fetch(u.toString());
  return response.json();
};

export const getUserAddresses = async (fid: string) => {
  const u = new URL(`${endpoint}/${version}/verificationsByFid`);
  u.searchParams.append("fid", fid);
  const response = await fetch(u.toString());
  const data = await response.json();
  return data.messages
    .filter((message: any) => {
      return message.data.type === "MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS";
    })
    .map((message: any) => {
      return message.data.verificationAddEthAddressBody.address;
    });
};

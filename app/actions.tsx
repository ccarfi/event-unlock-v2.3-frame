"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import {UnlockEvent} from "./types";
import {redirect} from "next/navigation";
import axios from 'axios';       // added to test API call

export async function saveEvent(event: UnlockEvent, formData: FormData) {
  const networkValue = formData.get("network");
  let network: number = 0;
  if (typeof networkValue === 'string') {
    network = Number(networkValue);
  }
  
  let newEvent = {
    ...event,
    created_at: Date.now(),
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    contractAddress: formData.get("contractAddress") as string,
    network,
    checkoutURL: "testcheckoutURL" as string,
    eventImageURL: " test eventImageURL" as string,
    registeredImageURL: "test registeredImageURL" as string,
    registeredLocationImageURL: "test registeredLocationImageURL" as string,
    registeredTicketImageURL: "test registeredTicketImageURL" as string,   
  };
  
  console.log("newEvent:");
  console.log(newEvent);            
  
  await kv.hset(`event:${event.id}`, newEvent);
  await kv.zadd("events_by_date", {
    score: Number(newEvent.created_at),
    member: newEvent.id,
  });

  // see if we can get event data from the API with the slug and write to console

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://locksmith.unlock-protocol.com/v2/events/${newEvent.slug}`,
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
  
  revalidatePath("/events");
  redirect(`/events/${event.id}`);
}

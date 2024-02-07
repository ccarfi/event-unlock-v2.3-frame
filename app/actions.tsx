"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import {UnlockEvent} from "./types";
import {redirect} from "next/navigation";

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
    score: Number(event.created_at),
    member: newEvent.id,
  });

  revalidatePath("/events");
  redirect(`/events/${event.id}`);
}

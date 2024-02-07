"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import {UnlockEvent} from "./types";
import {redirect} from "next/navigation";

export async function saveEvent(event: UnlockEvent, formData: FormData) {
  let newEvent = {
    ...event,
    created_at: Date.now(),
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    contractAddress: formData.get("contractAddress") as string,
    networkValue: formData.get("network"),        // need to do some typing below
    checkoutURL: "testcheckoutURL" as string,
    eventImageURL: " test eventImageURL" as string,
    registeredImageURL: "test registeredImageURL" as string,
    registeredLocationImageURL: "test registeredLocationImageURL" as string,
    registeredTicketImageURL: "test registeredTicketImageURL" as string,   
  }
  
  // Retrieve the value from the form data
//  const networkValue = formData.get("network");

  // Initialize a variable for the network number
  let network: number;

  // Check if the value is a string and not null or a File object
  if (typeof networkValue === 'string') {
    // Convert the string to a number
    network = Number(networkValue);
    newEvent.network = network;
  } else {
    // Handle the case where the value is not a string (or throw an error)
    newEvent.network = 0; // default value, or throw an error
  }
  
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

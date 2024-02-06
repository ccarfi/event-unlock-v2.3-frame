"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import {Poll, POLL_EXPIRY} from "./types";
import {UnlockEvent} from "./types";
import {redirect} from "next/navigation";

export async function savePoll(poll: Poll, formData: FormData) {
  let newPoll = {
    ...poll,
    created_at: Date.now(),
    title: formData.get("title") as string,
    option1: formData.get("option1") as string,
    option2: formData.get("option2") as string,
    option3: formData.get("option3") as string,
    option4: formData.get("option4") as string,
  }
  await kv.hset(`poll:${poll.id}`, newPoll);       // changed this from 'poll' to 'newPoll'
  await kv.expire(`poll:${poll.id}`, POLL_EXPIRY);
  await kv.zadd("polls_by_date", {
    score: Number(poll.created_at),
    member: newPoll.id,
  });
  
  revalidatePath("/events");
  redirect(`/events/${poll.id}`);
}

// export async function saveEvent(event: UnlockEvent) {
export async function saveEvent(event: UnlockEvent, formData: FormData) {
  let newEvent = {
    ...event,
    created_at: Date.now(),
    title: formData.get("title") as string,
    contractAddress: formData.get("contractAddress") as string,
    network: 137 as number,
    checkoutURL: "testcheckoutURL" as string,
    eventImageURL: " test eventImageURL" as string,
    registeredImageURL: "test registeredImageURL" as string,
    registeredLocationImageURL: "test registeredLocationImageURL" as string,
    registeredTicketImageURL: "test registeredTicketImageURL" as string,
//    option1: "Register" as string,
//    option2: "Show location" as string,
//    option3: "See ticket" as string,
//   option4: "" as string,
    
/*
    created_at: Date.now(),
    title: formDataEvent.get("title") as string,
    contractAddress: get("contractAddress") as string,
    network: formDataEvent.get("network") as number,
    checkoutURL: formDataEvent.get("checkoutURL") as string,
    eventImageURL: formDataEvent.get("eventImageURL") as string,
    registeredImageURL: formDataEvent.get("registeredImageURL") as string,
    registeredLocationImageURL: formDataEvent.get("registeredLocationImageURL") as string,
    registeredTicketImageURL: formDataEvent.get("registeredTicketImageURL") as string,
    option1: "Register" as string,
    option2: "Show location" as string,
    option3: "See ticket" as string,
    option4: "" as string,
*/
    
  }
  console.log("newEvent:");
  console.log(newEvent);            
  await kv.hset(`event:${event.id}`, newEvent);
  await kv.zadd("events_by_date", {
    score: Number(event.created_at),
    member: newEvent.id,
  });

  let testEvent: UnlockEvent | null = await kv.hgetall(`event:17dbc2c9-a757-4a0e-8656-e14e7795c6b7`);
  console.log("Event from earlier:");
  console.log(testEvent);


  revalidatePath("/events");
  redirect(`/events/${event.id}`);
}

export async function votePoll(poll: Poll, optionIndex: number) {
  await kv.hincrby(`poll:${poll.id}`, `votes${optionIndex}`, 1);

  revalidatePath(`/events/${poll.id}`);
  redirect(`/events/${poll.id}?results=true`);
}

export async function redirectToPolls() {
  redirect("/events");
}

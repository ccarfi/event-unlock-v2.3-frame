"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import {Poll, POLL_EXPIRY} from "./types";
import {Event} from "./types";
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
  await kv.hset(`poll:${poll.id}`, poll);
  await kv.expire(`poll:${poll.id}`, POLL_EXPIRY);
  await kv.zadd("polls_by_date", {
    score: Number(poll.created_at),
    member: newPoll.id,
  });

/*  
  export async function saveEvent(event: Event, formDataEvent: FormDataEvent) {
  let newEvent = {
    ...event,
    created_at: Date.now(),
    title: formDataEvent.get("title") as string,
    option1: formDataEvent.get("option1") as string,
    option2: formDataEvent.get("option2") as string,
    option3: formDataEvent.get("option3") as string,
    option4: formDataEvent.get("option4") as string,
    contractAddress: get("contractAddress") as string,
    network: formDataEvent.get("network") as number,
    checkoutURL: formDataEvent.get("checkoutURL") as string,
    eventImageURL: formDataEvent.get("eventImageURL") as string,
    registeredImageURL: formDataEvent.get("registeredImageURL") as string,
    registeredLocationImageURL: formDataEvent.get("registeredLocationImageURL") as string,
    registeredTicketImageURL: formDataEvent.get("registeredTicketImageURL") as string,
  }
  await kv.hset(`event:${event.id}`, event);
  await kv.zadd("events_by_date", {
    score: Number(event.created_at),
    member: newEvent.id,
  });
*/

  revalidatePath("/events");
  redirect(`/events/${poll.id}`);
}

export async function votePoll(poll: Poll, optionIndex: number) {
  await kv.hincrby(`poll:${poll.id}`, `votes${optionIndex}`, 1);

  revalidatePath(`/events/${poll.id}`);
  redirect(`/events/${poll.id}?results=true`);
}

export async function redirectToPolls() {
  redirect("/events");
}

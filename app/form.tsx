"use client";

import clsx from "clsx";
import {useOptimistic, useRef, useState, useTransition} from "react";
import {saveEvent} from "./actions";
import { v4 as uuidv4 } from "uuid";
import {UnlockEvent} from "./types";
import {useRouter, useSearchParams} from "next/navigation";

type EventState = {
  newEvent: UnlockEvent;
  updatedEvent?: UnlockEvent;
  pending: boolean;
  voted?: boolean;
};

export function EventCreateForm() {
  let formRef = useRef<HTMLFormElement>(null);
  let [state, mutate] = useOptimistic(
      { pending: false },
      function createReducer(state, newEvent: EventState) {
        if (newEvent.newEvent) {
          return {
            pending: newEvent.pending,
          };
        } else {
          return {
            pending: newEvent.pending,
          };
        }
      },
  );

    let eventStub = {
    id: uuidv4(),
    created_at: new Date().getTime(),
    title: "",
    slug: "",
    contractAddress: "",
    network: 0,
    checkoutURL: "",
    eventImageURL: "",
    registeredImageURL: "",
    registeredLocationImageURL: "",
    registeredTicketImageURL: "",
  };
  let saveWithNewEvent = saveEvent.bind(null, eventStub);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let [isPending, startTransition] = useTransition();

  return (
      <>
        <div className="mx-8 w-full">
          <form
              className="relative my-8"
              ref={formRef}
              onSubmit={(event) => {
                event.preventDefault();
                let formData = new FormData(event.currentTarget);

                let newEvent = {
                  ...eventStub,
                  title: formData.get("title") as string,
                }

                formRef.current?.reset();
                startTransition(async () => {
                  mutate({
                    newEvent,
                    pending: true,
                  });

                  await saveEvent(newEvent, formData);
                });
              }}
          >
            <input
                aria-label="Event Title"
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                maxLength={150}
                placeholder="Privy Meetup ETHDenver."
                required
                type="text"
                name="title"
            />
           <input
                aria-label="Event Slug (do not include the /)"
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                maxLength={150}
                placeholder="privy-meetup"
                required
                type="text"
                name="slug"
            />
            <input
                aria-label="Contract Address"
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                maxLength={150}
                placeholder="0x12345678..."
                required
                type="text"
                name="contractAddress"
            />
            <input
                aria-label="Network"
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                maxLength={150}
                placeholder="8453"
                required
                type="number"
                name="network"
            />
              <div className={"pt-2 flex justify-end"}>
                  <button
                      className={clsx(
                          "flex items-center p-1 justify-center px-4 h-10 text-lg border bg-blue-500 text-white rounded-md w-24 focus:outline-none focus:ring focus:ring-blue-300 hover:bg-blue-700 focus:bg-blue-700",
                          state.pending && "bg-gray-700 cursor-not-allowed",
                      )}
                      type="submit"
                      disabled={state.pending}
                  >
                      Create
                  </button>
              </div>
          </form>
        </div>
          <div className="w-full">
          </div>
      </>
  );
}

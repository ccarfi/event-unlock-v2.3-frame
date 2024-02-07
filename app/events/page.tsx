import {kv} from "@vercel/kv";
import {Poll} from "@/app/types";
import {UnlockEvent} from "@/app/types";
import Link from "next/link";

const SEVEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 7;


async function getPolls() {
    try {
        let pollIds = await kv.zrange("polls_by_date", Date.now(), Date.now() - SEVEN_DAYS_IN_MS, {byScore: true, rev: true, count: 100, offset: 0});

        if (!pollIds.length) {
            return [];
        }

        let multi = kv.multi();
        pollIds.forEach((id) => {
            multi.hgetall(`poll:${id}`);
        });

        let items: Poll[] = await multi.exec();
        return items.map((item) => {
            return {...item};
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}


async function getEvents() {
    try {
        let eventIds = await kv.zrange("events_by_date", Date.now(), Date.now() - SEVEN_DAYS_IN_MS, {byScore: true, rev: true, count: 100, offset: 0});

        if (!eventIds.length) {
            return [];
        }

        let multi = kv.multi();
        eventIds.forEach((id) => {
            multi.hgetall(`event:${id}`);
        });

        let items: UnlockEvent[] = await multi.exec();
        return items.map((item) => {
            return {...item};
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

/*
export default async function Page() {
    const events = await getEvents();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
                <h1 className="text-lg sm:text-2xl font-bold mb-2">
                    Created Events
                </h1>
                <div className="flex-1 flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
                    {
                        events.map((event) => {
                        // returns links to event ids
                        return (<div key={event.id}>
                            <a href={`/events/${event.id}`} className="underline">
                                <p className="text-md sm:text-xl mx-4">{event.title}</p>
                            </a>
                        </div>)
                        })
                    }
                </div>
                <Link href="/">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Event
                    </button>
                </Link>
            </main>
        </div>
    );
}
*/

export default async function Page() {
    const polls = await getPolls();
    const events = await getEvents();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
                <h1 className="text-lg sm:text-2xl font-bold mb-2">
                    Created Polls
                </h1>
                <div className="flex-1 flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
                    {
                        polls.map((poll) => {
                        // returns links to poll ids
                        return (<div key={event.id}>
                            <a href={`/events/${poll.id}`} className="underline">
                                <p className="text-md sm:text-xl mx-4">{event.title}</p>
                            </a>
                        </div>)
                        })
                    }
                </div>
                <Link href="/">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Poll
                    </button>
                </Link>
            </main>
        </div>
    );
}


import {EventCreateForm} from "./form";

export let metadata = {
  title: "Unlock Event Frames v2.31",
  description: "Event Unlock frames on Warpcast",
};

export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <div className="flex justify-center items-center bg-black rounded-full w-16 sm:w-24 h-16 sm:h-24 my-8">
  	  <img src={`${process.env['HOST']}/unlock-icon-round.png`} alt="Unlock Logo" />
	</div>
        <h1 className="text-lg sm:text-2xl font-bold mb-2">
          Unlock Event Frames v2.3
        </h1>
        <h2 className="text-md sm:text-xl mx-4">
          Create a new event registration frame
        </h2>
        <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
          Go to /events/nameofyourevent for your event.
        </div>
      </main>
    </div>
  );
}

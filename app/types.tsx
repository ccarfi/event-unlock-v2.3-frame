
// TODO: see if this next line is needed
export const POLL_EXPIRY = 60 * 60 * 24 * 180; // Expire polls after 3 months

export type UnlockEvent = {
  id: string;
  title: string;
  slug: string,
  contractAddress: string;
  network: number;
  checkoutURL: string;
  eventImageURL: string;
  registeredImageURL: string;
  registeredLocationImageURL: string;
  registeredTicketImageURL: string;
  created_at: number;
};

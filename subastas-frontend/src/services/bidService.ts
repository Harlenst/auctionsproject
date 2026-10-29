
import type { Auction } from '../components/AuctionCard';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface BidResponse {
  ok: boolean;
  data: Auction['bids'][number];
}

export async function placeBid(
  auctionId: number,
  amount: number,
  token: string
): Promise<BidResponse> {
  const response = await fetch(
    `${API_URL}/auctions/${auctionId}/bids`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    }
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.message || 'No fue posible registrar la puja.'
    );
  }

  return result as BidResponse;
}

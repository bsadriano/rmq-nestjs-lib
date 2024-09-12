export interface Auction {
  id: number;
  reservePrice: number;
  seller: User;
  winner: string;
  soldAmount: number;
  currentHighBid: number;
  createdAt: string;
  updatedAt: string;
  auctionEnd: string;
  status: AuctionStatus;
  item: Item;
}

export enum AuctionStatus {
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  RESERVE_NOT_MET = 'RESERVE_NOT_MET',
}

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  auctions: Auction[];
}

export interface Item {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  imageUrl: string;
  auction: Auction;
}

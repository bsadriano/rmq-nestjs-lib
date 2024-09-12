import { Expose, Transform } from 'class-transformer';
import { getFullName } from '../../utils/string';
import { Auction, AuctionStatus } from '../interfaces/auction.interface';

export class AuctionCreatedDto {
  @Expose()
  id: number;

  @Expose()
  reservePrice: number;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) =>
    getFullName(obj.seller.firstName, obj.seller.lastName),
  )
  seller: string;

  @Expose()
  winner: string;

  @Expose()
  soldAmount: string;

  @Expose()
  currentHighBid: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  auctionEnd: string;

  @Expose()
  status: AuctionStatus;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.make)
  make: string;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.model)
  model: string;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.year)
  year: number;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.color)
  color: string;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.mileage)
  mileage: number;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.imageUrl)
  imageUrl: string;
}

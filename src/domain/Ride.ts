import crypto from 'crypto';
import Coord from './Coord';

export default class Ride {
  private from: Coord;
  private to: Coord;

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    readonly driverId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    readonly status: string,
    readonly date: Date
  ) {
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
  }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number): Ride {
    const status = "requested";
    const date = new Date();
    return new Ride(crypto.randomUUID(), passengerId, "", fromLat, fromLong, toLat, toLong, status, date);
  }

  getFrom() {
    return this.from;
  }

  getTo() {
    return this.to;
  }
}
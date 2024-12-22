import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";


export default class GetRide implements UseCase {

  constructor(readonly rideRepository: RideRepository) { }

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getRideById(rideId);
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      driverId: ride.driverId,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      status: ride.status,
      date: ride.date
    }
  }
}

type Output = {
  rideId: string,
  passengerId: string,
  driverId: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
  status: string,
  date: Date
}
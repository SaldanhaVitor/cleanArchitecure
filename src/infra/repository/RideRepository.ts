import RideRepository from "../../application/repository/RideRepository";
import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/Databaseconnection";

export default class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {
  }

  async saveRide(ride: Ride): Promise<void> {
    await this.connection.query(
      `insert into cccat17.ride ( 
        ride_id, 
        passenger_id, 
        driver_id, 
        from_lat,
        from_long,
        to_lat,
        to_long,
        status,
        date
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [ride.rideId, ride.passengerId, ride.driverId || null, ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.status, ride.date]);
  }

  async getRideById(rideId: string): Promise<Ride> {
    const [rideData] = await this.connection.query("select * from cccat17.ride where ride_id = $1", [rideId]);
    if (!rideData) throw new Error('Ride not found');
    return new Ride(rideData.ride_id, rideData.passenger_id, rideData.driver_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date);
  }

  async hasActiveRide(passengerId: string): Promise<boolean> {
    const [rideData] = await this.connection.query("select * from cccat17.ride where passenger_id = $1 and status in ( 'requested', 'in_progress', 'accepted')", [passengerId]);
    return !!rideData;
  }
}
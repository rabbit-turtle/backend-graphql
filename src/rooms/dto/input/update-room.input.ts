export interface IUpdateRoomInput {
  location?: string; // (location) => JSON.strigify(location)
  reserved_time?: Date;
  completed_time?: Date;
  room_status_id?: number;
  receiver_id?: string;
}

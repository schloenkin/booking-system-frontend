export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface BookingResponse {
  id: number;
  userId: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

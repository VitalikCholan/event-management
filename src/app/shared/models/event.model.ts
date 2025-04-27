export interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  time: string; // HH:mm
  timezone: string;
  image: string; // base64 or URL
}

export type AddScheduleRequest = {
  title: string;
  description: string;
  date: Date;
  unique_id: string;
};

export type AddScheduleResponse = {
  title: string;
  description: string;
  date: Date;
};

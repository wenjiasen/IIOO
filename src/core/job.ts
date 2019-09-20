export interface IJobNew {
  topicName: string;
  payload: any;
}
export interface IJobInfo {
  id: string;
  status: JobState;
  topicName: string;
  payload: any;
}

export enum JobState {
  Waiting = 0,
  Executing = 1,
  Success = 2,
  Failed = 3,
}

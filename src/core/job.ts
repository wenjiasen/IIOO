export interface IJobNew {
  topicName: string;
  payload: any;
}
export interface IJobInfo {
  id: string;
  status: JobStatus;
  topicName: string;
  payload: any;
}

export enum JobStatus {
  Waiting = 0,
  Executing = 1,
  Success = 2,
  Failed = 3,
}

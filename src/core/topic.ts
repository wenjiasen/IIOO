import { IListenerInfo } from './listener';

export interface ITopicNew {
  name: string;
}
export interface ITopicInfo {
  name: string;
  listener: IListenerInfo[];
}

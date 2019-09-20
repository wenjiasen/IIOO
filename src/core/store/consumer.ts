import { IListenerInfo } from '../listener';

export interface IConsumerStore {
  /**
   * has topic with name
   */
  hasTopic: (topicName: string) => Promise<boolean>;
  /**
   * subscription the topic
   */
  subscription: (topicName: string, listener: IListenerInfo) => Promise<boolean>;
  /**
   * unSubscription the topic
   */
  unSubscription: (topicName: string, name: string) => Promise<boolean>;
}

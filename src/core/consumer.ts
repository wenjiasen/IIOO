import { validTopicName } from './common';
import { Logger } from '../utils/logger';
import { IStore } from './store';
import { IListenerInfo } from './listener';

export class Consumer {
  private storeClient: IStore;
  constructor(store: IStore) {
    this.storeClient = store;
  }

  // TODO:考虑多个listener，暂时不做的愿意是多个listener需要考虑事务问题
  // TODO:考虑推模式还是拉模式，服务器推模式能够直接取回result,客户端拉也存在要往服务器回传result的情况，所以用服务器推模式

  /**
   * subscription
   * @param topicName
   * @param listener
   */
  public async subscription(topicName: string, listener: IListenerInfo) {
    // check
    validTopicName(validTopicName);
    const isHas = await this.storeClient.topic.has(topicName);
    if (!isHas) throw new Error(`Can't find topic with name '${topicName}'`);
    try {
      const result = await this.storeClient.topic.subscription(topicName, listener);
      return result;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  /**
   * unSubscription
   * @param topicName
   * @param listenerName
   */
  public async unSubscription(topicName: string, listenerName: string) {
    // check
    validTopicName(validTopicName);
    const isHas = await this.storeClient.topic.has(topicName);
    if (!isHas) throw new Error(`Can't find topic with name '${topicName}'`);

    try {
      const result = await this.storeClient.topic.unSubscription(topicName, listenerName);
      return result;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  // public pause() {
  //   //
  // }
  // public resume() {
  //   //
  // }
  // public close() {
  //   //
  // }
}

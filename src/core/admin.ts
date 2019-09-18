import { Logger } from '../utils/logger';
import { validTopicName } from './common';
import { IStroe } from './store';

class Admin {
  /**
   * store
   */
  private storeClient: IStroe;
  constructor(store: IStroe) {
    this.storeClient = store;
  }
  /**
   * create a new topic
   * @param newTopic
   */
  public async createTopic(newTopic: IIOO.Topic.INewTopic): Promise<IIOO.Topic.IInfo | undefined> {
    try {
      // check
      validTopicName(newTopic.name);

      // check exists
      const oldTopic = await this.storeClient.topic.findByName(newTopic.name);
      if (oldTopic) {
        throw new Error(`${newTopic.name} already exists`);
      }

      const topic = await this.storeClient.topic.save(newTopic);
      return topic;
    } catch (error) {
      Logger.error(error);
    }
  }
  /**
   * delete topic by name
   * @param name
   */
  public async deleteTopic(name: string): Promise<boolean> {
    try {
      validTopicName(name);
      const result = await this.storeClient.topic.delete(name);
      return result;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  /**
   * describe topic by name
   * @param name
   */
  public async describeTopic(name: string): Promise<IIOO.Topic.IInfo | undefined> {
    try {
      validTopicName(name);
      const result = this.storeClient.topic.findByName(name);
      return result;
    } catch (error) {
      Logger.error(error);
    }
  }

  /**
   * get topics
   * @param page
   * @param pageSize
   */
  public async listTopics(page: number = 1, pageSize: number = 10): Promise<IIOO.Topic.IInfo[]> {
    let results: IIOO.Topic.IInfo[] = [];
    try {
      results = await this.storeClient.topic.list({
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });
    } catch (error) {
      Logger.error(error);
    }
    return results;
  }

  /**
   * Delete Job by ID
   * @param id
   */
  public async deleteJob(id: string): Promise<boolean> {
    try {
      const result = await this.storeClient.job.delete(id);
      return result;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}

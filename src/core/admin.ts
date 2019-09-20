import { Logger } from '../utils/logger';
import { validTopicName } from './common';
import { IAdminStore } from './store/admin';
import { ITopicNew, ITopicInfo } from './topic';

class Admin {
  /**
   * store
   */
  private storeClient: IAdminStore;
  constructor(store: IAdminStore) {
    this.storeClient = store;
  }
  /**
   * create a new topic
   * @param newTopic
   */
  public async createTopic(newTopic: ITopicNew): Promise<ITopicInfo | undefined> {
    try {
      // check
      validTopicName(newTopic.name);

      // check exists
      const oldTopic = await this.storeClient.findTopicByName(newTopic.name);
      if (oldTopic) {
        throw new Error(`${newTopic.name} already exists`);
      }

      const topic = await this.storeClient.createTopic(newTopic);
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
      const result = await this.storeClient.deleteTopic(name);
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
  public async describeTopic(name: string): Promise<ITopicInfo | undefined> {
    try {
      validTopicName(name);
      const result = this.storeClient.findTopicByName(name);
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
  public async listTopics(page: number = 1, pageSize: number = 10): Promise<ITopicInfo[]> {
    let results: ITopicInfo[] = [];
    try {
      results = await this.storeClient.listTopic({
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
      const result = await this.storeClient.deleteJob(id);
      return result;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}

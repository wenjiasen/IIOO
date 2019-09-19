import { validTopicName } from './common';
import { Logger } from '../utils/logger';
import { IStore } from './store';
import { IJobNew, IJobInfo } from './job';

/**
 * Producer
 */
export class Producer {
  private storeClient: IStore;
  constructor(store: IStore) {
    this.storeClient = store;
  }
  /**
   * Crate a job
   * @param job
   */
  public async createJob(newJob: IJobNew): Promise<IJobInfo> {
    validTopicName(newJob.topicName);
    // TODO:控制过大的输入
    // TODO:控制空输入
    try {
      const result = await this.storeClient.job.create(newJob);
      return result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}

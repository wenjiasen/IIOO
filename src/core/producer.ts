import { validTopicName } from './common';
import { Logger } from '../utils/logger';

/**
 * Producer
 */
export class Producer {
  private storeClient: IIOO.Store.IStroe;
  constructor(store: IIOO.Store.IStroe) {
    this.storeClient = store;
  }
  /**
   * Crate a job
   * @param job
   */
  public async createJob(newJob: IIOO.Job.INew): Promise<IIOO.Job.IInfo> {
    validTopicName(newJob.topicName);
    // TODO:控制过大的输入
    // TODO:控制空输入
    try {
      const result = await this.storeClient.job.save(newJob);
      return result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}

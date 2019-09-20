import { ITopicInfo } from '../topic';
import { IJobInfo } from '../job';

interface ISearchListOpts {
  offset: number;
  limit: number;
}

export interface IEngineStore {
  /**
   * get topic list
   */
  getTopicList: (opts?: ISearchListOpts) => Promise<ITopicInfo[]>;

  /**
   * get jobs with status is 'waiting'
   */
  getWaitingJobs: (topicName: string, opts?: ISearchListOpts) => Promise<IJobInfo[]>;

  /**
   * lock job
   * @description Lock the job and make sure that only one woker can execute it.
   */
  executeLockJob: (id: string) => Promise<boolean>;

  /**
   * job finish
   */
  finishJob: (id: string, result: any) => Promise<boolean>;

  /**
   * job failed
   */
  failedJob: (id: string, errorMsg: string) => Promise<boolean>;
}

import { IJobNew, IJobInfo, JobState } from './job';
import { ITopicInfo, ITopicNew } from './topic';
import { IListenerInfo } from './listener';
interface ISearchListOpts {
  offset: number;
  limit: number;
}

export interface IStore {
  topic: {
    create: (newTopic: ITopicNew) => Promise<ITopicInfo>;
    delete: (name: string) => Promise<boolean>;
    has: (name: string) => Promise<boolean>;
    findByName: (name: string) => Promise<ITopicInfo | undefined>;
    list: (opts?: ISearchListOpts) => Promise<ITopicInfo[]>;
    subscription: (topicName: string, listener: IListenerInfo) => Promise<boolean>;
    unSubscription: (topicName: string, name: string) => Promise<boolean>;
  };
  job: {
    create: (newJob: IJobNew) => Promise<IJobInfo>;
    delete: (id: string) => Promise<boolean>;
    findById: (id: string) => Promise<IJobInfo | undefined>;
    getTopicJobs: (topicName: string, opts?: ISearchListOpts) => Promise<IJobInfo[]>;

    /**
     * 任务执行锁定，防止多实例重复执行同一个任务
     */
    executeLock: (id: string) => Promise<boolean>;
    /**
     * 任务完成处理
     */
    finish: (id: string, result: any) => Promise<boolean>;
    /**
     * 任务失败处理
     */
    failed: (id: string, errorMsg: string) => Promise<boolean>;
  };
}

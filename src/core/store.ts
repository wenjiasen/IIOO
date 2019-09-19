import { IJobNew, IJobInfo, JobState } from './job';
import { ITopicInfo, ITopicNew } from './topic';
import { IListenerInfo } from './listener';
interface ISearchListOpts {
  offset: number;
  limit: number;
}

export interface IStore {
  topic: {
    save: (newTopic: ITopicNew) => Promise<ITopicInfo>;
    delete: (name: string) => Promise<boolean>;
    has: (name: string) => Promise<boolean>;
    findByName: (name: string) => Promise<ITopicInfo | undefined>;
    list: (opts?: ISearchListOpts) => Promise<ITopicInfo[]>;
    subscription: (topicName: string, listener: IListenerInfo) => Promise<boolean>;
    unSubscription: (topicName: string, name: string) => Promise<boolean>;
  };
  job: {
    save: (newJob: IJobNew) => Promise<IJobInfo>;
    delete: (id: string) => Promise<boolean>;
    findById: (id: string) => Promise<IJobInfo | undefined>;
    getTopicJobs: (topicName: string) => Promise<IJobInfo[]>;
    updateState: (id: string, state: JobState) => Promise<boolean>;
    finish: (id: string, result: any) => Promise<boolean>;
    failed: (id: string, errorMsg: string) => Promise<boolean>;
  };
}

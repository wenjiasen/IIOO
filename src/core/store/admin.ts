import { ITopicNew, ITopicInfo } from '../topic';

interface ISearchListOpts {
  offset: number;
  limit: number;
}
export interface IAdminStore {
  createTopic: (newTopic: ITopicNew) => Promise<ITopicInfo>;
  deleteTopic: (name: string) => Promise<boolean>;
  findTopicByName: (name: string) => Promise<ITopicInfo | undefined>;
  listTopic: (opts?: ISearchListOpts) => Promise<ITopicInfo[]>;
  deleteJob: (id: string) => Promise<boolean>;
}

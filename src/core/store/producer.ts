import { IJobInfo, IJobNew } from '../job';

export interface IProducerStore {
  createJob: (newJob: IJobNew) => Promise<IJobInfo>;
}

import { TopicStore } from './topic';
import { JobStore } from './job';

export class MongoDBStore implements IIOO.Store.IStroe {
  public topic: TopicStore;
  public job: JobStore;
  constructor() {
    this.job = new JobStore();
    this.topic = new TopicStore();
  }
}

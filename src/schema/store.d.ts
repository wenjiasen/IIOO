declare namespace IIOO {
  namespace Store {
    interface IStroe {
      topic: {
        save: (newTopic: IIOO.Topic.INewTopic) => Promise<IIOO.Topic.IInfo>;
        delete: (name: string) => Promise<boolean>;
        has: (name: string) => Promise<boolean>;
        findByName: (name: string) => Promise<IIOO.Topic.IInfo | undefined>;
        list: (opts?: IIOO.Common.ISearchListOpts) => Promise<IIOO.Topic.IInfo[]>;
        subscription: (topicName: string, listener: IIOO.Listener.IInfo) => Promise<boolean>;
        unSubscription: (topicName: string, name: string) => Promise<boolean>;
      };
      job: {
        save: (newJob: IIOO.Job.INew) => Promise<IIOO.Job.IInfo>;
        delete: (id: string) => Promise<boolean>;
        findById: (id: string) => Promise<IIOO.Job.IInfo | undefined>;
        getTopicJobs: (topicName: string) => Promise<IIOO.Job.IInfo[]>;
      };
    }
  }
}

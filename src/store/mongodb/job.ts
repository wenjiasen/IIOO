export class JobStore {
  public async save(newJob: IIOO.Job.INew): Promise<IIOO.Job.IInfo> {
    //
    return '' as any;
  }
  public async delete(id: string): Promise<boolean> {
    //
    return '' as any;
  }
  public async findById(id: string): Promise<IIOO.Job.IInfo | undefined> {
    //
    return '' as any;
  }
  public async getTopicJobs(topicName: string): Promise<IIOO.Job.IInfo[]> {
    // TODO
    return [
      {
        id: '1',
        topicName: 'test',
        payload: { test: 111 },
      },
      {
        id: '2',
        topicName: 'test',
        payload: { test: 112 },
      },
      {
        id: '3',
        topicName: 'test',
        payload: { test: 113 },
      },
      {
        id: '4',
        topicName: 'test',
        payload: { test: 114 },
      },
    ];
  }
}

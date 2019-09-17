export class TopicStore {
  public async save(newTopic: IIOO.Topic.INewTopic): Promise<IIOO.Topic.IInfo> {
    //
    return '' as any;
  }
  public async delete(name: string): Promise<boolean> {
    //
    return '' as any;
  }
  public async has(name: string): Promise<boolean> {
    //
    return '' as any;
  }
  public async findByName(name: string): Promise<IIOO.Topic.IInfo | undefined> {
    //
    return '' as any;
  }
  public async list(opts?: IIOO.Common.ISearchListOpts): Promise<IIOO.Topic.IInfo[]> {
    // TODO
    return [
      {
        name: 'test',
        listener: [
          {
            name: 'test-listenr',
            type: 1,
            url: 'http://localhost:5001',
          },
        ],
      },
    ];
  }
  public async subscription(topicName: string, listener: IIOO.Listener.IInfo): Promise<boolean> {
    //
    return '' as any;
  }
  public async unSubscription(topicName: string, name: string): Promise<boolean> {
    //
    return '' as any;
  }
}

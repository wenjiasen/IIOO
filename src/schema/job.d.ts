declare namespace IIOO {
  namespace Job {
    interface INew {
      topicName: string;
      payload: any;
    }
    interface IInfo {
      id: string;
      topicName: string;
      payload: any;
    }
  }
}

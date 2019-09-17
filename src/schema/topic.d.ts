declare namespace IIOO {
  namespace Topic {
    interface INewTopic {
      name: string;
    }
    interface IInfo {
      name: string;
      listener: IIOO.Listener.IInfo[];
    }
  }
}

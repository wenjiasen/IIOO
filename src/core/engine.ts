import { Queue } from './queue';
import { IEngineStore } from './store/engine';

export class Engine {
  private readonly sotre: IEngineStore;
  private readonly queues: Queue[];
  constructor(store: IEngineStore) {
    this.sotre = store;
    this.queues = [];
  }
  public async start() {
    try {
      // 获取所有的topic
      const topics = await this.sotre.getTopicList();
      // 依次为topic建立queue
      for (const topic of topics) {
        this.queues.push(new Queue(this.sotre, topic));
      }
      // 依次启动queue
      for (const queue of this.queues) {
        queue.loop();
      }
    } catch (error) {
      throw error;
    }
  }
}

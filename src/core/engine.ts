import { Queue } from './queue';
import { IStroe } from './store';

export class Engine {
  private readonly sotre: IStroe;
  private readonly queues: Queue[];
  constructor(store: IStroe) {
    this.sotre = store;
    this.queues = [];
  }
  public async start() {
    // 获取所有的topic
    const topics = await this.sotre.topic.list();
    // 依次为topic建立queue
    for (const topic of topics) {
      this.queues.push(new Queue(this.sotre, topic));
    }
    // 依次启动queue
    for (const queue of this.queues) {
      queue.loop();
    }
  }
}

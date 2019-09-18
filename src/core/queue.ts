import { EventEmitter } from 'events';
import { QueueWorker } from './worker';
import { Logger } from '../utils/logger';
import { IStroe } from './store';
enum QueueEvent {
  GetMoreJobs = 'getMoreJobs',
  Execute = 'execute',
  Loop = 'loop',
}

export class Queue {
  private core!: EventEmitter;
  private inGetMore = false;
  private jobs: IIOO.Job.IInfo[] = [];
  private workers: QueueWorker[] = [];
  private store: IStroe;
  private topic: IIOO.Topic.IInfo;
  constructor(store: IStroe, topic: IIOO.Topic.IInfo) {
    this.core = new EventEmitter();
    this.core.on(QueueEvent.Loop, this.onLoop.bind(this));
    this.core.on(QueueEvent.GetMoreJobs, this.onGetMoreJobs.bind(this));
    this.store = store;
    this.topic = topic;
    this.bindWorker();
  }

  public loop() {
    this.core.emit(QueueEvent.Loop);
  }

  private bindWorker() {
    for (const listener of this.topic.listener) {
      const workerCore = new QueueWorker(listener);
      workerCore.onJobSuccess((job, result) => {
        // TODO
      });
      workerCore.onJobFailed((err, job, result) => {
        // TODO
      });
      this.workers.push(workerCore);
    }
  }

  private getMoreJob() {
    this.core.emit(QueueEvent.GetMoreJobs);
  }

  private getFreeWorker(): QueueWorker | undefined {
    const index = this.workers.findIndex((worker) => {
      return worker.executingJobs.size <= worker.wokerMaxJob;
    });
    if (index >= 0) {
      return this.workers[index];
    }
    return;
  }

  private async onGetMoreJobs() {
    if (this.inGetMore) return;
    this.inGetMore = true;
    try {
      const jobs = await this.store.job.getTopicJobs(this.topic.name);
      this.jobs = this.jobs.concat(jobs || []);
      this.loop();
    } catch (error) {
      Logger.error(error);
    } finally {
      this.inGetMore = false;
    }
  }

  private getNextJob(): IIOO.Job.IInfo | undefined {
    const nextJob = this.jobs.shift();
    if (!nextJob) this.getMoreJob();
    return nextJob;
  }

  private onLoop() {
    const freeWoker = this.getFreeWorker();
    if (!freeWoker) return;

    // 获取下一个任务
    const job = this.getNextJob();
    if (!job) return;

    // 分配woker执行
    freeWoker.execute(job);

    // 重复执行，直到没有空闲的woker,，然后等待job完成事件唤起
    this.loop();
  }
}

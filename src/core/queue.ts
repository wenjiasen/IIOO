import { EventEmitter } from 'events';
import { QueueWorker } from './worker';
import { Logger } from '../utils/logger';
import { IStore } from './store';
import { IJobInfo, JobState } from './job';
import { ITopicInfo } from './topic';
enum QueueEvent {
  GetMoreJobs = 'getMoreJobs',
  Execute = 'execute',
  Loop = 'loop',
}

export class Queue {
  private core!: EventEmitter;
  private inGetMore = false;
  private inLoop = false;
  private jobs: IJobInfo[] = [];
  private workers: QueueWorker[] = [];
  private store: IStore;
  private topic: ITopicInfo;
  constructor(store: IStore, topic: ITopicInfo) {
    this.core = new EventEmitter();
    this.core.on(QueueEvent.Loop, this.onLoop.bind(this));
    this.core.on(QueueEvent.GetMoreJobs, this.onGetMoreJobs.bind(this));
    this.store = store;
    this.topic = topic;
    this.bindWorker();
    setInterval(this.loop.bind(this), 10000);
  }

  public loop() {
    if (this.inLoop) return;
    this.inLoop = true;
    this.core.emit(QueueEvent.Loop);
  }

  private bindWorker() {
    for (const listener of this.topic.listener) {
      const workerCore = new QueueWorker(listener);

      workerCore.onJobSuccess(async (job, result) => {
        await this.store.job.finish(job.id, result);
      });

      workerCore.onJobFailed(async (err, job) => {
        await this.store.job.failed(job.id, err.message);
      });

      this.workers.push(workerCore);
    }
  }
  private async lockJob(job: IJobInfo) {
    return await this.store.job.executeLock(job.id);
  }

  private getMoreJob() {
    this.core.emit(QueueEvent.GetMoreJobs);
  }

  private getFreeWorker(): QueueWorker | undefined {
    const index = this.workers.findIndex((worker) => {
      return worker.isFree();
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

  private getNextJob(): IJobInfo | undefined {
    const nextJob = this.jobs.shift();
    if (!nextJob) this.getMoreJob();
    return nextJob;
  }

  private async onLoop() {
    this.inLoop = false;
    // TODO:目前的处理方式无法保证任务执行顺序，待优化
    const freeWoker = this.getFreeWorker();
    if (!freeWoker) return;

    // 获取下一个任务
    const job = this.getNextJob();
    if (!job) return;
    try {
      // 如果锁定失败，则此任务有可能已被执行，则跳过
      const isLock = await this.lockJob(job);
      if (!isLock) return;
      freeWoker.execute(job);
    } catch (error) {
      Logger.error(error);
    } finally {
      // 重复执行，直到没有空闲的woker,然后等待job完成事件唤起
      this.loop();
    }
  }
}

import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import requestPromise from 'request-promise';
import { IJobInfo } from './job';
import { IListenerInfo } from './listener';
type SuccessHandler = (job: IJobInfo, result?: any) => void;
type FailedHandler = (error: Error, job: IJobInfo) => void;

enum WorkerEvent {
  ExecuteJob = 'ExecuteJob',
}

interface IQueueWorkerOption {
  maxJob: number;
}

export class QueueWorker extends EventEmitter {
  private executingJobs: Set<string> = new Set();
  private readonly listener: IListenerInfo;
  private jobSuccessHandler?: SuccessHandler;
  private jobFailedHandler?: FailedHandler;
  private options: IQueueWorkerOption;

  constructor(listener: IListenerInfo, options: IQueueWorkerOption = { maxJob: 10 }) {
    super();
    this.options = options;
    this.listener = listener;
    this.addListener(WorkerEvent.ExecuteJob, this.jobExecute);
  }

  private jobSuccess(job: IJobInfo, result?: any) {
    this.jobSuccessHandler && this.jobSuccessHandler(job, result);
  }

  private jobFailed(error: Error, job: IJobInfo) {
    this.jobFailedHandler && this.jobFailedHandler(error, job);
  }

  private async jobExecute(job: IJobInfo) {
    try {
      const result = await requestPromise.post(this.listener.url, {
        json: job,
      });
      this.jobSuccess(job, result);
    } catch (error) {
      this.jobFailed(error, job);
      Logger.error(error);
    } finally {
      this.executingJobs.delete(job.id);
    }
  }

  public isFree() {
    return this.executingJobs.size <= this.options.maxJob;
  }

  public execute(job: IJobInfo) {
    this.executingJobs.add(job.id);
    this.emit(WorkerEvent.ExecuteJob, job);
  }

  public onJobSuccess(handler: SuccessHandler) {
    this.jobSuccessHandler = handler;
  }

  public onJobFailed(handler: FailedHandler) {
    this.jobFailedHandler = handler;
  }
}

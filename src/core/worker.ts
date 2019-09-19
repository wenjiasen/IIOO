import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import requestPromise from 'request-promise';
import { IJobInfo } from './job';
import { IListenerInfo } from './listener';
type SuccessHandler = (job: IJobInfo, result?: any) => void;
type FailedHandler = (error: Error, job: IJobInfo, result?: any) => void;

enum WorkerEvent {
  ExecuteJob = 'ExecuteJob',
}

export class QueueWorker extends EventEmitter {
  public readonly wokerMaxJob: number;
  private readonly listener: IListenerInfo;
  public executingJobs: Set<string> = new Set();
  private jobSuccessHandler?: SuccessHandler;
  private jobFailedHandler?: FailedHandler;

  constructor(listener: IListenerInfo, wokerMaxJob = 10) {
    super();
    this.wokerMaxJob = wokerMaxJob;
    this.listener = listener;
    this.addListener(WorkerEvent.ExecuteJob, this.jobExecute);
  }

  private jobSuccess(job: IJobInfo, result?: any) {
    this.jobSuccessHandler && this.jobSuccessHandler(job, result);
  }

  private jobFailed(error: Error, job: IJobInfo, result?: any) {
    this.jobFailedHandler && this.jobFailedHandler(error, job, result);
  }

  private async jobExecute(job: IJobInfo) {
    try {
      const result = await requestPromise.post(this.listener.url, {
        json: job,
      });
      this.jobSuccess(job, result.body);
    } catch (error) {
      this.jobFailed(new Error('execute error!'), job, error);
      Logger.error(error);
    } finally {
      this.executingJobs.delete(job.id);
    }
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

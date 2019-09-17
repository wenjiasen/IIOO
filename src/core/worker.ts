import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import requestPromise from 'request-promise';
type SuccessHandler = (job: IIOO.Job.IInfo, result?: any) => void;
type FailedHandler = (error: Error, job: IIOO.Job.IInfo, result?: any) => void;

export class QueueWorker extends EventEmitter {
  public readonly wokerMaxJob: number;
  private readonly listener: IIOO.Listener.IInfo;
  public executingJobs: Set<string> = new Set();
  private jobSuccessHandler?: SuccessHandler;
  private jobFailedHandler?: FailedHandler;
  constructor(listener: IIOO.Listener.IInfo, wokerMaxJob = 10) {
    super();
    this.wokerMaxJob = wokerMaxJob;
    this.listener = listener;
  }

  // private async callRemote(job: IIOO.Job.IInfo) {
  //   const resp: Response = await ;
  //   if (resp.status < 300 && resp.status >= 200) {
  //     this.jobSuccess(job, resp.body);
  //   } else {
  //     this.jobFailed(new Error('worker error!'), job, resp.body);
  //   }
  // }

  private jobSuccess(job: IIOO.Job.IInfo, result?: any) {
    // tslint:disable-next-line:no-unused-expression
    this.jobSuccessHandler && this.jobSuccessHandler(job, result);
  }

  private jobFailed(error: Error, job: IIOO.Job.IInfo, result?: any) {
    // tslint:disable-next-line:no-unused-expression
    this.jobFailedHandler && this.jobFailedHandler(error, job, result);
  }

  public execute(job: IIOO.Job.IInfo) {
    this.executingJobs.add(job.id);
    try {
      // 发起请求
      requestPromise
        .post(this.listener.url, {
          json: job,
        })
        .then((resp) => {
          //
          if (resp.status < 300 && resp.status >= 200) {
            this.jobSuccess(job, resp.body);
          } else {
            this.jobFailed(new Error('worker error!'), job, resp.body);
          }
        })
        .error((error) => {
          Logger.error(error);
        })
        .finally(() => {
          this.executingJobs.delete(job.id);
        });
      // 响应处理
    } catch (error) {
      Logger.error(error);
      this.executingJobs.delete(job.id);
    }
  }

  public onJobSuccess(handler: SuccessHandler) {
    this.jobSuccessHandler = handler;
  }

  public onJobFailed(handler: FailedHandler) {
    this.jobFailedHandler = handler;
  }
}

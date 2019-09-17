import { ArgumentsError } from '../error/argumentsError';
export const validTopicName = (name: any) => {
  if (!name || typeof name !== 'string' || /^[a-zA-Z][a-zA-Z0-9]/.test(name)) {
    throw new ArgumentsError();
  }
};

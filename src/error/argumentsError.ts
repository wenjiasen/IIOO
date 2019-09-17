export class ArgumentsError extends Error {
  constructor(msg?: string) {
    super(msg || 'Invalid arguments!');
  }
}

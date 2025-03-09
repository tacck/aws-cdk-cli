export type { IoMessageLevel, IoMessageCode, IIoHost, IoMessage, IoRequest } from '../shared-public';

/**
 * An SDK logging trace.
 *
 * Only info, warn and error level messages are emitted.
 * SDK traces are emitted as traces to the IoHost, but contain the original SDK logging level.
 */
export interface SdkTrace {
  /**
   * The level the SDK has emitted the original message with
   */
  readonly sdkLevel: 'info' | 'warn' | 'error';

  /**
   * The content of the SDK trace
   *
   * This will include the request and response data for API calls, including potentially sensitive information.
   *
   * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/logging-sdk-calls.html
   */
  readonly content: any;
}

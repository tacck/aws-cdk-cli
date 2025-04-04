import type * as workerpool from 'workerpool';
import type { IntegTestWorkerConfig, SnapshotVerificationOptions } from './common';
import { printSummary, printResults, printLaggards } from './common';
import * as logger from '../logger';
import type { IntegTest } from '../runner/integration-tests';
import { flatten, WorkList } from '../utils';

/**
 * Run Snapshot tests
 * First batch up the tests. By default there will be 3 tests per batch.
 * Use a workerpool to run the batches in parallel.
 */
export async function runSnapshotTests(
  pool: workerpool.WorkerPool,
  tests: IntegTest[],
  options: SnapshotVerificationOptions,
): Promise<IntegTestWorkerConfig[]> {
  logger.highlight('\nVerifying integration test snapshots...\n');

  const todo = new WorkList(tests.map(t => t.testName), {
    onTimeout: printLaggards,
  });

  // The worker pool is already limited
  // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
  const failedTests: IntegTestWorkerConfig[][] = await Promise.all(
    tests.map((test) => pool.exec('snapshotTestWorker', [test.info /* Dehydrate class -> data */, options], {
      on: (x) => {
        todo.crossOff(x.testName);
        printResults(x);
      },
    })),
  );
  todo.done();
  const testsToRun = flatten(failedTests);

  logger.highlight('\nSnapshot Results: \n');
  printSummary(tests.length, testsToRun.length);
  return testsToRun;
}

export const waitFor = async <T>(
  evaluateResult: () => T | undefined | null,
  {
    timeout,
    checkInterval,
    errorMessage,
  }: { timeout: number; checkInterval: number; errorMessage?: string } = {
    timeout: 10000,
    checkInterval: 50,
  }
): Promise<T> => {
  if (timeout < 0) {
    throw new Error(errorMessage ?? "Waited for condition which never happened");
  }
  const result = evaluateResult();
  if (result) return result;

  await new Promise((resolve) => setTimeout(resolve, checkInterval));

  return waitFor(evaluateResult, {
    timeout: timeout - checkInterval,
    checkInterval,
    errorMessage,
  });
};

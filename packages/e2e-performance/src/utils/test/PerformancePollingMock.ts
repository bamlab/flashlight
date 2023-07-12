export class PerformancePollingMock {
  private cb?: (measure: unknown) => void;

  emit(measure: unknown) {
    this.cb?.(measure);
  }

  setCallback = jest.fn((cb: (measure: unknown) => void) => {
    this.cb = cb;
  });

  isStarted() {
    return !!this.cb;
  }
}

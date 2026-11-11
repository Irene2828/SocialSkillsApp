export const logger = {
  info: (event: string, data?: any) => {
    if (__DEV__) {
      console.info(`[DrawingApp] ${event}`, data ? data : '');
    }
  },
  warn: (event: string, data?: any) => {
    if (__DEV__) {
      console.warn(`[DrawingApp] ${event}`, data ? data : '');
    }
  },
  error: (event: string, error?: any) => {
    if (__DEV__) {
      console.error(`[DrawingApp] ${event}`, error ? error : '');
    }
  }
};

// Minimal internal logger for stability debugging. Do not expose to UI.
export const logger = {
  info: (event: string, data?: any) => {
    if (__DEV__) {
      console.info(`[SocialQuest] ${event}`, data ? data : '');
    }
  },
  warn: (event: string, data?: any) => {
    if (__DEV__) {
      console.warn(`[SocialQuest] ${event}`, data ? data : '');
    }
  },
  error: (event: string, error?: any) => {
    if (__DEV__) {
      console.error(`[SocialQuest] ${event}`, error ? error : '');
    }
  }
};

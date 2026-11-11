export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon?: string;
  isCustom: boolean;
}

export interface UnlockedReward {
  id: string;
  rewardId: string;
  title: string;
  cost: number;
  icon: string;
  timestamp: number;
  isFulfilled: boolean;
}

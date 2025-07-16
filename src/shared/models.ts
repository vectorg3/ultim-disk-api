import { Request } from 'express';

export interface RequestWithUserId extends Request {
      userId: string;
}

export enum TariffPlan {
      default,
      pro,
      ultim
}

export const TariffPlanSpace = new Map<TariffPlan, number>([
      [TariffPlan.default, 5 * 1024 * 1024 * 1024],
      [TariffPlan.default, 10 * 1024 * 1024 * 1024],
      [TariffPlan.default, 15 * 1024 * 1024 * 1024]
]);

import { GroupValidation, FieldGroup, Field } from '@/validator/types';
import {
  bonusType,
  bonusAmount,
  bonusCodes,
  bonusFundsPercent,
  bonusFundsType,
  lockAmountValue,
  minDeposits,
  paymentMethods,
  rewardPointsAmount,
  unplayableThreshold,
} from './validators';

export const bonusValidator: GroupValidation = ({ bonusData, jiraData }) => {
  const bonusGroup: FieldGroup = {
    fieldName: 'Bonus Details',
    passed: true,
    group: [
      bonusType({ bonusData, jiraData }),
      bonusAmount({ bonusData, jiraData }),
      bonusFundsPercent({ bonusData, jiraData }),
      rewardPointsAmount({ bonusData, jiraData }),
      bonusFundsType({ bonusData, jiraData }),
      bonusCodes({ bonusData, jiraData }),
      lockAmountValue({ bonusData, jiraData }),
      minDeposits({ bonusData, jiraData }),
      unplayableThreshold({ bonusData, jiraData }),
      paymentMethods({ bonusData, jiraData }),
    ],
  };
  bonusGroup.group = bonusGroup.group.filter(
    (field): field is Field => !!field,
  );
  bonusGroup.passed = bonusGroup.group.every((field) => field!.passed);
  return bonusGroup;
};

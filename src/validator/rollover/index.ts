import { GroupValidation, FieldGroup, Field } from '@/validator/types';
import {
  casinoRollover,
  horsesRollover,
  pokerRollover,
  rolloverBase,
  sportsRollover,
} from './validators';

export const rolloverValidator: GroupValidation = ({ bonusData, jiraData }) => {
  
  if (!(bonusData.bonusFundsMax || jiraData?.hasBonusReward)) return null;

  const rolloverGroup: FieldGroup = {
    fieldName: 'Rollover',
    passed: true,
    group: [
      casinoRollover({ bonusData, jiraData }),
      pokerRollover({ bonusData, jiraData }),
      sportsRollover({ bonusData, jiraData }),
      horsesRollover({ bonusData, jiraData }),
      rolloverBase({ bonusData, jiraData }),
    ],
  };
  rolloverGroup.group = rolloverGroup.group.filter(
    (field): field is Field => !!field,
  );
  rolloverGroup.passed = rolloverGroup.group.every((field) => field!.passed);
  return rolloverGroup;
};

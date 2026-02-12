import { GroupValidation, FieldGroup, Field } from '@/validator/types';
import {
  freeGamesPayout,
  freeGamesWinningsId,
  freeGameName,
  maxCashout,
  numberOfSpins,
  valuePerSpin,
} from './validators';

export const freeGamesValidator: GroupValidation = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}) => {
  if (!jiraData.hasFreeGameReward && !freeGamesWinningsData) return null;
  const freeGamesGroup: FieldGroup = {
    fieldName: 'Free Games',
    passed: true,
    group: [
      freeGamesWinningsId({ bonusData, jiraData, freeGamesWinningsData: freeGamesWinningsData ?? null }),
      freeGameName({ bonusData, jiraData }),
      numberOfSpins({ bonusData, jiraData }),
      valuePerSpin({ bonusData, jiraData }),
      freeGamesPayout({ bonusData, jiraData }),
      maxCashout({ bonusData, jiraData }),
    ],
  };
  freeGamesGroup.group = freeGamesGroup.group.filter(
    (field): field is Field => !!field,
  );
  freeGamesGroup.passed = freeGamesGroup.group.every((field) => field!.passed);

  return freeGamesGroup;
};

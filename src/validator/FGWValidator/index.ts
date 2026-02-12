import { GroupValidation, FieldGroup, Field } from '@/validator/types';

import {
  casinoRollover,
  horsesRollover,
  pokerRollover,
  rolloverBase,
  sportsRollover,
} from '../rollover/validators';
import { freeSpinsExpiration } from './validators';

export const FGWValidator: GroupValidation = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}) => {

  if (!jiraData.hasFreeGameReward && !freeGamesWinningsData) return null;
  const freeGamesGroup: FieldGroup = {
    fieldName: 'Free Games Winnings',
    passed: true,
    group: [
      freeSpinsExpiration({ bonusData, jiraData, freeGamesWinningsData: freeGamesWinningsData }),
      casinoRollover({
        bonusData: freeGamesWinningsData,
        jiraData,
        freeGamesWinningsData,
      }),
      pokerRollover({
        bonusData: freeGamesWinningsData,
        jiraData,
        freeGamesWinningsData,
      }),
      sportsRollover({
        bonusData: freeGamesWinningsData,
        jiraData,
        freeGamesWinningsData,
      }),
      horsesRollover({
        bonusData: freeGamesWinningsData,
        jiraData,
        freeGamesWinningsData,
      }),
      // rolloverBase({
      //   bonusData: freeGamesWinningsData,
      //   jiraData,
      //   freeGamesWinningsData,
      // }),
    ],
  };
  freeGamesGroup.group = freeGamesGroup.group.filter(
    (field): field is Field => !!field,
  );
  freeGamesGroup.passed = freeGamesGroup.group.every((field) => field!.passed);

  return freeGamesGroup;
};

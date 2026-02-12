import { extractNumber } from '@/utils/custom';
import { FieldValidation } from '@/validator/types';
import _ from 'lodash';
import moment from 'moment';

export const freeSpinsExpiration: FieldValidation = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}) => {
  if (!freeGamesWinningsData)
    return {
      fieldName: 'Free Spins Expiration',
      rmValue: 'Free Games Winnings URL not found',
      jiraValue: jiraData.freeSpinsExpiration,
      passed: false,
    };
  const jiraValue = moment
    .duration(extractNumber(jiraData.freeSpinsExpiration), 'days')
    .asDays();
  const FGWValue = moment
    .duration(freeGamesWinningsData.expiresInDays, 'days')
    .asDays();
  return {
    fieldName: 'Free Spins Expiration',
    rmValue: freeGamesWinningsData.expiresInDays,
    jiraValue: jiraData.freeSpinsExpiration || 'None',
    passed: FGWValue === jiraValue,
    canBeIgnored: true
  };
};

import { extractNumber } from '@/utils/custom';
import { FieldValidation } from '@/validator/types';
import _ from 'lodash';

export const freeGameName: FieldValidation = ({ bonusData, jiraData }) => {
  if (!(jiraData?.gameName || bonusData?.gameName)) return null;
  return {
    fieldName: 'Game Name',
    rmValue: bonusData.gameName || 'None',
    jiraValue: jiraData.gameName || 'None',
    passed: _.includes(bonusData.gameName, jiraData.gameName),
    canBeIgnored: true
  };
};

export const numberOfSpins: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Number Of Spins',
    rmValue: bonusData.numberOfSpins,
    jiraValue: jiraData.numberOfSpins || 'None',
    passed: bonusData.numberOfSpins === jiraData.numberOfSpins,
  };
};

export const valuePerSpin: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Value Per Spin',
    rmValue: bonusData.valuePerSpin,
    jiraValue: jiraData.valuePerSpin,
    passed: bonusData.valuePerSpin === jiraData.valuePerSpin,
    canBeIgnored: true
  };
};

export const freeGamesPayout: FieldValidation = ({ bonusData, jiraData }) => {
  const jiraValue = _.toUpper(jiraData.freeGamesPayout);
  const bonusValue = _.toUpper(bonusData.freeGamesPayout);
  return {
    fieldName: 'Payout',
    rmValue: bonusData.freeGamesPayout,
    jiraValue: jiraData.freeGamesPayout || 'None',
    passed: _.includes(jiraValue, bonusValue),
    canBeIgnored: true
  };
};

export const maxCashout: FieldValidation = ({ bonusData, jiraData }) => {
  const jiraValue = extractNumber(jiraData.maxCashout.replace(/,/g, ''));
  const currency = _.find(['USD', 'CAD', 'BTC', 'AUD'], (currency) =>
    _.get(bonusData, `maxCashout.${currency}`),
  ) as string;
  const bonusValue = extractNumber(bonusData.maxCashout[currency]);
  return {
    fieldName: 'Max Cashout',
    rmValue: bonusData.maxCashout[currency],
    jiraValue: jiraData.maxCashout || 'N/A',
    passed: bonusValue === jiraValue,
    canBeIgnored: true
  };
};

export const freeGamesWinningsId: FieldValidation = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}) => {
  if (!freeGamesWinningsData)
    return {
      fieldName: 'Free Games Winnings ID',
      rmValue: bonusData.freeWinningsId,
      jiraValue: 'Free Games Winnings URL not found',
      passed: false,
    };
  return {
    fieldName: 'Free Games Winnings ID',
    rmValue: bonusData.freeWinningsId,
    jiraValue: freeGamesWinningsData.id,
    passed: freeGamesWinningsData.id === bonusData.freeWinningsId,
    canBeIgnored: true
  };
};

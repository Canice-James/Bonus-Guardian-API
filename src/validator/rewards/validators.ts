import { extractGiftName, extractCancellationWindow } from '@/utils/custom';
import { FieldValidation } from '@/validator/types';

export const bonusReward: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Bonus Reward',
    rmValue: bonusData?.bonusFundsMax ? 'Yes' : 'No',
    jiraValue: jiraData?.hasBonusReward ? 'Yes' : 'No',
    passed: jiraData?.hasBonusReward
      ? bonusData?.bonusFundsMax
        ? true
        : false
      : true,
    canBeIgnored: true
  };
};

export const cashReward: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Cash Reward',
    rmValue: bonusData?.cashFundsMax ? 'Yes' : 'No',
    jiraValue: jiraData?.hasCashReward ? 'Yes' : 'No',
    passed: jiraData?.hasCashReward
      ? bonusData?.cashFundsMax
        ? true
        : false
      : true,
    canBeIgnored: true
  };
};

export const freeGameReward: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Free Game Reward',
    rmValue: bonusData?.freeGamesName ? 'Yes' : 'No',
    jiraValue: jiraData?.hasFreeGameReward ? 'Yes' : 'No',
    passed: jiraData?.hasFreeGameReward
      ? bonusData?.freeGamesWinningsName
        ? true
        : false
      : true,
    canBeIgnored: true
  };
};

export const rewardPoints: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Reward Points',
    rmValue: bonusData?.rewardPoints ? 'Yes' : 'No',
    jiraValue: jiraData?.hasRewardPointsReward ? 'Yes' : 'No',
    passed: jiraData?.hasRewardPointsReward
      ? bonusData?.rewardPoints
        ? true
        : false
      : true,
    canBeIgnored: true
  };
};

export const tournamentTicketReward: FieldValidation = ({
  bonusData,
  jiraData,
}) => {
  return {
    fieldName: 'Tournament Ticket Reward',
    rmValue: bonusData?.tournamentTicketId ? 'Yes' : 'No',
    jiraValue: jiraData?.hasTournamentTicketReward ? 'Yes' : 'No',
    passed: jiraData?.hasTournamentTicketReward
      ? bonusData?.tournamentTicketId
        ? true
        : false
      : true,
    canBeIgnored: true
  };
};

export const tangibleRewards: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Tangible Rewards',
    rmValue: bonusData?.tangibleRewardEnabled ? 'Yes' : 'No',
    jiraValue: jiraData?.hasOtherReward ? 'Yes' : 'No',
    passed:
      (jiraData?.hasOtherReward && bonusData?.tangibleRewardEnabled) ||
      (!jiraData?.hasOtherReward && !bonusData?.tangibleRewardEnabled),
    canBeIgnored: true
  };
};

export const giftName: FieldValidation = ({ bonusData, jiraData }) => {
  if (!jiraData?.hasOtherReward) return null;
  return {
    fieldName: 'Gift Name',
    rmValue: bonusData?.name,
    // Fix scaicedo extractGiftName may return null so a default value is needed
    jiraValue: extractGiftName(jiraData?.description) || 'Null',
    passed:
      extractGiftName(jiraData?.description)?.toLowerCase() ===
      bonusData?.name?.toLowerCase(),
    canBeIgnored: true
  };
};

export const cancellationWindow: FieldValidation = ({
  bonusData,
  jiraData,
}) => {
  if (!jiraData?.hasOtherReward) return null;
  return {
    fieldName: 'Cancellation Window',
    rmValue: bonusData?.tangibleRewardcancellationPeriod / 3600 + ' hours',
    // Scaicedo extractCancellationWindow returns null so we need a fallback value
    jiraValue: extractCancellationWindow(jiraData?.description)
      ? extractCancellationWindow(jiraData?.description)! / 3600 + ' hours'
      : 'Default',
    passed:
      bonusData?.tangibleRewardcancellationPeriod ===
      extractCancellationWindow(jiraData?.description),
    canBeIgnored: true
  };
};

import { getValue, validateRolloverBase } from '@/utils/custom';
import { FieldValidationInput, FieldValidationOutput } from '@/validator/types';

export const casinoRollover = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}: Partial<FieldValidationInput>): FieldValidationOutput => {
  if (!bonusData?.casinoRollover && !jiraData?.casinoRollover) return null;

  const fieldName = freeGamesWinningsData
    ? 'FGW Casino Rollover'
    : 'Casino Rollover';

  return {
    fieldName,
    rmValue: bonusData?.casinoRollover ?? 'No',
    jiraValue: String(getValue(freeGamesWinningsData, jiraData?.fsCasinoRollover, jiraData?.casinoRollover) ?? 'No'),
    passed:
      Number(getValue(freeGamesWinningsData, jiraData?.fsCasinoRollover, jiraData?.casinoRollover) ?? null) ===
        Number(bonusData?.casinoRollover ?? null) ||
      Number(getValue(freeGamesWinningsData, jiraData?.fsCasinoRollover, jiraData?.casinoRollover) ?? null) === 0 &&
        Number(bonusData?.casinoRollover ?? null) === 1,
    canBeIgnored: true
  };
};
export const pokerRollover = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}: Partial<FieldValidationInput>): FieldValidationOutput => {
  if (!bonusData?.pokerRollover && !jiraData?.pokerRollover) return null;

  const fieldName = freeGamesWinningsData
    ? 'FGW Poker Rollover'
    : 'Poker Rollover';

  return {
    fieldName,
    rmValue: bonusData?.pokerRollover ?? 'No',
    jiraValue: String(getValue(freeGamesWinningsData, jiraData?.fsPokerRollover, jiraData?.pokerRollover) ?? 'No'),
    passed:
      Number( getValue(freeGamesWinningsData, jiraData?.fsPokerRollover, jiraData?.pokerRollover) ?? null) ===
      Number( getValue(freeGamesWinningsData, jiraData?.fsPokerRollover, bonusData?.pokerRollover) ?? null),
    canBeIgnored: true
  };
};
export const sportsRollover = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}: Partial<FieldValidationInput>): FieldValidationOutput => {
  if (!bonusData?.sportsRollover && !jiraData?.sportsRollover) return null;

  const fieldName = freeGamesWinningsData
    ? 'FGW Sports Rollover'
    : 'Sports Rollover';

  return {
    fieldName,
    rmValue: bonusData?.sportsRollover ?? 'No',
    jiraValue: String(getValue(freeGamesWinningsData, jiraData?.fsSportsRollover, jiraData?.sportsRollover) ?? 'No'),
    passed: Number(getValue(freeGamesWinningsData, jiraData?.fsSportsRollover, jiraData?.sportsRollover) ?? null)
      ? Number(getValue(freeGamesWinningsData, jiraData?.fsSportsRollover, jiraData?.sportsRollover) ?? null) ===
        Number(bonusData?.sportsRollover ?? null)
      : Number(bonusData?.sportsRollover ?? null) === 5 ||
        bonusData?.sportsRollover == null,
    canBeIgnored: true
  };
};
export const horsesRollover = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}: Partial<FieldValidationInput>): FieldValidationOutput => {
  if (!bonusData?.horsesRollover && !jiraData?.horsesRollover) return null;

  const fieldName = freeGamesWinningsData
    ? 'FGW Horses Rollover'
    : 'Horses Rollover';

  return {
    fieldName,
    rmValue: bonusData?.horsesRollover ?? 'No',
    jiraValue: String(getValue(freeGamesWinningsData, jiraData?.fsHorsesRollover, jiraData?.horsesRollover) ?? 'No'),
    passed: Number(getValue(freeGamesWinningsData, jiraData?.fsHorsesRollover, jiraData?.horsesRollover) ?? null)
      ? Number(getValue(freeGamesWinningsData, jiraData?.fsHorsesRollover, jiraData?.horsesRollover) ?? null) ===
        Number(bonusData?.horsesRollover ?? null)
      : Number(bonusData?.horsesRollover ?? null) === 5 ||
        bonusData?.horsesRollover == null,
    canBeIgnored: true
  };
};
export const rolloverBase = ({
  bonusData,
  jiraData,
  freeGamesWinningsData,
}: Partial<FieldValidationInput>): FieldValidationOutput => {
  const fieldName = freeGamesWinningsData
    ? 'FGW Rollover Base'
    : 'Rollover Base';

  return {
    fieldName,
    rmValue: bonusData?.rolloverBase ?? 'No',
    jiraValue: jiraData?.rolloverBase ?? 'No',
    passed: validateRolloverBase(
      jiraData?.rolloverBase,
      bonusData?.rolloverBase,
    ),
    canBeIgnored: true
  };
};

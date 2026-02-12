import { PAYMENT_METHODS } from '@/mapping/payment-methods-mapping';
import { validateArray, extractBonusAmount, canUseDeposits, extractNumber, removeEmptyItems, sameMembers, validateBonusType, validateLockAmount, validateMinDeposit } from '@/utils/custom';
import { FieldValidation } from '@/validator/types';
import _, { isEmpty } from 'lodash';

export const bonusType: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Bonus Type',
    rmValue: bonusData?.type,
    jiraValue: jiraData?.type,
    passed: validateBonusType(jiraData?.type, bonusData?.type),
  };
};

export const bonusAmount: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Bonus Amount',
    rmValue: bonusData?.bonusFundsMax ?? 'None',
    jiraValue: jiraData?.bonusAmount ?? 'None',
    passed:
      Number(
        extractBonusAmount(String(jiraData?.bonusAmount) ?? null),
      ) === Number(bonusData?.bonusFundsMax ?? null),
    canBeIgnored:  bonusData.type === 'CUSTOMER_SERVICE' ? true : false
  };
};

export const bonusFundsPercent: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Bonus Funds Percent',
    rmValue: bonusData?.bonusFundsPercent * 100 + '%',
    jiraValue: jiraData?.bonusAmount,
    passed:
      Number(
        String(jiraData?.bonusAmount)?.match(/(\d+)(?=\s+[%]|[%])/g)?.[0] ??
          null,
      ) ===
      Number(bonusData?.bonusFundsPercent ?? null) * 100,
  };
};

export const rewardPointsAmount: FieldValidation = ({
  bonusData,
  jiraData,
}) => {
  if (!jiraData.hasRewardPointsReward) return null;
  return {
    fieldName: 'Reward Points Amount',
    rmValue: bonusData?.rewardPoints ?? 'No',
    jiraValue: jiraData?.bonusAmount,
    passed:
      extractNumber(jiraData?.bonusAmount) ===
      extractNumber(bonusData?.rewardPoints),
    canBeIgnored: true
  };
};

export const bonusFundsType: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Bonus Funds Type',
    rmValue:
      (bonusData?.bonusFundsType ?? bonusData?.bonusFundsMax)
        ? 'None'
        : 'No Bonus Reward Selected',
    jiraValue: jiraData?.bonusFundsType,
    passed:
      bonusData?.bonusFundsType?.toUpperCase() ===
        jiraData?.bonusFundsType?.toUpperCase() ||
      (bonusData?.bonusFundsType?.toUpperCase()
        ? false
        : jiraData?.bonusFundsType?.toUpperCase() === 'FIXED'),
  };
};

export const bonusCodes: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Bonus Codes',
    rmValue: bonusData?.bonusCodes.join(', ') || 'None',
    jiraValue:
      removeEmptyItems(jiraData?.bonusCodes).length > 0
        ? removeEmptyItems(jiraData?.bonusCodes).join(', ')
        : 'None',
    passed: sameMembers(
      bonusData?.bonusCodes,
      removeEmptyItems(jiraData?.bonusCodes),
    ),
    canBeIgnored: true
  };
};

export const lockAmountValue: FieldValidation = ({ bonusData, jiraData }) => {
  
  if (!(jiraData?.hasBonusReward || bonusData?.lockAmountValue)) return null;
  
  return {
    fieldName: 'Lock Amount Value',
    rmValue: bonusData?.lockAmountValue ? 'Locked' : 'Not Locked',
    jiraValue: canUseDeposits(jiraData?.type, bonusData)
      ? 'Locked'
      : "Can't be Locked",
    passed: validateLockAmount(jiraData, bonusData),
  };
};

export const minDeposits: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Min Deposit',
    rmValue: canUseDeposits(jiraData?.type, bonusData)
      ? bonusData?.minDeposit
      : "Bonus type can't use deposits",
    jiraValue: jiraData?.minDeposit,
    // Fix scaicedo this takes the entire object not only the string
    passed: validateMinDeposit(jiraData?.minDeposit, bonusData?.minDeposit),
    canBeIgnored: true
  };
};

export const unplayableThreshold: FieldValidation = ({
  bonusData,
  jiraData,
}) => {

  if (!isEmpty(bonusData?.unplayableThreshold)) return null;

  return {
    fieldName: 'Unplayable Threshold',
    rmValue:
      Object.keys(bonusData?.unplayableThreshold)?.length !== 0
        ? 'Yes'
        : 'None',
    jiraValue: "Not supported by RUNA",
    passed: bonusData?.unplayableThreshold
      ? Object.keys(bonusData?.unplayableThreshold)?.length === 0
      : true,

  };
};

export const paymentMethods: FieldValidation = ({ bonusData, jiraData }) => {
  if (!canUseDeposits(jiraData?.type, bonusData)) return null;
  let jiraValue = jiraData?.paymentMethods
    ?.map((pm: string) => _.invert(PAYMENT_METHODS)[pm])
    ?.sort() as string[] | undefined;
  let bonusValue = bonusData?.paymentMethods?.sort() as string[] | undefined;

  jiraValue = jiraValue?.filter((i)=> i !== undefined && i !== null);
  bonusValue = bonusValue?.filter((i)=> i !== undefined && i !== null)

  return {
    fieldName: 'Payment Methods',
    rmValue: bonusValue?.join(', ') || 'None',
    jiraValue: jiraValue?.join(', ') || 'None',
    passed: validateArray<String>(bonusValue, jiraValue),
    canBeIgnored: true
  };
};

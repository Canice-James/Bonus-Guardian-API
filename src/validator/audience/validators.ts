import { extractBonusTeirNames, extractTierName, validateTargetType, validateTierPoints } from '@/utils/custom';
import { FieldValidation } from '@/validator/types';

export const audienceDistributionType: FieldValidation = ({
  bonusData,
  jiraData,
}) => {

  return {
    fieldName: 'Audience Distribution Type',
    rmValue: (bonusData?.targeted || bonusData?.hasPointsPriceByTier ) ? 'TARGETED' : 'MASS',
    jiraValue: jiraData?.audience,
    passed: validateTargetType(jiraData?.audience, bonusData),
    canBeIgnored: bonusData.internalStatus === 'draft' ? true : false
  };
};

export const tierPoints: FieldValidation = ({ bonusData, jiraData }) => {
  const bonusTierNames = extractBonusTeirNames(bonusData?.pointsPriceByTeir);
  const jiraTierNames = extractTierName(jiraData?.description);

  if (!jiraTierNames?.length && !bonusTierNames?.length) return null;

  return {
    fieldName: 'Tier points',
    rmValue: bonusTierNames?.length ? bonusTierNames.join(', ') : 'No',
    jiraValue: jiraTierNames?.length
      ? jiraTierNames?.map((i) => i.name)?.join(', ')
      : 'No',
    passed: validateTierPoints(
      extractTierName(jiraData?.description)?.filter((item) => item.value !== null) as { name: string; value: number }[],
      bonusData?.pointsPriceByTeir,
    ),
    canBeIgnored: true
  };
};

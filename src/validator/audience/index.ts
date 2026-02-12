import { GroupValidation, FieldGroup, Field } from '@/validator/types';
import { audienceDistributionType, tierPoints } from './validators';
import { BONUS_TYPE } from '@/mapping/bonus-type-mapping';

export const audienceValidator: GroupValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === BONUS_TYPE.CUSTOMER_SERVICE) return null;

  const audienceGroup: FieldGroup = {
    fieldName: 'Target Audience',
    passed: true,
    group: [
      audienceDistributionType({ bonusData, jiraData }),
      tierPoints({ bonusData, jiraData }),
    ],
  };
  audienceGroup.group = audienceGroup.group.filter(
    (field): field is Field => !!field,
  );
  audienceGroup.passed = audienceGroup.group.every((field) => field!.passed);
  return audienceGroup;
};

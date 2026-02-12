import { GroupValidation, FieldGroup, Field } from '@/validator/types';
import {
  endDate,
  expiresInDays,
  maxDaysAvailable,
  recurrenceEndTime,
  recurrencePeriod,
  recurrenceStartTime,
  startDate,
  startTime,
} from './validators';

export const datesValidator: GroupValidation = ({ bonusData, jiraData }) => {
  const datesGroup: FieldGroup = {
    fieldName: 'Dates & Times',
    passed: true,
    group: [
      startDate({ bonusData, jiraData }),
      endDate({ bonusData, jiraData }),
      startTime({ bonusData, jiraData }),
      expiresInDays({ bonusData, jiraData }),
      maxDaysAvailable({ bonusData, jiraData }),
      recurrencePeriod({ bonusData, jiraData }),
      recurrenceStartTime({ bonusData, jiraData }),
      recurrenceEndTime({ bonusData, jiraData }),
    ],
  };
  datesGroup.group = datesGroup.group.filter(
    (field): field is Field => !!field,
  );
  datesGroup.passed = datesGroup.group.every((field) => field!.passed);

  return datesGroup;
};

import {
  convertTo24HourFormat,
  defaultEndTime,
  defaultStartTime,
  getESTString,
  getETDate,
  getETTime,
  validateEndDate,
  validateRecurrenceEndTime,
  validateRecurrenceStartTime,
  validateRecurrenceType,
  validateStartTime,
  parseNY,
  parseJiraDT,
} from '@/utils/custom';

import { FieldValidation } from '@/validator/types';

export const startDate: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  const rmDate = bonusData?.startDateTime
    ? getETDate(bonusData.startDateTime)
    : null;

  return {
    fieldName: 'Start Date',
    rmValue: rmDate ?? 'No',
    jiraValue: jiraData?.startDate ?? 'No',
    passed:
      (!jiraData?.startDate && !rmDate) ||
      jiraData?.startDate === rmDate,
    canBeIgnored: true
  };
};

export const endDate: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  const rmDate = bonusData?.endDateTime
    ? getETDate(bonusData.endDateTime)
    : null;

  return {
    fieldName: 'End Date',
    rmValue: rmDate ?? 'No',
    jiraValue: jiraData?.endDate ?? 'No',
    passed:
      (!jiraData?.endDate && !rmDate) ||
      jiraData?.endDate === rmDate,
  };
};

export const startTime: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  const rmMoment = bonusData?.startDateTime
    ? parseNY(bonusData.startDateTime)
    : null;

  const rmRaw = rmMoment ? rmMoment.format('HH:mm:ss') : null;
  const rmDisplay = rmMoment ? rmMoment.format('hh:mm A') : null;

  const jiraParsed = parseJiraDT(jiraData?.startTime);

  const jiraRaw = jiraParsed
    ? jiraParsed.format('HH:mm:ss')
    : defaultStartTime;

  return {
    fieldName: 'Start Time',
    rmValue: rmDisplay ?? 'No',
    jiraValue: jiraParsed ? jiraParsed.format('hh:mm A') : 'Default',
    passed: rmRaw !== null && validateStartTime(
      convertTo24HourFormat(jiraRaw),
      convertTo24HourFormat(rmRaw),
      bonusData.currency,
    ),
    canBeIgnored: true
  };
};

export const endTime: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  const rmMoment = bonusData?.endDateTime
    ? parseNY(bonusData.endDateTime)
    : null;

  const rmRaw = rmMoment ? rmMoment.format('HH:mm:ss') : null;
  const rmDisplay = rmMoment ? rmMoment.format('hh:mm A') : null;

  const jiraParsed = parseJiraDT(jiraData?.endTime);

  const jiraRaw = jiraParsed
    ? jiraParsed.format('HH:mm:ss')
    : defaultEndTime;

  return {
    fieldName: 'End Time',
    rmValue: rmDisplay ?? 'No',
    jiraValue: jiraParsed ? jiraParsed.format('hh:mm A') : 'Default',
    passed: rmRaw !== null && jiraRaw === rmRaw,
    canBeIgnored: true,
  };
};

export const expiresInDays: FieldValidation = ({ bonusData, jiraData }) => {
  return {
    fieldName: 'Expires In Days',
    rmValue: bonusData?.expiresInDays,
    jiraValue: jiraData?.expiresInDays,
    passed:
      Number(jiraData?.expiresInDays?.match(/\d+/)?.[0] ?? null) ===
      Number(bonusData?.expiresInDays ?? null),
    canBeIgnored: true
  };
};

export const maxDaysAvailable: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  if (!bonusData?.maxDaysAvailable && !jiraData?.maxDaysAvailable) return null;

  return {
    fieldName: 'Max Days Available',
    rmValue: bonusData?.targeted
      ? bonusData?.maxDaysAvailable
      : 'Not set',
    jiraValue: jiraData?.maxDaysAvailable ?? "None",
    passed:
      Number(jiraData?.maxDaysAvailable?.match(/\d+/)?.[0] ?? null) ===
      Number(bonusData?.maxDaysAvailable ?? null),
    canBeIgnored: true
  };
};

export const recurrencePeriod: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  if ((!bonusData?.recurrencePeriod || !jiraData?.recurrencePeriod) &&
    jiraData?.recurrencePeriod !== 'No Recurrence') {
    return null;
  }

  return {
    fieldName: 'Recurrence Period',
    rmValue: bonusData?.recurrencePeriod ?? 'No',
    jiraValue:
      jiraData?.recurrencePeriod === 'No Recurrence'
        ? 'No'
        : (jiraData?.recurrencePeriod ?? 'No'),
    passed: validateRecurrenceType(
      jiraData?.recurrencePeriod ,
      bonusData?.recurrencePeriod ?? 'No Recurrence',
    ),
    canBeIgnored: true
  };
};

export const recurrenceStartTime: FieldValidation = ({
  bonusData,
  jiraData,
}) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  if (
    !jiraData?.recurrencePeriod ||
    jiraData?.recurrencePeriod === 'No Recurrence'
  )
    return null;

  const jiraTime = convertTo24HourFormat(
    jiraData?.startTime
      ? parseJiraDT(jiraData.startTime)?.format('HH:mm:ss') ??
          defaultStartTime
      : defaultStartTime,
  );

  return {
    fieldName: 'Recurrence Start Time',
    rmValue: bonusData?.recurrenceStartTime ?? 'No',
    jiraValue: jiraTime ?? 'No',
    passed: validateRecurrenceStartTime(
      jiraTime,
      bonusData?.recurrenceStartTime,
    ),
    canBeIgnored: true
  };
};

export const recurrenceEndTime: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  if (
    !jiraData?.recurrencePeriod ||
    jiraData?.recurrencePeriod === 'No Recurrence'
  )
    return null;

  const jiraTime = convertTo24HourFormat(
    jiraData?.endTime
      ? parseJiraDT(jiraData.endTime)?.format('HH:mm:ss') ??
          defaultEndTime
      : defaultEndTime,
  );

  return {
    fieldName: 'Recurrence End Time',
    rmValue: bonusData?.recurrenceEndTime ?? 'No',
    jiraValue: jiraTime ?? 'No',
    passed: validateRecurrenceEndTime(
      jiraTime,
      bonusData?.recurrenceEndTime,
    ),
    canBeIgnored: true
  };
};

import { convertTo24HourFormat, defaultEndTime, defaultStartTime, getESTString, getETDate, getETTime, validateEndDate, validateRecurrenceEndTime, validateRecurrenceStartTime, validateRecurrenceType, validateStartTime } from '@/utils/custom';
import { FieldValidation } from '@/validator/types';

export const startDate: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  return {
    fieldName: 'Start Date',
    rmValue: getETDate(new Date(bonusData?.startDateTime)),
    jiraValue: jiraData?.startDate,
    passed:
      jiraData?.startDate ===
      getETDate(new Date(bonusData?.startDateTime)),
    canBeIgnored: true
  };
};

export const endDate: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  return {
    fieldName: 'End Date',
    rmValue: bonusData?.endDateTime
      ? getESTString(new Date(bonusData?.endDateTime))
      : 'No',
    jiraValue: jiraData?.endDate ?? 'No',
    passed: validateEndDate(jiraData?.endDate, bonusData?.endDateTime),
  };
};

export const startTime: FieldValidation = ({ bonusData, jiraData }) => {

  if (bonusData.type === 'CUSTOMER_SERVICE') return null;

  return {
    fieldName: 'Start Time',
    rmValue: bonusData?.startDateTime
      ? getETTime(new Date(bonusData?.startDateTime))?.match(
          /(\d{1,2}:\d{2}:\d{2})/,
        )?.[1] || 'No'
      : 'No',
    jiraValue: jiraData?.startTime
      ? getESTString(new Date(jiraData?.startTime)).match(
          /(\d{1,2}:\d{2}:\d{2})/,
        )?.[1] || 'Default'
      : 'Default',
    passed: validateStartTime(
      convertTo24HourFormat(
        jiraData?.startTime
          ? jiraData.startTime.match(/T(\d{2}:\d{2}:\d{2})/)?.[1]
          : null,
      ),
      convertTo24HourFormat(
        getETTime(new Date(bonusData?.startDateTime))?.match(
          /(\d{1,2}:\d{2}:\d{2})/,
        )?.[1],
      ),
      bonusData.currency,
    ),
    canBeIgnored: true
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
  return {
    fieldName: 'Recurrence Start Time',
    rmValue: bonusData?.recurrenceStartTime ?? 'No',
    jiraValue: jiraData?.recurrencePeriod
      ? convertTo24HourFormat(
          jiraData?.startTime
            ? (jiraData.startTime.match(/T(\d{2}:\d{2}:\d{2})/)?.[1] ??
                defaultStartTime)
            : defaultStartTime,
        ) || 'No'
      : 'No',
    passed: jiraData?.recurrencePeriod
      ? validateRecurrenceStartTime(
          convertTo24HourFormat(
            jiraData?.startTime
              ? (jiraData.startTime.match(/T(\d{2}:\d{2}:\d{2})/)?.[1] ??
                  defaultStartTime)
              : defaultStartTime,
          ),
          bonusData?.recurrenceStartTime,
        )
      : true,
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
  return {
    fieldName: 'Recurrence End Time',
    rmValue: bonusData?.recurrenceEndTime ?? 'No',
    jiraValue: jiraData?.recurrencePeriod
      ? convertTo24HourFormat(
          jiraData?.endTime
            ? (jiraData.endTime.match(/T(\d{2}:\d{2}:\d{2})/)?.[1] ??
                defaultEndTime)
            : defaultEndTime,
        ) || 'No'
      : 'No',
    passed: jiraData?.recurrencePeriod
      ? validateRecurrenceEndTime(
          convertTo24HourFormat(
            jiraData?.endTime
              ? (jiraData.endTime.match(/T(\d{2}:\d{2}:\d{2})/)?.[1] ??
                  defaultEndTime)
              : defaultEndTime,
          ),
          bonusData?.recurrenceEndTime,
        )
      : true,
    canBeIgnored: true
  };
};

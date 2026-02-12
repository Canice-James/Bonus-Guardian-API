import { BONUS_TYPE_TO_JIRA } from '@/mapping/bonus-type-mapping';
import { TEIR_ID_MAPPING } from '@/mapping/tier-id-mapping';
import { TgetBonusFields, TgetJiraFields } from './data-mapping';
import _ from 'lodash';
import moment from 'moment-timezone';

// Determine overall passed status based on all groups

export function validateArray<T>(
  arr: T[] | undefined,
  target: T[] | undefined,
): boolean {
  if (!Array.isArray(arr) || !Array.isArray(target)) return false;
  // if (arr === undefined && target === undefined) return true;
  return arr.length === target.length && _.isEmpty(_.xor(arr, target));
}

function newESTDate(date: Date) {
  date = new Date(date);
  let timezoneOffset = date.getTimezoneOffset();
  let pstOffset = -240; // this is the offset for the EST timezone
  let adjustedTime = new Date(
    (date.getTime() - (pstOffset + timezoneOffset)) * 60 * 1000,
  );

  return adjustedTime;
}

function getESTDateString(date: Date) {
  // display the date and time in EST timezone
  let options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Canada/Eastern',
  };
  let estDateTime = date.toLocaleDateString('en-US', options);
  return estDateTime;
}

export function getESTString(date: Date) {
  let estDateTime = date?.toLocaleString('en-US', {
    timeZone: 'Canada/Eastern',
    hour12: false,
  });
  return estDateTime;
}

export function getETTime(date: Date,) {
  let easternTime = moment.utc(date).tz('America/New_York');

  if (!easternTime.isDST()) {
    easternTime = easternTime.add(1, 'hour');
  }
  // Format the output
  const formattedTime = easternTime.format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

  return formattedTime;
}

export function getETDate(date: Date) {
  let easternTime = moment.utc(date).tz('America/New_York');

  if (!easternTime.isDST()) {
    easternTime = easternTime.add(1, 'hour');
  }
  // Format the output
  const formattedTime = easternTime.format('YYYY-MM-DD');

  return formattedTime;
}

export function canUseDeposits(
  jiraBonusType: string,
  bonusData: TgetBonusFields,
) {
  let bonusType = jiraBonusType;
  let allowedTypes = [
    BONUS_TYPE_TO_JIRA.FIRST_TIME_DEPOSIT,
    BONUS_TYPE_TO_JIRA.RELOAD,
    BONUS_TYPE_TO_JIRA.SINGLE_GOAL,
    BONUS_TYPE_TO_JIRA.AFF_DEPOSIT,
    BONUS_TYPE_TO_JIRA.TIER_RELOAD_PURCHASABLE,
  ];

  if (bonusType == BONUS_TYPE_TO_JIRA.AFF_DEPOSIT) {
    if (
      // Fix scaicedo (lockAmount is not in the mapping)
      // !bonusData?.lockAmount &&
      !bonusData?.minDeposit &&
      !bonusData?.minDepositType &&
      !bonusData?.paymentMethods
    ) {
      return false;
    }
  }
  return allowedTypes.includes(bonusType);
}

export function validateLockAmount(
  jiraData: TgetJiraFields,
  bonusData: TgetBonusFields,
) {
  if (canUseDeposits(jiraData?.type, bonusData)) {
    return jiraData?.bonusAmount
      ? bonusData?.lockAmountValue
        ? true
        : false
      : true;
  } else {
    return bonusData?.lockAmountValue ? false : true;
  }
}

export function validateStartTime(
  jiraTime: string | undefined,
  bonusTime: string | undefined,
  currency: TgetBonusFields['currency'],
) {
  if (jiraTime) return jiraTime === bonusTime;
  else if (currency === 'AUD') {
    return bonusTime === '18:00:00';
  } else {
    return bonusTime === '10:00:00';
  }
}

export function validateEndDate(jiraData: Date, bonus: Date) {
  let bonusDate = bonus ? Date.parse(String(new Date(bonus))) : null;
  let jiraDate = jiraData ? Date.parse(String(new Date(bonus))) : null;
  let bonusTime = bonus
    ? getESTString(new Date(bonus))?.substring(12, 20)
    : null;

  let dateComparison = bonusDate == jiraDate;
  // let timeComparison = bonusTime == '11:59:00';

  return dateComparison;
}

export function validateRecurrenceType(jiraData: string, bonus: string) {
  let comparison = jiraData == bonus;
  if (jiraData == 'Other' || !jiraData) return bonus ? false : true;
  else return comparison;
}

// function validateFreeGameType(jiraData, bonus) {
//   let bonusConfig = bonus?.freeGamesWinningsName && bonus?.freeGamesName;
//   return (jiraData && bonusConfig) || (!jiraData && !bonusConfig);
// }

export function sameMembers(
  arr1: Array<any>,
  arr2: Array<any>,
  capitalizeMembers = true,
) {
  if (!(Array.isArray(arr1) && Array.isArray(arr2))) return false;
  if (arr1.length === 0 && arr2.length === 0) return true;

  if (capitalizeMembers) {
    arr1 = arr1.map((item) => String(item).toUpperCase());
    arr2 = arr2.map((item) => String(item).toUpperCase());
  }

  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return (
    arr1.every((item) => set2.has(item)) && arr2.every((item) => set1.has(item))
  );
}

// function mapDomainToBrand(domain) {
//   let domainBrands = {
//     'Bovada.lv': 'BVD',
//     'Bodog.eu': 'BDG',
//     'CafeCasino.lv': 'CFC',
//     'IgnitionCasino.eu': 'IGN',
//     'Slots.lv': 'SLLV',
//     'IgnitionCasino.buzz': 'IGN',
//     'JoeFortunePokies.eu': 'JFN',
//     'BVX audiences': 'BVX',
//   };

//   return domainBrands[domain];
// }

export function validateBonusUsagePriority(
  jiraData: string,
  bonus: string,
  bonusFundsMax: string,
) {
  const bonusUsagePriorityMapping = {
    'Cash First': 'AfterCash',
    'Bonus First': 'BeforeCash',
    'After Real Cash (Match Bonus)': 'AfterCash',
    'Other (Specify in Description)': null,
  };

  const result =
    bonusUsagePriorityMapping[
      jiraData as keyof typeof bonusUsagePriorityMapping
    ] == bonus;

  return result || (bonusFundsMax ? false : bonus == 'AfterCash'); //if bonus has no amount then afterCash default
}

export function validateBonusType(
  jiraData: string,
  bonus: keyof typeof BONUS_TYPE_TO_JIRA,
) {
  return (
    String(BONUS_TYPE_TO_JIRA[bonus]).toUpperCase() ==
    String(jiraData).toUpperCase()
  );
}

export function validateRolloverBase(jiraData: string, bonus: string) {
  const rolloverbaseMapping = {
    None: null,
    Deposit: 'DEPOSIT',
    'Bonus Amount': 'BONUS',
    'Deposit + Bonus Amount': 'DEPOSIT_PLUS_BONUS',
  };

  if (rolloverbaseMapping[jiraData as keyof typeof rolloverbaseMapping]) {
    return (
      String(
        rolloverbaseMapping[jiraData as keyof typeof rolloverbaseMapping],
      ).toUpperCase() == String(bonus).toUpperCase()
    );
  } else {
    let res = bonus ? false : true;
    return res;
  }
}

export function validateTargetType(jiraData: string, bonus: TgetBonusFields) {

  const targetTypeMapping = {
    'MASS (All Players)': bonus?.targeted === false,
    'TARGETED (Select Players)': bonus?.targeted === true || bonus?.hasPointsPriceByTier === true,
    None: bonus?.targeted === true,
  };

  return targetTypeMapping[jiraData as keyof typeof targetTypeMapping];
}

export function getCasinoRollover(string: string) {
  let match =
    /(\d+)(?=\sX+\sCASINO|\sX+CASINO|XCASINO|X+\sCASINO|\sCASINO|CASINO)/g;
  if (typeof string !== 'string') return null;
  return string.toUpperCase().match(match)?.[0] ?? string.toUpperCase().match(match);
}

export function getPokerRollover(string: string) {
  let match = /(\d+)(?=\sX+\sPOKER|\sX+POKER|XPOKER|X+\sPOKER|\sPOKER|POKER)/g;
  if (typeof string !== 'string') return null;
  return string.toUpperCase().match(match)?.[0] ?? string.toUpperCase().match(match);
}

export function getSportsRollover(string: string) {
  let match = /(\d+)(?=\sX+\sSPORT|\sX+SPORT|XSPORT|X+\sSPORT|\sSPORT|SPORT)/g;
  if (typeof string !== 'string') return null;
  return string.toUpperCase().match(match)?.[0] ?? string.toUpperCase().match(match);
}

export function getHorsesRollover(string: string) {
  let match = /(\d+)(?=\sX+\sHORSE|\sX+HORSE|XHORSE|X+\sHORSE|\sHORSE|HORSE)/g;
  if (typeof string !== 'string') return null;
  return string.toUpperCase().match(match)?.[0] ?? string.toUpperCase().match(match);
}

// export function regionCurrencyMapping(id) {
//   let region = BRAND_REGIONS?.find((region) => region?.REGION_UUID === id);

//   if (region) {
//     const REGION_CURRENCY = {
//       AUS: 'AUD',
//       UFM: 'USD',
//       CAN: 'CAD',
//     };

//     return REGION_CURRENCY[region?.BUSINESS_REGION];
//   }

//   return null;
// }

export function removeEmptyItems(array: []) {
  if (Array.isArray(array)) {
    return array.filter((item) => {
      const check1 = String(item).toLocaleLowerCase() !== String('n/a').toLocaleLowerCase()
      const check2 = String(item).toLocaleLowerCase() !== String('-').toLocaleLowerCase()
      return check1 && check2;
  });
  } else {
    return [];
  }
}

export function validateMinDeposit(
  jira: TgetJiraFields,
  bonus: TgetBonusFields,
) {
  if (!(jira?.minDeposit || bonus?.minDeposit)) return true; //return true with both is nullish

  return jira?.minDeposit === bonus?.minDeposit ||
    !(bonus?.minDeposit || jira?.minDeposit) ||
    bonus?.minDeposit
    ? false
    : jira?.minDeposit === 0.01 || bonus?.minDeposit
      ? false
      : jira?.minDeposit === 0;
}

export const extractTierName = (description: string) => {

  // if (!description || !description.toLowerCase().includes('teir')) return [];

  let teirs = []

  for ( const teir in TEIR_ID_MAPPING ){
    teirs.push(TEIR_ID_MAPPING[teir])
  }

  const result: Record<string, number | null> = {};

  const lines: string[] = description.split(/\r?\n/);

  lines.forEach((line: string) => {
    const tierFound: string | undefined = teirs.find((tier) => {
        if (!tier) return false;
        return line.toLowerCase().includes(tier.toLowerCase())
      }
    );

    if (tierFound) {
      const match = line.match(/(\d[\d,\.]+)/);
      if (match) {
        const points = match && match[1] ? parseInt(match[1].replace(/[^\d]/g, ''), 10) : null;
        result[tierFound] = points;
      }
    }
  });

  return Object.entries(result).map(([name, value]) => ({
    name,
    value,
  }));
};

export function extractBonusTeirNames(
  bonusData: Record<string, number> | null,
) {
  let tiers = [];
  for (const tierId in bonusData) {
    if (TEIR_ID_MAPPING[tierId]) {
      tiers.push(TEIR_ID_MAPPING[tierId]);
    }
  }
  return tiers;
}

export function validateTierPoints(
  jiraData: { name: string; value: number }[] | null,
  bonusData: Record<string, number> | null,
): boolean {
  if (!jiraData || !bonusData) return false;
  let tierIdToName: Record<string, string>;

  // Recorrer las claves del objeto bonusData
  for (const tierId in bonusData) {
    const tierName = TEIR_ID_MAPPING[tierId];
    if (!tierName) {
      // Si no está en el mapa, lo ignoramos o retornamos false, depende de tu lógica
      continue;
    }

    // Puntos oficiales para este ID
    const officialPoints = bonusData[tierId];

    // Buscar en jiraData
    const found = jiraData.find((d) => String(d.name).toLowerCase() === String(tierName).toLowerCase());
    if (!found) {
      // Si no existe, mismatch
      return false;
    }

    // Comparar valores
    if (found.value !== officialPoints) {
      return false;
    }
  }

  // Si no hubo problemas, true
  return true;
}

export function convertTo24HourFormat(time?: string) {
  return time === '12:00:00' ? '00:00:00' : time;
}

// Remove exported defaults or single file

export const defaultStartTime = '12:00:00';
export const defaultEndTime = '23:59:59';

export function validateRecurrenceStartTime(
  jiraTime: string | undefined,
  bonusTime: string,
) {
  if (!jiraTime) jiraTime = defaultStartTime;

  jiraTime = normalizeMidnight(jiraTime);
  bonusTime = normalizeMidnight(bonusTime);

  return jiraTime === bonusTime;
}

export function normalizeMidnight(time: string) {
  return time === '00:00:00' ? '12:00:00' : time;
}

export function validateRecurrenceEndTime(
  jiraTime: string | undefined,
  bonusTime: string,
) {
  if (!jiraTime) jiraTime = defaultEndTime;

  jiraTime = normalizeMidnight(jiraTime);
  bonusTime = normalizeMidnight(bonusTime);

  const jiraSeconds = timeToSeconds(jiraTime);
  const bonusSeconds = timeToSeconds(bonusTime);

  if (!jiraSeconds || !bonusSeconds) return false;

  return Math.abs(jiraSeconds - bonusSeconds) <= 59;
}

function timeToSeconds(time: string) {
  if (typeof time !== 'string') return null;
  const [hh, mm, ss] = time.split(':').map(Number);
  return hh !== undefined && mm !== undefined && ss !== undefined
    ? hh * 3600 + mm * 60 + ss
    : null;
}

export const extractCancellationWindow = (description?: string) => {
  if (!description) return null;

  // Clean special characters like "+*" and "*"
  const cleanDescription = description
    .replace(/[*+]/g, '') // Clean * and +
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();

  const match = cleanDescription.match(/Cancellation Window:\s*(\d+)\s*hours/i);

  if (match) {
    return match && match[1] ? parseInt(match[1], 10) * 3600 : null;
  }

  return null;
};

export const extractGiftName = (description: string) => {
  if (!description) return null;

  const match = description.match(/Gift name:\s*([\S].*)/);

  if (match) {
    return match && match[1] ? match[1].replace(/^[^\w\d]+/, '').trim() : null;
  }

  return null;
};

export const extractNumber = (str: string): number => {
  return _.toNumber(_.replace(str, /[^\d.-]/g, ''));
};

export const getValue = (FGW: any, FGWvalue: any, generalValue: any ) => {
  return FGW ? FGWvalue : generalValue;
}

export const extractBonusAmount = (str: string): number => {
  // match numbers preceded by $ or standalone numbers not followed by any non-whitespace character
  str = String(str).toLowerCase()?.replaceAll(',', '')
    
  const dollarAmt = str.match(/(?<=\$)\d+/g)?.[0] ?? null;
  const standaloneNumber = str.match(/\b\d+\b(?![^\n]*\bpoints\b)/g)?.[0] ?? null;

  return dollarAmt ? Number(dollarAmt) : Number(standaloneNumber);
}
import { TBonus } from '@/services/beatrix';
import { TIssue } from '@/services/jira';
import {
  getCasinoRollover,
  getHorsesRollover,
  getPokerRollover,
  getSportsRollover,
  parseJiraDT,
} from './custom';
import { get } from 'lodash';

export function getBonusFields(bonusData: TBonus) {
  // let currency = regionCurrencyMapping(bonusData?.availability?.regionCode)
  let currency = bonusData?.availability?.currencies[0];

  //48 fields
  const fields = {
    // internalCode: bonusData?.internalCode,
    internalCode: bonusData.description.internalCode,
    internalStatus: bonusData.internalStatus,
    currency: bonusData?.availability?.currencies[0],
    brand: bonusData?.brandCode,
    type: bonusData?.description?.bonusType, //ROLOAD, FREE_GAMES_WINNINGS, AFF_UPFRONT, TIER_PURCHASABLE, TIER_RELOAD_PURCHASABLE, UPFRONT
    name: bonusData?.description?.external?.en?.name,
    description: bonusData?.description?.external?.en?.description, //will be moved to backend to not worth validating
    bonusCodes: bonusData?.description?.codes, //array
    startDateTime: bonusData?.availability?.startsAt,
    endDateTime: bonusData?.availability?.endsAt,
    maxUses: bonusData?.availability?.useRestrictions?.[0]?.maxUses, //-1 means unlimited?. is always -1 for FGW
    paymentMethods: bonusData?.availability?.trigger?.paymentMethods, //["CC", "BC", "BSV", "BCH", "ETH", "USDT", "LTC", "BCL"],
    minDeposit: bonusData?.availability?.trigger?.minAmount?.[currency]?.value,
    minDepositType:
      bonusData?.availability?.trigger?.minAmount?.[currency]?.type, //FIXED
    targeted: bonusData?.availability?.targeted, //true or false, false = unlimited
    maxDaysAvailable: bonusData?.availability?.targetedMaxDays, //how long offer is available || MIGHT NO LONGER BE IN API
    bonusFundsPercent:
      bonusData?.outcome?.funds?.amounts?.[currency]?.type == 'PERCENTAGE'
        ? bonusData?.outcome?.funds?.amounts[currency]?.value
        : null,
    bonusFundsMax:
      bonusData?.outcome?.funds?.amounts?.[currency]?.maxValue ??
      bonusData?.outcome?.funds?.amounts[currency]?.value,
    bonusFundsType: bonusData?.outcome?.funds?.amounts?.[currency]?.type, //PERCENTAGE or "FIXED"
    cashFundsMin: bonusData?.outcome?.cashFunds?.amounts?.[currency],
    cashFundsMax: bonusData?.outcome?.cashFunds?.maxAmounts?.[currency],
    expiresInDays: bonusData?.outcome?.funds?.expiration?.expiresInDays,
    lockAmountType: bonusData?.outcome?.funds?.lockAmount?.type,
    lockAmountValue: bonusData?.outcome?.funds?.lockAmount?.value, //1 = 100%
    maxLockAmount: bonusData?.outcome?.funds?.maxLockAmount, //should be empty?
    bonusUsagePriority: bonusData?.outcome?.funds?.usagePriority, //BeforeCash or AfterCash
    rolloverBase: bonusData?.outcome?.funds?.rollover?.base, //DEPOSIT_PLUS_BONUS, DEPOSIT, BONUS
    rewardPoints: bonusData?.outcome?.points?.fixed?.reward,
    tierPoints: bonusData?.outcome?.points?.fixed?.teir,
    purchasePointsPrice: bonusData?.pointsPrice,
    pointsPriceByTeir: bonusData?.pointsPriceByTier,
    tournamentTicketId: bonusData?.outcome.tournamentTicket?.id, //
    tournamentTicketName: bonusData?.outcome.tournamentTicket?.names?.en,
    casinoRollover: bonusData?.outcome?.funds?.rollover?.factors?.find(
      (factor: { [key: string]: any }) => factor?.productCode == 'CASINO',
    )?.value,
    horsesRollover: bonusData?.outcome?.funds?.rollover?.factors?.find(
      (factor: { [key: string]: any }) => factor?.productCode == 'HORSES',
    )?.value,
    sportsRollover: bonusData?.outcome?.funds?.rollover?.factors?.find(
      (factor: { [key: string]: any }) => factor?.productCode == 'SPORTS',
    )?.value,
    pokerRollover: bonusData?.outcome?.funds?.rollover?.factors?.find(
      (factor: { [key: string]: any }) => factor?.productCode == 'POKER',
    )?.value,
    unplayableThreshold: bonusData?.outcome?.funds?.unplayableThreshold, //ususally empty
    freeGamesName: bonusData?.outcome?.freeGames?.internalName, //we won't support validating values - just name
    freeGamesWinningsName:
      bonusData?.outcome?.freeGames?.freeWinningsInternalName, //we won't support validating values - just name
    tangibleRewardEnabled: bonusData?.outcome?.tangibleReward?.enabled, //true or false
    tangibleRewardcancellationPeriod:
      bonusData?.outcome?.tangibleReward?.cancellationPeriod, //86400
    hasPointsPriceByTier: bonusData?.pointsPriceByTier
      ? Object?.keys(bonusData?.pointsPriceByTier)?.length > 0
      : null,
    status: bonusData?.status,
    recurrencePeriod: bonusData?.availability?.recurrenceCycle?.periodicity, //Daily
    recurenceListReset:
      bonusData?.availability?.recurrenceCycle?.targetListReset, //true is recurring
    recurrenceStartTime:
      bonusData?.availability?.timeWindows?.dailyTimeFrom ||
      bonusData?.availability?.timeWindows?.weeklyTimeFrom ||
      bonusData?.availability?.timeWindows?.monthlyTimeFrom, //"00:00:00"
    recurrenceEndTime:
      bonusData?.availability?.timeWindows?.dailyTimeTo ||
      bonusData?.availability?.timeWindows?.weeklyTimeTo ||
      bonusData?.availability?.timeWindows?.monthlyTimeTo, //"23:59:59"
    // Free Games
    freeGamesId: bonusData?.outcome?.freeGames?.id,
    freeWinningsId: bonusData?.outcome?.freeGames?.freeWinningsId,
    // gameName: bonusData?.outcome?.freeGames?.valueSpins[0]?.gameName,
    freeGamesPayout: bonusData?.outcome?.freeGames?.payout,
    gameName: get(bonusData, 'outcome.freeGames.valueSpins[0].gameName'),
    valuePerSpin: get(
      bonusData,
      'outcome.freeGames.valueSpins[0].betAmount[0].betAmount',
    ),
    numberOfSpins: bonusData?.outcome?.freeGames?.numberOfSpins,
    maxCashout: bonusData?.outcome?.freeGames?.maxPayout,
    id: bonusData?.id,
  };

  return fields;
}

export type TgetBonusFields = ReturnType<typeof getBonusFields>;

//multi deposits,crypto bonus types not supported
export function getJiraFields(jiraData: TIssue) {
  //25 supported fields, 10 partially supported, 13 unsupported = 73% fully or patially supported

  const fields = {
    key: jiraData?.key,
    brand: jiraData?.fields?.customfield_11209?.[0]?.value, //"Bovada.lv",Bodog.eu,CafeCasino.lv,CafeCasino.lv,IgnitionCasino.eu,Slots.lv,IgnitionCasino.buzz,JoeFortunePokies.eu,BVX audiences
    type: jiraData?.fields?.customfield_11243?.value, //Reload,Affiliate,Crypto Bonus,Customer Service Bonus,First Deposit,Free Bonus,Multi-Deposit,Other,Refer A Friend,Tier Bonus - Default,Tier Purchase,Tier Reload
    name: jiraData?.fields?.customfield_11241?.trim(), //NFL- 50% Reload Offer
    description: jiraData?.fields?.description, //will be moved to backend to not worth validating
    bonusCodes: jiraData?.fields?.customfield_11246
      ?.replaceAll(',', ' ')
      ?.split(' '),
    startTime: jiraData?.fields?.customfield_18101,
    endTime: jiraData?.fields?.customfield_18102,
    startDate: jiraData?.fields?.customfield_11233 ??
      (parseJiraDT(jiraData?.fields?.customfield_18101)?.format('YYYY-MM-DD') ?? null),
    endDate: jiraData?.fields?.customfield_11234 ??
      (parseJiraDT(jiraData?.fields?.customfield_18102)?.format('YYYY-MM-DD') ?? null),
    hasBonusReward: jiraData?.fields?.customfield_14740?.find(
      (item: { [key: string]: any }) => item?.value == 'Bonus Funds',
    )?.value,
    hasCashReward: jiraData?.fields?.customfield_14740?.find(
      (item: { [key: string]: any }) => item?.value == 'Cash Funds',
    )?.value,
    hasFreeGameReward: jiraData?.fields?.customfield_14740?.find(
      (item: { [key: string]: any }) => item?.value == 'Free Games',
    )?.value,
    hasloyaltyPointsReward: jiraData?.fields?.customfield_14740?.find(
      (item: { [key: string]: any }) => item?.value == 'Loyalty Points',
    )?.value,
    hasRewardPointsReward: jiraData?.fields?.customfield_14740?.find(
      (item: { [key: string]: any }) => item?.value == 'Rewards Points',
    )?.value,
    hasTournamentTicketReward: jiraData?.fields?.customfield_14740?.find(
      (item: { [key: string]: any }) => item?.value == 'Tournament Ticket',
    )?.value,
    hasOtherReward: jiraData?.fields?.customfield_14740?.find(
      (item: { [key: string]: any }) => item?.value == 'Other',
    )?.value,
    maxUses: jiraData?.fields?.customfield_11240, //"1x"
    currency: jiraData?.fields?.customfield_12183?.value, //USD
    paymentMethods: jiraData?.fields?.customfield_21904?.map(
      (pm: { [key: string]: any }) => pm.value,
    ),
    // paymentMethods: jiraData?.availability?.trigger?.paymentMethods, //Why is this single selection? ["CC", "BC", "BSV", "BCH", "ETH", "USDT", "LTC", "BCL"],
    minDeposit: jiraData?.fields?.customfield_15806,
    audience: jiraData?.fields?.customfield_12402?.value, //None,MASS (All Players),TARGETED (Select Players),None
    //numberOfSpins, maxCashOut, valuePerSpin can added but being reworked in Rm anyway
    maxDaysAvailable: jiraData?.fields?.customfield_11235, //7 days
    // bonusFundsMin: jiraData?.outcome?.funds?.amounts[currency]?.value, //not in Jira
    bonusAmount: jiraData?.fields?.customfield_11232, //100% Up To $250 (Crypto Only) - Min Deposit: $150, 50% Match up to $300
    bonusFundsType: jiraData?.fields?.customfield_11231?.value, //Percentage or "Fixed"
    // cashFundsMin: jiraData?.outcome?.cashFunds?.amounts[currency],
    // cashFundsMax: jiraData?.outcome?.cashFunds?.maxAmounts[currency],
    expiresInDays: jiraData?.fields?.customfield_11236,
    // lockAmountType: jiraData?.outcome?.funds?.lockAmount?.type,
    // lockAmountValue: jiraData?.outcome?.funds?.lockAmount?.value, //1 = 100%
    // maxLockAmount: jiraData?.outcome?.funds?.maxLockAmount, //should be empty?
    bonusUsagePriority: jiraData?.fields?.customfield_12180?.value, //Cash First,Bonus First,Other (Specify in Description)
    rolloverBase:
      jiraData?.fields?.customfield_18103 !== null
        ? jiraData?.fields?.customfield_18103[0]?.value
        : 'None', //None,Deposit,Bonus Amount,Deposit + Bonus Amount
    // rolloverBase: (() => {
    //   return 'None';
    // })(), //None,Deposit,Bonus Amount,Deposit + Bonus Amount
    // rewardPoints: jiraData?.outcome?.points?.fixed?.reward,
    // tierPoints: jiraData?.outcome?.points?.fixed?.teir,
    // purchasePointsPrice: jiraData?.pointsPrice,
    // tournamentTicketId: jiraData?.tournamentTicket?.id, //
    // tournamentTicketName: jiraData?.tournamentTicket?.names?.en,
    rollover: jiraData?.fields?.customfield_17702, //25x Casino 30x Poker 5x Sports
    casinoRollover: getCasinoRollover(jiraData?.fields?.customfield_17702),
    pokerRollover: getPokerRollover(jiraData?.fields?.customfield_17702),
    sportsRollover: getSportsRollover(jiraData?.fields?.customfield_17702),
    horsesRollover: getHorsesRollover(jiraData?.fields?.customfield_17702),
    fsCasinoRollover: getCasinoRollover(jiraData?.fields?.customfield_17614),
    fsPokerRollover: getPokerRollover(jiraData?.fields?.customfield_17614),
    fsSportsRollover: getSportsRollover(jiraData?.fields?.customfield_17614),
    fsHorsesRollover: getHorsesRollover(jiraData?.fields?.customfield_17614),
    // freeGamesId: jiraData?.outcome?.freeGames?.id,
    publicFreeGamesName: jiraData?.fields?.customfield_17615?.value, //we won't support validating values - just name
    hasBonusfreeGamesWinnings:
      jiraData?.fields?.customfield_16501?.value == 'Bonus Funds', //we won't support validating values - just name
    hasCashfreeGamesWinnings:
      jiraData?.fields?.customfield_16501?.value == 'Cash Funds',
    hasNofreeGamesWinnings:
      jiraData?.fields?.customfield_16501?.value == 'None',
    // tangibleRewardEnabled: jiraData?.outcome?.tangibleReward?.enabled, //true or false
    // tangibleRewardcancellationPeriod: jiraData?.outcome?.tangibleReward?.cancellationPeriod, //86400
    // hasPointsPriceByTier: Object.keys(jiraData?.pointsPriceByTier).length > 0,
    // status: jiraData?.status,
    recurrencePeriod: jiraData?.fields?.customfield_11066?.value, //None,Hourly,Daily,Weekly,Monthly,Other
    // recurenceListReset: jiraData?.recurrenceCycle?.targetListReset, //true is recurring
    // recurrenceStartTime: jiraData?.timeWindows?.dailyTimeFrom, //"00:00:00"
    // recurrenceEndTime: jiraData?.timeWindows?.dailyTimeTo, //"23:59:59"
    // Free Games
    gameName: jiraData?.fields?.customfield_17515,
    valuePerSpin: jiraData?.fields?.customfield_20207,
    numberOfSpins: jiraData?.fields?.customfield_20206,
    freeGamesPayout: jiraData?.fields?.customfield_16501?.value,
    maxCashout: jiraData?.fields?.customfield_17618,
    freeSpinsExpiration: jiraData?.fields?.customfield_17612,
  };

  return fields;
}

export type TgetJiraFields = ReturnType<typeof getJiraFields>;

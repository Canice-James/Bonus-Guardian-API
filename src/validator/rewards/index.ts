import { GroupValidation, FieldGroup, Field } from '@/validator/types';
import {
  bonusReward,
  cancellationWindow,
  cashReward,
  freeGameReward,
  giftName,
  rewardPoints,
  tangibleRewards,
  tournamentTicketReward,
} from './validators';

export const rewardsValidator: GroupValidation = ({ bonusData, jiraData }) => {
  const rewardsGroup: FieldGroup = {
    fieldName: 'Reward Types',
    passed: true,
    group: [
      bonusReward({ bonusData, jiraData }),
      cashReward({ bonusData, jiraData }),
      freeGameReward({ bonusData, jiraData }),
      rewardPoints({ bonusData, jiraData }),
      tournamentTicketReward({ bonusData, jiraData }),
      tangibleRewards({ bonusData, jiraData }),
      giftName({ bonusData, jiraData }),
      cancellationWindow({ bonusData, jiraData }),
    ],
  };
  rewardsGroup.group = rewardsGroup.group.filter(
    (field): field is Field => !!field,
  );
  rewardsGroup.passed = rewardsGroup.group.every((field) => field!.passed);
  return rewardsGroup;
};

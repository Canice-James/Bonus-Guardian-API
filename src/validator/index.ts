import { getBonusFields, getJiraFields } from '../utils/data-mapping';
import { datesValidator } from './dates';
import { bonusValidator } from './bonus';
import { audienceValidator } from './audience';
import { rewardsValidator } from './rewards';
import { rolloverValidator } from './rollover';
import { freeGamesValidator } from './freeGames';
import { FGWValidator } from './FGWValidator';
import { FieldGroup, Validate } from './types';

export function validate({ issue, bonus, freeGamesWinnings }: Validate) {
  console.log("validation starting")

  const jiraData = getJiraFields(issue);
  const bonusData = getBonusFields(bonus);
  const freeGamesWinningsData =
    freeGamesWinnings ? getBonusFields(freeGamesWinnings) : null;

  const rawFields = [
    datesValidator({ bonusData, jiraData }),
    bonusValidator({ bonusData, jiraData }),
    audienceValidator({ bonusData, jiraData }),
    rewardsValidator({ bonusData, jiraData }),
    rolloverValidator({ bonusData, jiraData }),
    freeGamesWinningsData && freeGamesValidator({ bonusData, jiraData, freeGamesWinningsData }),
    freeGamesWinningsData && FGWValidator({ bonusData, jiraData, freeGamesWinningsData }),
  ];

  const initialValidation = rawFields.filter((group): group is FieldGroup => !!group);
  const allPassed = initialValidation.every((group) => group.passed);

  console.log("validation complete")
  return {
    initialValidation,
    jiraData,
    bonusData,
    allPassed,
  };
}

import { TBonus } from '@/services/beatrix';
import { TIssue } from '@/services/jira';
import { TgetBonusFields, TgetJiraFields } from '../utils/data-mapping';

export type Field = {
  fieldName: string;
  rmValue: string;
  jiraValue: string;
  passed: boolean;
  hasWarning?: boolean;
  canBeIgnored?: boolean;
};

export type FieldGroup = {
  fieldName: string;
  passed: boolean;
  group: Array<Field | null>;
  warnings?: number
};

export type GroupValidation = ({}: {
  bonusData: TgetBonusFields;
  jiraData: TgetJiraFields;
  freeGamesWinningsData?: TgetBonusFields | any;
}) => FieldGroup | null;

export type FieldValidation = ({}: {
  bonusData: TgetBonusFields;
  jiraData: TgetJiraFields;
  freeGamesWinningsData?: TgetBonusFields | any;
}) => Field | null;

export type FieldValidationInput = {
  bonusData: TgetBonusFields;
  jiraData: TgetJiraFields;
  freeGamesWinningsData?: TgetBonusFields | any;
};

export type FieldValidationOutput = Field | null;

export type Validate = {
  issue: TIssue;
  bonus: TBonus;
  freeGamesWinnings?: TBonus;
};

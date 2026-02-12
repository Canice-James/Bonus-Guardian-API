import { TBonus } from '@/services/beatrix';
import { TIssue } from '@/services/jira';
import { getBonus } from '@/utils/calls';

export const getActiveTabUrl = async () => {
  return new Promise<string>((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabUrl = tabs[0]?.url;
      if (activeTabUrl) {
        resolve(activeTabUrl);
      } else {
        reject(new Error('Unable to get active tab URL.'));
      }
    });
  });
};

export const extractIssueFromUrl = (url: string) => {
  const urlMatch = url.match(/browse\/([A-Z]+-\d+)/);
  return urlMatch ? urlMatch[1] : null;
};

export const getBonuses = async (issue: TIssue) => {
  const response: {
    bonus?: TBonus;
    freeGamesWinnings?: TBonus;
    error?: string;
  } = {};
  // Get comments
  const comments = issue.fields.comment.comments as { [key: string]: any }[];
  if (!comments) {
    response.error = 'Comments not found in the ticket';
    return response;
  }
  // Regex used to get the rewards manager URL
  const bonusLinkRegex =
    /https:\/\/rewardmanager\.intra-apps\.com\/bonuses\/(new|list)\/([A-Z]+)\/([a-f0-9\-]+)\/(preview|edit\?editMode=true)/g;
  // Get all matches for bonuses from all comments
  const extractedLinks: Array<{ brand: string; bonusId: string }> = [];
  for (const comment of comments) {
    const matches = [...comment.body.matchAll(bonusLinkRegex)];
    matches.forEach((match) => {
      extractedLinks.push({
        brand: match[2],
        bonusId: match[3],
      });
    });
  }
  // If there is no matches return null (URL not found in comments)
  if (extractedLinks.length <= 0) {
    response.error = 'Bonus link not found in the comments.';
    return response;
  }
  // Get the all bonuses from RM
  const allBonuses = await Promise.all(
    extractedLinks.map(async ({ brand, bonusId }) => {
      const res = await getBonus({ brand, id: bonusId });
      return res;
    }),
  );

  // Track last occurrences
  for (const item of allBonuses) {
    if (!item) continue;
    if (item.description.bonusType === 'FREE_GAMES_WINNINGS') {
      response.freeGamesWinnings = item; // Store the last FREE_GAMES_WINNINGS instance
    } else {
      response.bonus = item; // Store the last non-FREE_GAMES_WINNINGS instance
    }
  }
  return response;
};

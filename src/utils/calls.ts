import { TBonus } from '@/services/beatrix';
import { TIssue } from '@/services/jira';

export const getIssue = async (issueNumber: string): Promise<TIssue | null> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'get-issue', issue: issueNumber },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }

        if (response?.success) {
          resolve(response.issue as TIssue);
        } else {
          resolve(null);
        }
      },
    );
  });
};

export const getBonus = async (token: {
  id: string | null;
  brand: string | null;
}): Promise<TBonus | null> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'get-bonus', token: token },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }

        if (response?.success) {
          resolve(response.bonus as TBonus);
        } else {
          resolve(null);
        }
      },
    );
  });
};

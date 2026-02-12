import { getBonus } from './beatrix';
import { getJiraIssue } from './jira';

// export const jiraToken = 'Basic Y2FuamFtZXM6JENyaW01b25oZXJvaGVybw==';
// export const rmToken = 'Basic d96a8de5-c80b-4593-958c-82f82c3adec9';

export type TCredentials = {
  username: string;
  password: string;
};

// Jira Auth

export const loginJira = async ({ username, password }: TCredentials) => {
  const token = btoa(`${username}:${password}`);
  await storage.setItem('local:jira-token', token);
  return token;
};

export const validateJiraToken = async () => {
  try {
    await getJiraIssue();
    console.log('Jira token is valid');
    const token = await storage.getItem('local:jira-token');
    return token as string;
  } catch (e) {
    console.log('Jira token invalid, logging out');
    await storage.removeItem('local:jira-token');
    return null;
  }
};

// Rewards manager Auth

export async function loginRW({ username, password }: TCredentials) {
  const loginEndpoint = 'https://rewardmanager.intra-apps.com/api/v1/session';

  try {
    const response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed! Status: ${response.status}`);
    }

    const data = await response.json();

    const token = data.sessionId as string;

    await storage.setItem('local:rw-token', token);
    await storage.setItem('local:rw-username', username);
    return token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export const validateRWToken = async () => {
  try {
    await getBonus();
    console.log('RW token is valid');
    const token = await storage.getItem('local:rw-token');
    const user = await storage.getItem('local:rw-username');

    if (!user) throw Error('no user set')
    return token as string;
  } catch (e) {
    console.log('RW token invalid, logging out');
    await storage.removeItem('local:rw-token');
    return null;
  }
};

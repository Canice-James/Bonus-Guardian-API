export type TIssue = {
  [key: string]: any;
};

export const getJiraIssue = async (issue: string = 'GMO-70267') => {
  const token = await storage.getItem('local:jira-token');
  if (!token) {
    throw new Error('Jira Auth Token not found');
  }
  const jiraEndpoint = `https://jiraops.corp-apps.com/rest/api/2/issue/${issue}`;

  const response = await fetch(jiraEndpoint, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${token}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    if (response.status === 401) {
      await storage.removeItem('local:jira-token');
      console.log('Jira session expired, logging out');
    } else {
      throw new Error(`Error fetching Jira issue: ${response.status}`);
    }
  }
  const data = await response.json();
  return data as TIssue;
};

// todo: implement get one bonus
export type TBonus = {
  [key: string]: any;
};

export async function getBonus(
  id: string = '5c21e5fb-cf94-451e-a696-4a526f9eaf3f',
  brand: string = 'BDG',
) {
  const RWAuthToken = await storage.getItem('local:rw-token');
  if (!RWAuthToken) {
    throw new Error('RW Auth Token not found');
  }

  const url = `https://rewardmanager.intra-apps.com/services/reward-management/v1/brands/${brand}/rewards/${id}?freeGamesOfferFeature=false`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${RWAuthToken}`,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    if (response.status === 401) {
      await storage.removeItem('local:rw-token');
      console.log('RW session expired, logging out');
    } else {
      throw new Error(`Error fetching RW bonus: ${response.status}`);
    }
  }
  const data = await response.json();
  return data as TBonus;
}

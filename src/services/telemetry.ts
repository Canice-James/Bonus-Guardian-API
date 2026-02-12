export async function trackValidation(
  ticketId: string,
  bonusId: string,
  result: boolean,
  resultIfWarningsIgnored: boolean,
  validationOutput: any,
  brand: string,
  useBackupURL = false
) {
  const RWUserName = await storage.getItem('local:rw-username')
  if (!RWUserName) {
    console.error('RW Username Token not found');
  }
  const url = `http://n8n.10.161.101.24.nip.io/webhook/ca54c706-cdb1-495d-94bc-4f44c77715e5`;
  const backupURL = `https://auto.cyberhawksolutions.com/webhook/ca54c706-cdb1-495d-94bc-4f44c77715e5`;

  try {
    const response = await fetch( useBackupURL ? backupURL : url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'user': RWUserName,
        ticketNumber: ticketId,
        bonusUUID: bonusId,
        timestamp: new Date(),
        result: result,
        resultIfWarningsIgnored: resultIfWarningsIgnored,
        validationOutput:  JSON.stringify(validationOutput),
        brand: brand
      })
    }, );
    if (!response.ok && !useBackupURL) {
      // if (response.status === 500) {
        console.log('Telemetry failed');
      // } 
      trackValidation(
        ticketId,
        bonusId,
        result,
        resultIfWarningsIgnored,
        validationOutput,
        brand,
        true
      )
    }
  }
  catch {
    trackValidation(
      ticketId,
      bonusId,
      result,
      resultIfWarningsIgnored,
      validationOutput,
      brand,
      true
    )
  }
}

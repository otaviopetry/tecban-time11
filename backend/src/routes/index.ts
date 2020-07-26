import { Router } from 'express';
import fs from 'fs';
import https from 'https';
import axios from 'axios';
import path from 'path';
import qs from 'qs';
import { uuid } from 'uuidv4';

const routes = Router();

const certificate = path.join(
  __dirname,
  '..',
  'certificates',
  'bank1',
  'client_certificate.crt',
);

const key = path.join(
  __dirname,
  '..',
  'certificates',
  'bank1',
  'client_private_key.key',
);

// const chain = path.join(__dirname, '..', 'certificates', 'bank1', 'chain.crt');

const httpsAgent = new https.Agent({
  cert: fs.readFileSync(certificate),
  key: fs.readFileSync(key),
  rejectUnauthorized: false,
});

let token = '';

routes.get('/', (request, response) =>
  response.json({ message: 'Hello team XYZ!' }),
);

routes.get('/bank1/get-token', async (request, response) => {
  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization:
        'Basic MzM0ZGExNjUtNzc5OS00ZTZiLTgxYmEtNmU0NjMxYzJmM2Y5OjIyOTM4NDRlLTcxZDgtNDBjYS1iZGRhLTEyYjA4YzUzMGJhNw==',
    };

    const body = {
      grant_type: 'client_credentials',
      scope: 'accounts openid',
    };

    const result = await axios.post(
      'https://as1.tecban-sandbox.o3bank.co.uk/token',
      qs.stringify(body),
      { headers, httpsAgent },
    );

    token = result.data.access_token;

    response.json(token);
  } catch (err) {
    console.log(err);
  }
});

routes.get('/create-consent-request', async (request, response) => {
  console.log(token);

  if (token !== '') {
    const headers = {
      'Content-Type': 'application/json',
      'x-fapi-financial-id': 'c3c937c4-ab71-427f-9b59-4099b7c680ab',
      'x-fapi-interaction-id': uuid(),
      Authorization: `Bearer ${token}`,
    };

    console.log(headers);

    const body = {
      Data: {
        Permissions: [
          'ReadAccountsBasic',
          'ReadAccountsDetail',
          'ReadBalances',
          'ReadBeneficiariesBasic',
          'ReadBeneficiariesDetail',
          'ReadDirectDebits',
          'ReadTransactionsBasic',
          'ReadTransactionsCredits',
          'ReadTransactionsDebits',
          'ReadTransactionsDetail',
          'ReadProducts',
          'ReadStandingOrdersDetail',
          'ReadProducts',
          'ReadStandingOrdersDetail',
          'ReadStatementsDetail',
          'ReadParty',
          'ReadOffers',
          'ReadScheduledPaymentsBasic',
          'ReadScheduledPaymentsDetail',
          'ReadPartyPSU',
        ],
      },
      Risk: {},
    };

    try {
      const result = await axios.post(
        'https://rs1.tecban-sandbox.o3bank.co.uk/open-banking/v3.1/aisp/account-access-consents',
        body,
        { headers, httpsAgent },
      );

      console.log(result.data.data);
      response.json(result.data.data);
    } catch (err) {
      console.log(err);
      response.status(401).json(err.data);
    }
  } else {
    response.json({ message: 'You must have a token.' });
  }
});

export default routes;

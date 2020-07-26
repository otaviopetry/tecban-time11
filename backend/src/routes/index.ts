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

const userData = {
  bearerToken: '',
  consentId: '',
  bankURL: '',
};

const dbPath = path.join(__dirname, '..', 'database', 'db.json');

let token = '';
let consentId = '';
let bankURL = '';

routes.get('/', (request, response) =>
  response.json({ message: 'Hello team XYZ!' }),
);

routes.get('/bank1/get-token', async (request, response) => {
  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization:
        'Basic NjJmZDVlNTMtNTkzMC00NjJlLTg5M2ItOTU4ZWEwZTQzMzZjOjcyMTY0MzJmLTQxZTYtNGQ2OS04Y2QwLTVmNzIxZWFmMTUwYw==',
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

    userData.bearerToken = token;

    const stringData = JSON.stringify(userData);

    fs.writeFile(dbPath, stringData, 'utf8', err => {
      if (err) {
        console.log(err);
      } else {
        console.log('File saved!');
      }
    });

    response.json(token);
  } catch (err) {
    console.log(err);
  }
});

routes.get('/test', (request, response) => {
  const rawData = fs.readFileSync(dbPath);

  const user = JSON.parse(rawData);

  console.log(user);

  response.json(user);
});

routes.get('/bank1/create-consent-request', async (request, response) => {
  const rawData = fs.readFileSync(dbPath);

  const user = JSON.parse(rawData);

  const storedToken = user.bearerToken;

  const storedConsentId = user.consentId;

  if (!storedToken) {
    response.json({ message: 'You must have a token.' });
  }

  if (storedConsentId) {
    response.json({
      message: 'You already have a consent request.',
      consentId: storedConsentId,
    });
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-fapi-financial-id': 'c3c937c4-ab71-427f-9b59-4099b7c680ab',
    'x-fapi-interaction-id': uuid(),
    Authorization: `Bearer ${storedToken}`,
  };

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

    consentId = result.data.Data.ConsentId;

    user.consentId = consentId;

    const stringData = JSON.stringify(user);

    fs.writeFile(dbPath, stringData, 'utf8', err => {
      if (err) {
        console.log(err);
      } else {
        console.log('File saved.');
      }
    });

    response.json(user);
  } catch (err) {
    console.log(err);
    response.status(401).json(err.data);
  }
});

routes.get('/bank1/get-bank-url', async (request, response) => {
  const rawData = fs.readFileSync(dbPath);

  const user = JSON.parse(rawData);

  const storedConsentId = user.consentId;

  const storedBankURL = user.bankURL;

  if (!storedConsentId) {
    response.json({ message: 'The consent request has not been created yet.' });
  }

  if (storedBankURL) {
    response.json({
      message: 'You already have generated the URL.',
      bankURL: storedBankURL,
    });
  }

  try {
    const headers = {
      Authorization:
        'Basic NjJmZDVlNTMtNTkzMC00NjJlLTg5M2ItOTU4ZWEwZTQzMzZjOjcyMTY0MzJmLTQxZTYtNGQ2OS04Y2QwLTVmNzIxZWFmMTUwYw==',
    };

    const result = await axios.get(
      `https://rs1.tecban-sandbox.o3bank.co.uk/ozone/v1.0/auth-code-url/${storedConsentId}?scope=accounts&alg=none`,
      { headers, httpsAgent },
    );

    bankURL = result.data;

    user.bankURL = bankURL;

    const stringData = JSON.stringify(user);

    fs.writeFile(dbPath, stringData, 'utf8', err => {
      if (err) {
        console.log(err);
      } else {
        console.log('File saved!');
      }
    });

    response.json(user);
  } catch (err) {
    response.json({ message: err.data });
  }
});

export default routes;

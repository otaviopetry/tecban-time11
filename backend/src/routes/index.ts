import { Router } from 'express';
import fs from 'fs';
import https from 'https';
import axios from 'axios';
import path from 'path';
import qs from 'qs';

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

const routes = Router();

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

const httpsAgent = new https.Agent({
  cert: fs.readFileSync(certificate),
  key: fs.readFileSync(key),
  rejectUnauthorized: false,
});

routes.get('/', (request, response) =>
  response.json({ message: 'Hello team XYZ!' }),
);

routes.get('/bank1/products', async (request, response) => {
  try {
    const result = await axios.post(
      'https://as1.tecban-sandbox.o3bank.co.uk/token',
      qs.stringify(body),
      { headers, httpsAgent },
    );

    response.send(result.data);
  } catch (err) {
    console.log(err);
  }
});

export default routes;

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const TOKEN_URL = __ENV.TOKEN_URL;
const CLIENT_ID = __ENV.CLIENT_ID;
const USERNAME = __ENV.USERNAME;
const PASSWORD = __ENV.PASSWORD;

export const options = {
  scenarios: {
    volume_test: {
      executor: 'constant-vus',
      vus: 20,
      duration: '10m',
    },
  },
};

// 🔹 Se ejecuta UNA vez antes del test
export function setup() {
  const payload =
    `client_id=${CLIENT_ID}` +
    `&username=${USERNAME}` +
    `&password=${PASSWORD}` +
    `&grant_type=password`;

  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = http.post(TOKEN_URL, payload, params);

  check(res, {
    'token obtenido correctamente': (r) => r.status === 200,
  });

  return {
    token: res.json('access_token'),
  };
}

// 🔹 Cada VU usa el token entregado por setup
export default function (data) {

  const res = http.get(`${BASE_URL}/api/v1/tools`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  check(res, {
    'status 200': (r) => {
      if (r.status !== 200) {
        console.log("Error status:", r.status);
      }
      return r.status === 200;
    },
  });

  sleep(1);
}
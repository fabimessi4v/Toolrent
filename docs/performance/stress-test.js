import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const TOKEN_URL = __ENV.TOKEN_URL;
const CLIENT_ID = __ENV.CLIENT_ID;
const USERNAME = __ENV.USERNAME;
const PASSWORD = __ENV.PASSWORD;

export const options = {
  stages: [
    { duration: '3m', target: 2000 }, // Carga alta pero segura (Base de comparación)
    { duration: '5m', target: 3500 }, // Acercándose al límite lentamente (Stress inicial)
    { duration: '2m', target: 3600 }, // EL LIMITE: Para ver estabilidad
    { duration: '2m', target: 4000 }, // SOBRECARGA: Forzar el error y ver el colapso
    { duration: '5m', target: 0 },    // RECUPERACIÓN: Ver si el sistema sobrevive solo
  ],
};

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

  return { token: res.json('access_token') };
}
//Cada VU (virtual user) ejecuta esa función repetidamente durante su etapa (definida en options).
export default function (data) {
  const res = http.get(`${BASE_URL}/api/v1/tools`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}

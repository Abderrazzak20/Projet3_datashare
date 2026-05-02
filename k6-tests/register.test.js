import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8080';

export default function () {

 
  const email = `user_vu${__VU}_iter${__ITER}@test.com`;

  const payload = JSON.stringify({
    email: email,
    password: '12345678',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/api/register`, payload, params);

  // ❌ DEBUG si erreur
  if (res.status !== 200 && res.status !== 201) {
    console.error(`REGISTER ERROR: ${res.status}`);
    console.error(`EMAIL: ${email}`);
    console.error(`BODY: ${res.body}`);
  }

  // ✔ CHECK
  check(res, {
    'register OK': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8080';

export default function () {

  const payload = JSON.stringify({
    email: __ENV.USER_EMAIL,
    password: __ENV.USER_PASSWORD,
  });

  const res = http.post(
    `${BASE_URL}/api/login`,
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  // ✅ DEBUG 
  if (res.status !== 200) {
    console.error(`LOGIN ERROR: ${res.status}`);
    console.error(`BODY: ${res.body}`);
  }

  // ✔ CHECK
  check(res, {
    'login OK': (r) => r.status === 200,
  });

  sleep(1);
}
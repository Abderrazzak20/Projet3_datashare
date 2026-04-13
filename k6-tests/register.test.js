import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:8080/api/register';

  const payload = JSON.stringify({
    email: `user_${Math.random()}@test.com`,
    password: '12345678',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'register OK': (r) => r.status === 200,
  });
}
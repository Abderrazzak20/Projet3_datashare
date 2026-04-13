import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:8080/api/login';

  const payload = JSON.stringify({
    email: 'mario@gmail.com',
    password: 'scemo123',
  });

  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'login OK': (r) => r.status === 200,
  });
}
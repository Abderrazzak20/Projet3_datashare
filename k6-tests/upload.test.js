import http from 'k6/http';
import { check, sleep } from 'k6';

// 🔧 Configuration du test
export const options = {
  vus: 50,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8080';

/**
 * 🔐 SETUP (executé une seule fois)
 * → login et récupération du JWT
 */
export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({
      email: __ENV.USER_EMAIL,
      password: __ENV.USER_PASSWORD,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(loginRes, {
    'login réussi': (r) => r.status === 200,
  });

  const token = JSON.parse(loginRes.body).token;

  return { token };
}

/**
 * 🚀 TEST PRINCIPAL → UPLOAD sous charge
 */
export default function (data) {

  const url = `${BASE_URL}/api/files/upload`;

  const formData = {
    file: http.file('hello world from k6', 'test.txt'),
    expiration: '7', 
  };

  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = http.post(url, formData, params);

  check(res, {
    'upload OK': (r) => r.status === 200,
  });

  // 🧠 Simule un utilisateur réel
  sleep(1);
}
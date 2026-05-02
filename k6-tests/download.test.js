import http from 'k6/http';
import { check } from 'k6';

// 🔧 Configuration du test
export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8080';

/**
 * 🔐 SETUP (executé une seule fois)
 */
export function setup() {
  // 🔑 LOGIN
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

  // 📁 UPLOAD (UNE SEULE FOIS)
  const file = http.file('contenu test fichier', 'test.txt');

  const uploadRes = http.post(
    `${BASE_URL}/api/files/upload`,
    {
      file: file,
      expiration: '1',
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  check(uploadRes, {
    'upload réussi (setup)': (r) => r.status === 200,
  });

  const downloadToken = JSON.parse(uploadRes.body).downloadToken;

  // 👉 On retourne token + downloadToken
  return { token, downloadToken };
}

/**
 * 🚀 TEST PRINCIPAL → UNIQUEMENT DOWNLOAD
 */
export default function (data) {
  const res = http.get(
    `${BASE_URL}/api/files/download/${data.downloadToken}`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );

  check(res, {
    'download réussi': (r) => r.status === 200,
  });
}
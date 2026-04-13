import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 30,
  duration: '30s',
};

export default function () {

  const tokenjwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJpb0BnbWFpbC5jb20iLCJpZCI6MiwiaWF0IjoxNzc2MTE2MDQwLCJleHAiOjE3NzYxMTk2NDB9.fyxB-O4c4N1ZT8qBWAenDEcxrXIsBiumM1QYTro4Sl0';

  const downloadToken = '9a2d0dd2-3e4f-49ce-bf6a-853d52ade609';

  const params = {
    headers: {
      Authorization: `Bearer ${tokenjwt}`,
    },
  };

  const res = http.get(
    `http://localhost:8080/api/files/download/${downloadToken}`,
    params
  );

  check(res, {
    'download OK': (r) => r.status === 200,
  });
}
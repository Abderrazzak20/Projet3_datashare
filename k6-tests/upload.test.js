import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {

  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJpb0BnbWFpbC5jb20iLCJpZCI6MiwiaWF0IjoxNzc2MTE2MDQwLCJleHAiOjE3NzYxMTk2NDB9.fyxB-O4c4N1ZT8qBWAenDEcxrXIsBiumM1QYTro4Sl0';

  const url = 'http://localhost:8080/api/files/upload';

  const formData = {
    file: http.file('hello world from k6', 'test.txt'),
    expireDays: '7',
  };

  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.post(url, formData, params);

  check(res, {
    'upload OK': (r) => r.status === 200,
  });
}
import http from './http';

export async function register(username: string, email: string, password: string) {
  await http.post('/api/auth/register', {
    username,
    email,
    password,
  });
}

export async function login(email: string, password: string) {
  await http.post('/api/auth/login', {
    email,
    password,
  });
}

export async function logout() {
  await http.post('/api/auth/logout');
}

import axios from 'axios';
import { User } from '../../models/User/user';
import { LoggedUser } from '../../models/User/loggedUser';
import { loggedUser } from '../../reactive/refs';
import { jwtDecode } from 'jwt-decode';

class AuthService {
  private static instance: AuthService;
  private apiURL = import.meta.env.VITE_URL;

  private constructor() { }

  //zwraca singleton AuthService (tworzy instancję, jeśli nie istnieje)
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  //logownie użytkownika
  public async login(email: string, password: string): Promise<{ token: string, refreshToken: string }> {
    try {
      const response = await axios.post(`${this.apiURL}/api/login`, { email, password });
      const { token, refreshToken } = response.data;
      
      const user = this.decodeToken(token); //dekodowanie tokenu JWT do uzyskania danych użytkownika
      loggedUser.value = user;
      localStorage.setItem('loggedUser', JSON.stringify(user));
      
      return { token, refreshToken };
    } catch (error) {
      throw new Error("Invalid email or password");
    }
  }
  //rejestrownie użytkownika 
  public async register(userData: { firstName: string; lastName: string; email: string; password: string }): Promise<void> {
    try {
      await axios.post(`${this.apiURL}/api/register`, userData);
    } catch (error: any) {
      if (error.response) {
        // Serwer odpowiedział na żądanie, ale zwrócił błąd
        console.error('Error response from server:', error.response.data);
        throw new Error(`Registration failed: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // Żądanie zostało wysłane, ale brak odpowiedzi
        console.error('No response received from server:', error.request);
        throw new Error('Registration failed: No response from server');
      } else {
        // Coś innego poszło nie tak
        console.error('Error during registration:', error.message);
        throw new Error(`Registration failed: ${error.message}`);
      }
    }
  }
  
  //odświeżanie tokenu za pomocą refresh tokenu
  public async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const response = await axios.post(`${this.apiURL}/refresh-token`, { refreshToken });//POST do API
      const { token } = response.data;//pobieranie nowego tokenu
      loggedUser.value = this.decodeToken(token);//dekodowanie i aktualizacja zalogowanego użytkownika
      return { token };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
  //dekowanie tokenu JWT i zwracanie zalogowanego użytkownika
  private decodeToken(token: string): LoggedUser | null {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id,
        name: decoded.firstName || '',
        email: decoded.email,
        role: decoded.role,
        avatar: decoded.avatar || ''
      };
    } catch (error) {
      return null;
    }
  }

  public getCurrentUser(): LoggedUser | null {
    return loggedUser.value;
  }

  public async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${this.apiURL}/api/auth/users`);
      const users: User[] = response.data;
      return users;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }
}

export default AuthService.getInstance();

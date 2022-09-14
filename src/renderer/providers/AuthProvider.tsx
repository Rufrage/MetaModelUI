import { FirebaseError } from 'firebase/app';
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';

export type AuthContextContent = {
  user: User | null;
  register: (email: string, password: string) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ emailError: string; passwordError: string }>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextContent>({
  user: null,
  register: () => {},
  login: () => {
    return new Promise((resolve) => {
      resolve({ emailError: '', passwordError: '' });
    });
  },
  logout: () => {},
});

interface AuthProviderProps {
  children: JSX.Element | JSX.Element[];
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    setUser(userCredential.user);
    return { userCredential };
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return { emailError: '', passwordError: '' };
    } catch (error) {
      let emailError = '';
      let passwordError = '';
      if (error instanceof FirebaseError) {
        const { code } = error as FirebaseError;
        if (
          code === AuthErrorCodes.INVALID_EMAIL ||
          code === AuthErrorCodes.USER_DELETED
        ) {
          emailError = 'Email is not registered.';
        } else if (code === AuthErrorCodes.INVALID_PASSWORD) {
          passwordError = 'The password is invalid.';
        }
      }
      return { emailError, passwordError };
    }
  };

  const logout = async () => {
    if (user != null) {
      await signOut(auth);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

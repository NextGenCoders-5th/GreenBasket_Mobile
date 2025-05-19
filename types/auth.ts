import { UserType } from './user';

export interface AuthSignUp {
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
}
export interface SignUpFormType extends AuthSignUp {
  agreeToTerms: boolean;
}

export interface AuthSignUpResponse {
  data: {
    status: string;
    message: string;
    timestamp: string;

    data: UserType;
  };
}

export interface AuthSignIn {
  email: string;
  password: string;
}

export interface AuthSignInResponse {
  data: {
    status: string;
    message: string;
    timestamp: string;

    data: {
      accessToken: string;
      refreshToken: string;
      user: UserType;
    };
  };
}

export interface AuthRefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthError {
  status: number;
  data: {
    message: string;
    error: string;
    statusCode: number;
  };
}

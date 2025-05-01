import { UserType } from './user';

export interface AuthSignUpType {
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthSignUpResponseType {
  data: {
    status: string;
    message: string;
    timestamp: string;

    data: UserType;
  };
}

export interface AuthSignInType {
  email: string;
  password: string;
}

export interface AuthSignInResponseType {
  data: {
    status: string;
    message: string;
    timestamp: string;

    data: {
      accessToken: string;
      refreshToken: string;
      data: {
        accessToken: string;
        refreshToken: string;
        user: UserType;
      };
    };
  };
}

export interface AuthRefreshTokenResponseType {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// export type User = CognitosUser

export interface AuthState {
  token?: string;
}

export function initAuth(): AuthState {
  return {
    token: ''
  };
}

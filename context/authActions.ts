import { User } from '../types/index';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export type AuthAction =
  | { type: typeof LOGIN_REQUEST }
  | { type: typeof LOGIN_SUCCESS; payload: User }
  | { type: typeof LOGIN_FAILURE; payload: string }
  | { type: typeof LOGOUT }
  | { type: typeof REGISTER_REQUEST }
  | { type: typeof REGISTER_SUCCESS; payload: User }
  | { type: typeof REGISTER_FAILURE; payload: string };

export const loginRequest = () => ({ type: LOGIN_REQUEST } as const);
export const loginSuccess = (user: User) => ({ type: LOGIN_SUCCESS, payload: user } as const);
export const loginFailure = (error: string) => ({ type: LOGIN_FAILURE, payload: error } as const);
export const logout = () => ({ type: LOGOUT } as const);
export const registerRequest = () => ({ type: REGISTER_REQUEST } as const);
export const registerSuccess = (user: User) => ({ type: REGISTER_SUCCESS, payload: user } as const);
export const registerFailure = (error: string) => ({ type: REGISTER_FAILURE, payload: error } as const);

export type AuthDispatch = React.Dispatch<AuthAction>;

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return { ...state, isLoading: true, error: null };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return { ...state, isLoading: false, user: action.payload, error: null };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case LOGOUT:
      return { ...state, user: null, error: null };
    default:
      return state;
  }
};


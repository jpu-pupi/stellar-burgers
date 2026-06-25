import { ReactElement } from 'react';
import { useSelector } from '../services/store';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import {
  selectIsAuth,
  selectIsAuthChecked
} from '../services/slices/userSlice';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isAuth = useSelector(selectIsAuth);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from;

    return <Navigate to={from?.pathname || '/'} replace />;
  }

  return children;
};

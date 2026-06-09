import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Modal } from '@components';
import { OrderInfo } from '@components';
import { IngredientDetails } from '@components';
import { Preloader } from '@ui';

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import { Location } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import {
  getUser,
  selectIsAuth,
  selectIsAuthChecked
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

const App = () => {
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );
  const error = useSelector((state) => state.ingredients.error);

  const location = useLocation();
  const state = location.state as { background?: Location };

  const isAuth = useSelector(selectIsAuth);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const ProtectedRoute = ({
    children,
    onlyUnAuth = false
  }: ProtectedRouteProps) => {
    const location = useLocation();

    if (!isAuthChecked) {
      return <Preloader />;
    }

    if (onlyUnAuth && isAuth) {
      return <Navigate to='/' replace />;
    }

    if (!onlyUnAuth && !isAuth) {
      return <Navigate to='/login' replace state={{ from: location }} />;
    }

    return children;
  };

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUser());
  }, [dispatch]);

  const ModalRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const handleClose = () => navigate(-1);

    return (
      <Modal title='' onClose={handleClose}>
        {children}
      </Modal>
    );
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <Routes location={state?.background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />

            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />

            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            <Route path='/ingredients/:id' element={<IngredientDetails />} />

            <Route path='/feed/:number' element={<OrderInfo />} />

            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {state?.background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <ModalRoute>
                    <OrderInfo />
                  </ModalRoute>
                }
              />

              <Route
                path='/ingredients/:id'
                element={
                  <ModalRoute>
                    <IngredientDetails />
                  </ModalRoute>
                }
              />

              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <ModalRoute>
                      <OrderInfo />
                    </ModalRoute>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;

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
import { getUser, selectIsAuth } from '../../services/slices/userSlice';

const App = () => {
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );
  const error = useSelector((state) => state.ingredients.error);

  const location = useLocation();
  const state = location.state as { background?: Location };

  const isAuth = useSelector(selectIsAuth);

  // 👇 ProtectedRoute внутри App
  const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const location = useLocation();

    if (!isAuth) {
      return <Navigate to='/login' replace state={{ from: location }} />;
    }

    return children;
  };

  // загрузка данных
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUser());
  }, [dispatch]);

  // модалка маршрутов
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

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />

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
                  <ModalRoute>
                    <OrderInfo />
                  </ModalRoute>
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

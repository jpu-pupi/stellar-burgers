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
import { Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );
  const ingredients = useSelector((state) => state.ingredients.items);
  const error = useSelector((state) => state.ingredients.error);
  const location = useLocation();
  const state = location.state as { background?: Location };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const ModalRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const handleClose = () => {
      navigate(-1);
    };

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
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
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

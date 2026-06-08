import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { selectIsAuth } from '../../services/slices/userSlice';
import { orderBurger, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  const order = useSelector((state) => state.order.order);
  const orderRequest = useSelector((state) => state.order.isLoading);

  const constructorItems = { bun, ingredients };

  const ingredientsIds = [
    bun?._id,
    ...ingredients.map((i) => i._id),
    bun?._id
  ].filter(Boolean) as string[];

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login');
      return;
    }

    dispatch(orderBurger(ingredientsIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) + ingredients.reduce((s, v) => s + v.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      orderRequest={orderRequest}
      orderModalData={order}
      price={price}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

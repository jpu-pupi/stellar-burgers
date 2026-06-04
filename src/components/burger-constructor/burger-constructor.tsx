import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );

  const constructorItems = { bun, ingredients };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
  };

  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) + ingredients.reduce((s, v) => s + v.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      price={price}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

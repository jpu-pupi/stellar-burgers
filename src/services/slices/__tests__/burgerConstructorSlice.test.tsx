import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../burgerConstructorSlice';

describe('burgerConstructor reducer', () => {
  const bun = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  const ingredient = {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 5,
    calories: 150,
    price: 80,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  describe('initial state', () => {
    test('редьюсер должен вернуть начальное состояние при неизвестном экшене', () => {
      const state = burgerConstructorReducer(
        undefined,
        { type: 'UNKNOWN' }
      );

      expect(state).toEqual({
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null
      });
    });
  });

  describe('addIngredient', () => {
    test('должен добавить булку в состояние конструктора', () => {
      const state = burgerConstructorReducer(
        undefined,
        addIngredient(bun)
      );

      expect(state.bun).toEqual(bun);
      expect(state.ingredients).toHaveLength(0);
    });

    test('должен добавить ингредиент в список сгенерировав ему id', () => {
      const state = burgerConstructorReducer(
        undefined,
        addIngredient(ingredient)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        _id: ingredient._id,
        name: ingredient.name,
        type: ingredient.type
      });

      expect(state.ingredients[0].id).toBeDefined();
    });
  });

  describe('removeIngredient', () => {
    test('должен удалить ингредиент из конструктора по id', () => {
      const stateWithIngredient = burgerConstructorReducer(
        undefined,
        addIngredient(ingredient)
      );

      const id = stateWithIngredient.ingredients[0].id;

      const state = burgerConstructorReducer(
        stateWithIngredient,
        removeIngredient(id)
      );

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredientUp', () => {
    test('должен переместить ингредиент на одну позицию вверх', () => {
      let state = burgerConstructorReducer(
        undefined,
        addIngredient(ingredient)
      );

      state = burgerConstructorReducer(
        state,
        addIngredient({
          ...ingredient,
          _id: '3',
          name: 'Соус'
        })
      );

      const secondItem = state.ingredients[1];

      state = burgerConstructorReducer(
        state,
        moveIngredientUp(1)
      );

      expect(state.ingredients[0].id).toBe(secondItem.id);
    });
  });

  describe('moveIngredientDown', () => {
    test('должен переместить ингредиент на одну позицию вниз', () => {
      let state = burgerConstructorReducer(
        undefined,
        addIngredient(ingredient)
      );

      state = burgerConstructorReducer(
        state,
        addIngredient({
          ...ingredient,
          _id: '3',
          name: 'Соус'
        })
      );

      const firstItem = state.ingredients[0];

      state = burgerConstructorReducer(
        state,
        moveIngredientDown(0)
      );

      expect(state.ingredients[1].id).toBe(firstItem.id);
    });
  });

  describe('clearConstructor', () => {
    test('должен очистить конструктор (булка и ингредиенты)', () => {
      let state = burgerConstructorReducer(
        undefined,
        addIngredient(bun)
      );

      state = burgerConstructorReducer(
        state,
        addIngredient(ingredient)
      );

      state = burgerConstructorReducer(
        state,
        clearConstructor()
      );

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });
});
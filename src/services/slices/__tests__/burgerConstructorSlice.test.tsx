import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  ingredientsReducer
} from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';
import { getIngredientsApi } from '../../../utils/burger-api';

jest.mock('../../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: 'mocked_1',
      name: 'Моя тестовая булка',
      type: 'bun',
      proteins: 100,
      fat: 50,
      carbohydrates: 200,
      calories: 999,
      price: 777,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    },
    {
      _id: 'mocked_2',
      name: 'Моя тестовая котлета',
      type: 'main',
      proteins: 300,
      fat: 100,
      carbohydrates: 50,
      calories: 500,
      price: 300,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    },
    {
      _id: 'mocked_3',
      name: 'Мой тестовый соус',
      type: 'sauce',
      proteins: 10,
      fat: 5,
      carbohydrates: 100,
      calories: 50,
      price: 50,
      image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
    }
  ];

  describe('редьюсер как функция', () => {
    test('должен возвращать начальное состояние при undefined и неизвестном экшене', () => {
      const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
      expect(state).toEqual(initialState);
    });

    test('должен игнорировать неизвестный экшен и возвращать текущее состояние', () => {
      const currentState = {
        items: mockIngredients,
        isLoading: false,
        error: null
      };
      const state = ingredientsReducer(currentState, { type: 'UNKNOWN' });
      expect(state).toEqual(currentState);
    });
  });

  describe('обработка простых экшенов', () => {
    test('должен обрабатывать экшен fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);
      
      expect(state).toEqual({
        items: [],
        isLoading: true,
        error: null
      });
    });

    test('должен обрабатывать экшен fetchIngredients.fulfilled', () => {
      const action = { 
        type: fetchIngredients.fulfilled.type, 
        payload: mockIngredients 
      };
      const state = ingredientsReducer(initialState, action);
      
      expect(state).toEqual({
        items: mockIngredients,
        isLoading: false,
        error: null
      });
    });

    test('должен обрабатывать экшен fetchIngredients.rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = { 
        type: fetchIngredients.rejected.type, 
        error: { message: errorMessage } 
      };
      const state = ingredientsReducer(initialState, action);
      
      expect(state).toEqual({
        items: [],
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('обработка асинхронных экшенов', () => {
    test('должен устанавливать isLoading: true при pending', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать isLoading: false и загружать данные при fulfilled', () => {
      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        { 
          type: fetchIngredients.fulfilled.type, 
          payload: mockIngredients 
        }
      );
      
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать isLoading: false и error при rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        { 
          type: fetchIngredients.rejected.type, 
          error: { message: errorMessage } 
        }
      );
      
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });

    test('должен использовать стандартное сообщение при rejected без message', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: {}
      });
      
      expect(state.error).toBe('Ошибка загрузки');
    });
  });

  describe('селекторы', () => {
    const mockState = {
      ingredients: {
        items: mockIngredients,
        isLoading: false,
        error: null
      }
    };

    test('selectIngredients должен возвращать список ингредиентов', () => {
      const result = selectIngredients(mockState as any);
      expect(result).toEqual(mockIngredients);
      expect(result).toHaveLength(3);
    });

    test('selectIngredients должен возвращать пустой массив, если данных нет', () => {
      const emptyState = {
        ingredients: {
          items: [],
          isLoading: false,
          error: null
        }
      };
      const result = selectIngredients(emptyState as any);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('selectIngredientsLoading должен возвращать true при загрузке', () => {
      const loadingState = {
        ingredients: {
          items: [],
          isLoading: true,
          error: null
        }
      };
      const result = selectIngredientsLoading(loadingState as any);
      expect(result).toBe(true);
    });

    test('selectIngredientsLoading должен возвращать false, если загрузки нет', () => {
      const result = selectIngredientsLoading(mockState as any);
      expect(result).toBe(false);
    });

    test('selectIngredientsError должен возвращать ошибку', () => {
      const errorState = {
        ingredients: {
          items: [],
          isLoading: false,
          error: 'Ошибка загрузки'
        }
      };
      const result = selectIngredientsError(errorState as any);
      expect(result).toBe('Ошибка загрузки');
    });

    test('selectIngredientsError должен возвращать null, если ошибки нет', () => {
      const result = selectIngredientsError(mockState as any);
      expect(result).toBeNull();
    });
  });

  describe('интеграционные тесты с API', () => {
    test('должен успешно загружать ингредиенты через API', async () => {
      (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);
      
      const dispatch = jest.fn();
      const thunk = fetchIngredients();
      
      const getState = () => ({
        ingredients: {
          items: [],
          isLoading: false,
          error: null
        }
      });
      
      await thunk(dispatch, getState, {});
      
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: fetchIngredients.pending.type })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ 
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        })
      );
      
      expect(getIngredientsApi).toHaveBeenCalled();
    });

    test('должен обрабатывать ошибку при загрузке ингредиентов', async () => {
      const error = new Error('Ошибка сети');
      (getIngredientsApi as jest.Mock).mockRejectedValue(error);
      
      const dispatch = jest.fn();
      const thunk = fetchIngredients();
      
      const getState = () => ({
        ingredients: {
          items: [],
          isLoading: false,
          error: null
        }
      });
      
      await thunk(dispatch, getState, {});
      
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: fetchIngredients.pending.type })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ 
          type: fetchIngredients.rejected.type,
          error: expect.anything()
        })
      );
    });
  });
});
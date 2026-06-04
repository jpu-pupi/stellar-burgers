import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
  orderRequest: boolean;
  orderModalData: any;
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const item = action.payload;

      if (item.type === 'bun') {
        state.bun = item;
      } else {
        state.ingredients.push(item);
      }
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item._id !== action.payload
      );
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      if (i > 0) {
        const arr = state.ingredients;
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      }
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      const arr = state.ingredients;
      if (i < arr.length - 1) {
        [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = burgerConstructorSlice.actions;

import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';

console.log('burgerConstructorReducer:', burgerConstructorReducer);

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer
});

import {Words} from './Words';

export const colors = {
  black: '#121214',
  darkgrey: '#3A3A3D',
  lightgrey: '#D7DADC',
  grey: '#818384',
  primary: '#538D4E',
  secondary: '#B59F3B',
};
export const colorToShare = {
  [colors.grey]: '⬜',
  [colors.primary]: '🟩',
  [colors.secondary]: '🟨',
};
export const ENTER = "ENTER"
export const CLEAR = "CLEAR"
export const keys = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    [ENTER,"z","x","c","v","b","n","m",CLEAR],
]
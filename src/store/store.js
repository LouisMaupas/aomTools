import { create } from 'zustand';
import createUserSlice from './userSlice';
import createNavigationSlice from './navigationSlice';

const useStore = create((set) => ({
  ...createUserSlice(set),
  ...createNavigationSlice(set),
}));

export default useStore;

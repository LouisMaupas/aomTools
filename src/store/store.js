import { create } from 'zustand';
import createUserSlice from './userSlice';
import createNavigationSlice from './navigationSlice';
import createCounterToolSlice  from './counterTool';

const useStore = create((set) => ({
  ...createUserSlice(set),
  ...createNavigationSlice(set),
  ...createCounterToolSlice(set),
}));

export default useStore;

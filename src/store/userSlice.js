// userSlice.js
const createUserSlice = (set) => ({
    userInfos: {
      civilization: '',
      majorGod: '',
    },
    setUserInfos: (infos) => set((state) => ({
      userInfos: {
        ...state.userInfos,
        ...infos,
      },
    })),
    loadUserInfosFromStorage: () => {
      const savedInfos = localStorage.getItem('userInfos');
      if (savedInfos) {
        set({ userInfos: JSON.parse(savedInfos) });
      }
    },
  });
  
  export default createUserSlice;
  
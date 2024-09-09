// navigationSlice.js
const createNavigationSlice = (set) => ({
    activeTab: 'home',
    setActiveTab: (tab) => set({ activeTab: tab }),
  });
  
  export default createNavigationSlice;
  
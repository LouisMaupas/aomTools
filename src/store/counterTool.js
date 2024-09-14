const createCounterToolSlice = (set) => ({
  userCivilization: "",
  opponentCivilizations: [],

  addOpponentCivilization: () =>
    set((state) => ({
      opponentCivilizations: [...state.opponentCivilizations, ""],
    })),

  removeOpponentCivilization: (index) =>
    set((state) => ({
      opponentCivilizations: state.opponentCivilizations.filter(
        (_, i) => i !== index
      ),
    })),

  setUserCivilization: (civilization) =>
    set({ userCivilization: civilization }),

  updateOpponentCivilization: (id, value) =>
    set((state) => {
      const updatedCivilizations = [...state.opponentCivilizations];
      updatedCivilizations[id] = value;
      return { opponentCivilizations: updatedCivilizations };
    }),
});

export default createCounterToolSlice;

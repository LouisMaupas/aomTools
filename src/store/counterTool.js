const createCounterToolSlice = (set) => ({
    userCivilization: '', // Civilisation choisie par l'utilisateur
    opponentCivilizations: [], // Liste des civilisations des adversaires
  
    // Ajouter une civilisation adversaire
    addOpponentCivilization: () =>
      set((state) => ({ opponentCivilizations: [...state.opponentCivilizations, ''] })),
  
    // Retirer une civilisation adversaire
    removeOpponentCivilization: (index) =>
      set((state) => ({
        opponentCivilizations: state.opponentCivilizations.filter((_, i) => i !== index),
      })),
  
    // Mettre à jour la civilisation de l'utilisateur
    setUserCivilization: (civilization) => set({ userCivilization: civilization }),
  
    // Mettre à jour les civilisations des adversaires
    updateOpponentCivilization: (index, value) =>
      set((state) => {
        const updatedCivilizations = [...state.opponentCivilizations];
        updatedCivilizations[index] = value;
        return { opponentCivilizations: updatedCivilizations };
      }),
  });
  
  export default createCounterToolSlice;
  
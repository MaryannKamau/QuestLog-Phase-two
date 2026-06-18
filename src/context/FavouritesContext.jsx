import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (game) => {
    const exists = favorites.find(
      (favorite) => favorite.id === game.id
    );

    if (!exists) {
      setFavorites([...favorites, game]);
    }
  };

  const removeFavorite = (gameId) => {
    setFavorites(
      favorites.filter((game) => game.id !== gameId)
    );
  };

  const isFavorite = (gameId) => {
    return favorites.some(
      (game) => game.id === gameId
    );
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used within a FavoritesProvider"
    );
  }

  return context;
}
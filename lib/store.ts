import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    sessionId: string;
    setSessionId: (id: string) => void;
    favorites: string[];
    toggleFavorite: (articleId: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            sessionId: '',
            setSessionId: (id) => set({ sessionId: id }),
            favorites: [],
            toggleFavorite: (articleId) =>
                set((state) => ({
                    favorites: state.favorites.includes(articleId)
                        ? state.favorites.filter((id) => id !== articleId)
                        : [...state.favorites, articleId],
                })),
        }),
        {
            name: 'user-storage',
        }
    )
);

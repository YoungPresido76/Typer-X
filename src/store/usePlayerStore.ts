import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Player } from '../types'
import { calculateLevel } from '../core/xpFormula'

interface PlayerStore {
  player: Player | null
  setPlayer: (player: Player) => void
  addXp: (amount: number) => void
  spendUnlockPoints: (amount: number) => boolean
  clearPlayer: () => void
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      player: null,

      setPlayer: (player) => set({ player }),

      addXp: (amount) => {
        const { player } = get()
        if (!player) return

        const newXp = player.totalXp + amount
        const newLevel = calculateLevel(newXp)
        const didLevelUp = newLevel > player.level

        set({
          player: {
            ...player,
            totalXp: newXp,
            level: newLevel,
            unlockPoints: didLevelUp
              ? player.unlockPoints + (newLevel - player.level)
              : player.unlockPoints,
          },
        })
      },

      spendUnlockPoints: (amount) => {
        const { player } = get()
        if (!player || player.unlockPoints < amount) return false

        set({ player: { ...player, unlockPoints: player.unlockPoints - amount } })
        return true
      },

      clearPlayer: () => set({ player: null }),
    }),
    { name: 'glyph-key-player' }
  )
)

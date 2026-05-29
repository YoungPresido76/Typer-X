// Formula: 1000 × (level ^ 1.5)
export const xpForLevel = (level: number): number => {
  return Math.round(1000 * Math.pow(level, 1.5))
  }

  export const xpToReachLevel = (level: number): number => {
    let total = 0
      for (let i = 1; i < level; i++) {
          total += xpForLevel(i)
            }
              return total
              }

              export const calculateLevel = (totalXp: number): number => {
                let level = 1
                  while (level < 50) {
                      const xpNeeded = xpToReachLevel(level + 1)
                          if (totalXp < xpNeeded) break
                              level++
                                }
                                  return level
                                  }

                                  export const xpInCurrentLevel = (totalXp: number, level: number): number => {
                                    return totalXp - xpToReachLevel(level)
                                    }

                                    export const levelProgress = (totalXp: number, level: number): number => {
                                      const inLevel = xpInCurrentLevel(totalXp, level)
                                        const needed = xpForLevel(level)
                                          return Math.min(inLevel / needed, 1.0)
                                          }

                                          export const levelTitle = (level: number): string => {
                                            if (level <= 5)  return 'Glyph Apprentice'
                                              if (level <= 10) return 'Key Carver'
                                                if (level <= 20) return 'Word Forger'
                                                  if (level <= 35) return 'Cipher Knight'
                                                    if (level <= 49) return 'Glyph Master'
                                                      return '🏆 Eternal Scribe'
                                                      }
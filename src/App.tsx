import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import TreeScreen from './screens/TreeScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import ShopScreen from './screens/ShopScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  return (
      <BrowserRouter>
            <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col max-w-md mx-auto relative">
                    <main className="flex-1 overflow-y-auto pb-20">
                              <Routes>
                                          <Route path="/" element={<Navigate to="/home" replace />} />
                                                      <Route path="/home" element={<HomeScreen />} />
                                                                  <Route path="/tree" element={<TreeScreen />} />
                                                                              <Route path="/leaderboard" element={<LeaderboardScreen />} />
                                                                                          <Route path="/shop" element={<ShopScreen />} />
                                                                                                      <Route path="/settings" element={<SettingsScreen />} />
                                                                                                                </Routes>
                                                                                                                        </main>
                                                                                                                                <BottomNav />
                                                                                                                                      </div>
                                                                                                                                          </BrowserRouter>
                                                                                                                                            )
                                                                                                                                            }
import React, { useState, useEffect } from 'react'
import { Cat, Heart, ShoppingBag, Clock, Sparkles } from 'lucide-react'
const BACKEND_URL = "https://tom-api-vfo3.onrender.com"; 
import HomePage from './components/HomePage.jsx'
import StudyTimer from './components/StudyTimer.jsx'
import ShopPage from './components/ShopPage.jsx'
import InventoryPage from './components/InventoryPage.jsx'
import LoginModal from './components/LoginModal.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [userId, setUserId] = useState(null)
  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    // 检查本地存储中是否有用户ID
    const savedUserId = localStorage.getItem('tomAppUserId')
    if (savedUserId) {
      setUserId(parseInt(savedUserId))
      setShowLogin(false)
    }
  }, [])

  const handleLogin = (id) => {
    setUserId(id)
    localStorage.setItem('tomAppUserId', id.toString())
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUserId(null)
    localStorage.removeItem('tomAppUserId')
    setShowLogin(true)
    setCurrentPage('home')
  }

  const NavButton = ({ page, icon: Icon, label, color }) => {
    const isActive = currentPage === page
    const colorClasses = {
      pink: isActive 
        ? 'bg-gradient-to-b from-pink-400 to-pink-500 text-white border-pink-600' 
        : 'bg-white text-pink-500 border-pink-200',
      purple: isActive 
        ? 'bg-gradient-to-b from-purple-400 to-purple-500 text-white border-purple-600' 
        : 'bg-white text-purple-500 border-purple-200',
      blue: isActive 
        ? 'bg-gradient-to-b from-blue-400 to-blue-500 text-white border-blue-600' 
        : 'bg-white text-blue-500 border-blue-200',
    }

    return (
      <button
        onClick={() => setCurrentPage(page)}
        className={`
          flex-1 py-4 rounded-2xl font-bold shadow-lg transition-all duration-200
          border-b-4 active:translate-y-1 active:border-b-0
          flex flex-col items-center gap-2
          ${colorClasses[color]}
        `}
      >
        <Icon size={28} fill={isActive ? 'currentColor' : 'none'} />
        <span className="text-sm">{label}</span>
      </button>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部装饰 */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 z-50" />
      
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* 顶部标题 */}
        <div className="text-center mb-8 animate-bounce-cute">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Cat size={40} className="text-pink-500" />
            汤姆猫学习版
            <Sparkles size={40} className="text-yellow-400 animate-sparkle" />
          </h1>
          <p className="text-gray-500 mt-2 text-sm">一起学习，一起成长！</p>
        </div>

        {/* 页面内容 */}
        <div className="mb-20">
          {currentPage === 'home' && <HomePage userId={userId} onLogout={handleLogout} />}
          {currentPage === 'study' && <StudyTimer userId={userId} />}
          {currentPage === 'shop' && <ShopPage userId={userId} />}
        </div>
      </div>

      {/* 底部导航栏 */}
      {userId && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t-4 border-pink-200 px-4 py-3 shadow-2xl">
          <div className="container mx-auto max-w-md flex gap-3">
            <NavButton page="home" icon={Cat} label="主页" color="pink" />
            <NavButton page="study" icon={Clock} label="学习" color="purple" />
            <NavButton page="shop" icon={ShoppingBag} label="商店" color="blue" />
          </div>
        </div>
      )}

      {/* 登录模态框 */}
      {showLogin && <LoginModal onLogin={handleLogin} />}
    </div>
  )
}

export default App



import React, { useState, useEffect } from 'react'
import { Diamond, Calendar, Clock, TrendingUp, LogOut, Sparkles } from 'lucide-react'
import { gameAPI, userAPI } from '../api'

function HomePage({ userId, onLogout }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkInLoading, setCheckInLoading] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const data = await gameAPI.getHomeData(userId)
      setUserData(data)
    } catch (error) {
      console.error('加载用户数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    setCheckInLoading(true)
    try {
      const result = await userAPI.checkIn(userId)
      setUserData(prev => ({
        ...prev,
        diamonds: result.user.diamondBalance
      }))
      alert('✨ ' + result.message)
    } catch (error) {
      alert('❌ ' + (error.error || '签到失败'))
    } finally {
      setCheckInLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <div className="kawaii-card bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              👋 你好，{userData?.username || '用户'}！
            </h2>
            <p className="text-sm text-gray-500">继续加油学习吧！</p>
          </div>
          <button
            onClick={onLogout}
            className="p-3 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all"
            title="退出登录"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* 钻石显示 */}
        <div className="bg-white rounded-2xl p-4 shadow-md border-3 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="kawaii-icon bg-gradient-to-br from-yellow-300 to-yellow-500">
                <Diamond size={24} className="text-white" fill="currentColor" />
              </div>
              <div>
                <p className="text-sm text-gray-500">我的钻石</p>
                <p className="text-3xl font-bold text-gray-800 animate-pulse">
                  {userData?.diamonds || 0}
                </p>
              </div>
            </div>
            <Sparkles className="text-yellow-400 animate-sparkle" size={32} />
          </div>
        </div>
      </div>

      {/* 每日签到 */}
      <div className="kawaii-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="kawaii-icon bg-gradient-to-br from-blue-300 to-blue-500">
            <Calendar size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">每日签到</h3>
            <p className="text-sm text-gray-500">每天签到获得 10 钻石</p>
          </div>
        </div>
        <button
          onClick={handleCheckIn}
          disabled={checkInLoading}
          className="kawaii-button-blue w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calendar size={20} />
          {checkInLoading ? '签到中...' : '立即签到'}
        </button>
      </div>

      {/* 学习统计 */}
      <div className="kawaii-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="kawaii-icon bg-gradient-to-br from-purple-300 to-purple-500">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-gray-800">学习统计</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center border-2 border-pink-200">
            <Clock size={32} className="mx-auto mb-2 text-pink-500" />
            <p className="text-2xl font-bold text-gray-800">
              {userData?.totalStudyMinutes || 0}
            </p>
            <p className="text-xs text-gray-500">学习分钟</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border-2 border-purple-200">
            <Sparkles size={32} className="mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-gray-800">
              {Math.floor((userData?.totalStudyMinutes || 0) / 10)}
            </p>
            <p className="text-xs text-gray-500">学习奖励</p>
          </div>
        </div>
      </div>

      {/* 汤姆猫展示 */}
      <div className="kawaii-card bg-gradient-to-br from-orange-50 to-yellow-50">
        <h3 className="font-bold text-gray-800 mb-4 text-center">我的汤姆猫</h3>
        <div className="flex justify-center">
          <div className="relative animate-float">
            <div className="text-9xl">🐱</div>
            {/* 这里可以根据用户装备的衣服显示不同的装饰 */}
            <div className="absolute top-0 right-0 text-4xl animate-bounce-cute">✨</div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          去商店给汤姆猫买新衣服吧！
        </p>
      </div>
    </div>
  )
}

export default HomePage


import React, { useState } from 'react'
import { User, Sparkles, Heart } from 'lucide-react'
import { userAPI } from '../api'

function LoginModal({ onLogin }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('请输入用户名！')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await userAPI.getUserByUsername(username)
      onLogin(user.id)
    } catch (err) {
      setError('用户不存在，请先注册！')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!username.trim()) {
      setError('请输入用户名！')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await userAPI.createUser(username)
      onLogin(user.id)
    } catch (err) {
      setError(err.error || '注册失败，请重试！')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="kawaii-card max-w-md w-full animate-bounce-cute">
        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4 shadow-xl">
            <User size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            欢迎来到汤姆猫学习版！
          </h2>
          <p className="text-gray-500 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-yellow-400" />
            开始你的学习之旅
            <Heart size={16} className="text-pink-400" />
          </p>
        </div>

        {/* 输入框 */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            👤 用户名
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="请输入你的名字..."
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border-3 border-pink-200 
                     focus:border-pink-400 focus:outline-none focus:ring-4 
                     focus:ring-pink-100 transition-all duration-200
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm">
            ❌ {error}
          </div>
        )}

        {/* 按钮组 */}
        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="kawaii-button-purple flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <User size={20} />
            登录
          </button>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="kawaii-button-pink flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={20} />
            注册
          </button>
        </div>

        {/* 底部提示 */}
        <div className="mt-4 text-center text-xs text-gray-400">
          💡 新用户注册即送 50 钻石！
        </div>
      </div>
    </div>
  )
}

export default LoginModal


import { useState } from 'react';
import { Heart, User, Sparkles } from 'lucide-react';

const LoginModal = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('login'); // 'login' 或 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🎯 智能ID生成器：根据用户名生成固定ID
  const generateUserId = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash) % 100000 + 1; // 生成1-100000的正整数
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('请输入用户名！');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = generateUserId(username.trim());

      if (mode === 'register') {
        // 📝 注册模式：直接创建用户并登录
        const response = await fetch('/api/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: userId,
            username: username.trim() 
          })
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.message && data.message.includes('已存在')) {
            setError('用户名已被注册，请尝试登录！');
            setMode('login'); // 自动切换到登录模式
          } else {
            throw new Error(data.message || '注册失败');
          }
          setLoading(false);
          return;
        }

        // 注册成功，直接登录
        onLogin(userId, username.trim());
      } else {
        // 🔑 登录模式：检查用户是否存在
        const response = await fetch(`/api/game/home/${userId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('用户不存在，请先注册！');
            setMode('register'); // 自动切换到注册模式
          } else {
            throw new Error('登录失败');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        // 验证用户名是否匹配
        if (data.username && data.username !== username.trim()) {
          setError('用户名或密码错误！');
          setLoading(false);
          return;
        }

        // 登录成功
        onLogin(userId, username.trim());
      }
    } catch (err) {
      console.error('登录/注册错误:', err);
      setError(err.message || '网络错误，请重试！');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 🌫️ 背景遮罩 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      {/* 🎀 登录卡片 - 纯白背景，不透明 */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-4 border-pink-200">
        {/* ✨ 顶部装饰 */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-4 shadow-lg">
            <Heart size={40} fill="white" className="text-white" />
          </div>
        </div>

        {/* 📝 标题 */}
        <h2 className="text-3xl font-black text-center mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          {mode === 'login' ? '欢迎回来' : '加入我们'}
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {mode === 'login' ? '和汤姆猫一起学习吧！' : '创建你的专属汤姆猫账号'}
        </p>

        {/* 🔄 模式切换按钮 */}
        <div className="flex gap-2 mb-6 bg-pink-50 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
              mode === 'login'
                ? 'bg-white text-pink-600 shadow-md'
                : 'text-gray-500 hover:text-pink-500'
            }`}
          >
            <User size={16} className="inline mr-1" />
            登录
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
              mode === 'register'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-500 hover:text-purple-500'
            }`}
          >
            <Sparkles size={16} className="inline mr-1" />
            注册
          </button>
        </div>

        {/* 📋 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 输入框 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入你的名字 (如: 55)"
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              💡 提示：相同用户名会生成相同账号ID
            </p>
          </div>

          {/* ⚠️ 错误提示 */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* 🎯 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-b from-pink-400 to-pink-600 border-b-4 border-pink-700 hover:from-pink-500 hover:to-pink-700'
                : 'bg-gradient-to-b from-purple-400 to-purple-600 border-b-4 border-purple-700 hover:from-purple-500 hover:to-purple-700'
            } active:translate-y-1 active:border-b-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? '处理中...' : mode === 'login' ? '🎮 开始游戏' : '✨ 创建账号'}
          </button>
        </form>

        {/* 📌 底部说明 */}
        <p className="text-center text-xs text-gray-400 mt-4">
          {mode === 'login' 
            ? '第一次使用？点击上方"注册"按钮' 
            : '已有账号？点击上方"登录"按钮'
          }
        </p>
      </div>
    </div>
  );
};

export default LoginModal;


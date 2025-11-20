import React, { useState, useEffect, useRef } from 'react'
import { Clock, Play, Pause, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { studyAPI } from '../api'

function StudyTimer({ userId }) {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [earnedDiamonds, setEarnedDiamonds] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleComplete()
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, minutes, seconds])

  const handleStart = async () => {
    if (!isRunning && !sessionId) {
      try {
        const result = await studyAPI.startStudy(userId)
        setSessionId(result.session.id)
        setIsRunning(true)
      } catch (error) {
        alert('❌ 启动学习会话失败：' + (error.error || error))
      }
    } else {
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setMinutes(25)
    setSeconds(0)
    setSessionId(null)
  }

  const handleComplete = async () => {
    setIsRunning(false)
    
    if (sessionId) {
      try {
        const result = await studyAPI.endStudy(sessionId)
        setEarnedDiamonds(result.session.diamondsEarned || 0)
        setShowCelebration(true)
        setSessionId(null)
        
        // 3秒后自动关闭庆祝弹窗
        setTimeout(() => {
          setShowCelebration(false)
          handleReset()
        }, 3000)
      } catch (error) {
        alert('❌ 结束学习会话失败：' + (error.error || error))
      }
    }
  }

  const progress = ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100

  return (
    <div className="space-y-6">
      {/* 计时器卡片 */}
      <div className="kawaii-card bg-gradient-to-br from-purple-50 to-pink-50">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          <Clock className="inline mr-2" size={28} />
          专注学习计时器
        </h2>

        {/* 圆形进度条 */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* 外圈装饰 */}
          <div className="absolute inset-0 rounded-full border-8 border-pink-100"></div>
          
          {/* 进度圈 */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="currentColor"
              strokeWidth="16"
              fill="none"
              className="text-pink-200"
            />
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="url(#gradient)"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 112}`}
              strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* 中心时间显示 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {isRunning ? '正在学习中...' : '准备开始'}
            </p>
          </div>

          {/* 装饰星星 */}
          {isRunning && (
            <>
              <Sparkles className="absolute top-4 right-4 text-yellow-400 animate-sparkle" size={24} />
              <Sparkles className="absolute bottom-4 left-4 text-pink-400 animate-sparkle" size={20} />
            </>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="kawaii-button-purple flex-1"
            >
              <Play size={20} fill="currentColor" />
              {sessionId ? '继续' : '开始学习'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="kawaii-button-pink flex-1"
            >
              <Pause size={20} fill="currentColor" />
              暂停
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="kawaii-button bg-gradient-to-b from-gray-300 to-gray-400 
                     text-gray-700 border-gray-500 hover:from-gray-400 hover:to-gray-500"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* 提示 */}
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
          <p className="text-sm text-center text-gray-600">
            💡 每学习 10 分钟，获得 1 钻石奖励
          </p>
        </div>
      </div>

      {/* 快捷时间设置 */}
      <div className="kawaii-card">
        <h3 className="font-bold text-gray-800 mb-4">⏱️ 快捷设置</h3>
        <div className="grid grid-cols-4 gap-3">
          {[5, 10, 25, 45].map((min) => (
            <button
              key={min}
              onClick={() => {
                if (!isRunning) {
                  setMinutes(min)
                  setSeconds(0)
                }
              }}
              disabled={isRunning}
              className={`
                py-3 rounded-xl font-bold transition-all border-b-3
                ${minutes === min && !isRunning
                  ? 'bg-gradient-to-b from-pink-400 to-pink-500 text-white border-pink-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-pink-400'
                }
                ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {min}分
            </button>
          ))}
        </div>
      </div>

      {/* 庆祝弹窗 */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-bounce-cute">
          <div className="kawaii-card max-w-sm text-center">
            <div className="text-6xl mb-4 animate-bounce-cute">🎉</div>
            <Trophy className="mx-auto mb-4 text-yellow-500 animate-sparkle" size={48} />
            <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
              学习完成！
            </h3>
            <p className="text-gray-600 mb-4">恭喜你完成了本次学习！</p>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-3 border-yellow-300">
              <p className="text-sm text-gray-600 mb-1">获得奖励</p>
              <p className="text-4xl font-bold text-yellow-600">
                💎 {earnedDiamonds} 钻石
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyTimer


import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    throw error.response?.data || error.message
  }
)

export const userAPI = {
  // 创建用户
  createUser: (username) => api.post('/user', { username }),
  
  // 获取用户信息
  getUser: (userId) => api.get(`/user/${userId}`),
  
  // 通过用户名获取用户
  getUserByUsername: (username) => api.get(`/user/username/${username}`),
  
  // 每日签到
  checkIn: (userId) => api.post(`/user/${userId}/checkin`),
}

export const gameAPI = {
  // 获取首页数据（不存在则自动创建）
  getHomeData: (userId) => api.get(`/game/home/${userId}`),
  
  // 增加钻石
  addDiamonds: (userId, amount) => api.post(`/game/diamonds/${userId}/add`, { amount }),
  
  // 健康检查
  ping: () => api.get('/game/ping'),
}

export const studyAPI = {
  // 开始学习
  startStudy: (userId) => api.post('/study/start', { userId }),
  
  // 结束学习
  endStudy: (sessionId) => api.post(`/study/end/${sessionId}`),
  
  // 获取学习历史
  getHistory: (userId) => api.get(`/study/history/${userId}`),
}

export const shopAPI = {
  // 获取所有商品
  getAllItems: () => api.get('/items'),
  
  // 按类型获取商品
  getItemsByType: (type) => api.get(`/items/type/${type}`),
  
  // 购买商品
  purchaseItem: (userId, itemId) => api.post('/shop/purchase', { userId, itemId }),
  
  // 获取用户背包
  getInventory: (userId) => api.get(`/shop/inventory/${userId}`),
  
  // 装备物品
  equipItem: (userId, inventoryId) => api.post('/shop/equip', { userId, inventoryId }),
}

export default api



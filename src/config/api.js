/**
 * API 配置文件
 * 
 * 自动识别环境：
 * - 开发环境：使用 localhost:8081（通过 proxy）
 * - 生产环境：使用 Render 部署的后端地址
 */

// 从环境变量获取 API 地址
// 在 Vercel 部署时设置：REACT_APP_API_URL=https://你的后端.onrender.com
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * 获取完整的 API 地址
 * @param {string} endpoint - API 端点，如 '/api/game/ping'
 * @returns {string} 完整的 URL
 */
export const getApiUrl = (endpoint) => {
  // 如果有配置 API_BASE_URL，就使用完整地址
  // 否则使用相对路径（开发环境通过 proxy 转发）
  return API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
};

export default API_BASE_URL;


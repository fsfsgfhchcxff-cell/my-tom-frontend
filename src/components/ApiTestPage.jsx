import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import { getApiUrl } from '../config/api';

function ApiTestPage() {
  const [tests, setTests] = useState([]);
  const [testing, setTesting] = useState(false);
  const [backendData, setBackendData] = useState(null);

  const runTests = async () => {
    setTesting(true);
    setTests([]);
    const results = [];

    // 测试1: Ping 后端
    try {
      const response = await fetch(getApiUrl('/api/game/ping'));
      const data = await response.json();
      results.push({
        name: '🏓 Ping 测试',
        url: getApiUrl('/api/game/ping'),
        success: response.ok,
        data: data,
        message: response.ok ? '后端连接正常！' : '后端响应失败'
      });
    } catch (error) {
      results.push({
        name: '🏓 Ping 测试',
        url: '/api/game/ping',
        success: false,
        error: error.message,
        message: '无法连接到后端！请确保后端在 8081 端口运行'
      });
    }

    // 测试2: 获取主页数据
    try {
      const userId = 1;
      const response = await fetch(getApiUrl(`/api/game/home/${userId}`));
      const data = await response.json();
      results.push({
        name: '🏠 主页数据',
        url: getApiUrl(`/api/game/home/${userId}`),
        success: response.ok,
        data: data,
        message: response.ok ? '成功获取用户数据！' : '获取失败'
      });
      if (response.ok) {
        setBackendData(data);
      }
    } catch (error) {
      results.push({
        name: '🏠 主页数据',
        url: `/api/game/home/${userId}`,
        success: false,
        error: error.message,
        message: '获取用户数据失败'
      });
    }

    // 测试3: 获取商品列表
    try {
      const response = await fetch(getApiUrl('/api/items'));
      const data = await response.json();
      results.push({
        name: '🛍️ 商品列表',
        url: getApiUrl('/api/items'),
        success: response.ok,
        data: `${data.length} 件商品`,
        message: response.ok ? `成功获取 ${data.length} 件商品！` : '获取失败'
      });
    } catch (error) {
      results.push({
        name: '🛍️ 商品列表',
        url: '/api/items',
        success: false,
        error: error.message,
        message: '获取商品列表失败'
      });
    }

    setTests(results);
    setTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 标题 */}
      <div className="bg-white rounded-3xl shadow-lg border-4 border-purple-100 p-6 mb-6 text-center">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
          🔍 API 连接测试
        </h2>
        <p className="text-gray-500 font-semibold">检查前后端是否正确连接</p>
      </div>

      {/* 重要提示 */}
      <div className="bg-yellow-50 border-4 border-yellow-200 rounded-3xl p-6 mb-6">
        <h3 className="text-xl font-bold text-yellow-800 mb-3 flex items-center gap-2">
          ⚠️ 测试前请确认
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 font-bold">1.</span>
            <span className="font-semibold">后端已启动（运行 <code className="bg-yellow-100 px-2 py-1 rounded">快速启动.bat</code>）</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 font-bold">2.</span>
            <span className="font-semibold">后端运行在 <code className="bg-yellow-100 px-2 py-1 rounded">http://localhost:8081</code></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 font-bold">3.</span>
            <span className="font-semibold">看到 "Started TomLearningAppApplication" 提示</span>
          </li>
        </ul>
      </div>

      {/* 测试按钮 */}
      <div className="text-center mb-6">
        <button
          onClick={runTests}
          disabled={testing}
          className="bg-gradient-to-b from-blue-400 to-blue-500 text-white px-10 py-4 rounded-2xl border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all font-extrabold text-xl shadow-xl flex items-center justify-center gap-3 hover:from-blue-500 hover:to-blue-600 mx-auto disabled:opacity-50"
        >
          {testing ? (
            <>
              <Loader className="animate-spin" size={28} />
              测试中...
            </>
          ) : (
            <>
              <RefreshCw size={28} />
              开始测试
            </>
          )}
        </button>
      </div>

      {/* 测试结果 */}
      {tests.length > 0 && (
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={index}
              className={`rounded-3xl shadow-lg border-4 p-6 ${
                test.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-3 ${
                  test.success ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {test.success ? (
                    <CheckCircle className="text-white" size={32} />
                  ) : (
                    <XCircle className="text-white" size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {test.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-mono bg-white px-3 py-2 rounded-lg mb-2">
                    {test.url}
                  </p>
                  <p className={`font-semibold mb-3 ${
                    test.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {test.message}
                  </p>
                  {test.data && (
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                      <p className="text-xs text-gray-500 mb-2 font-semibold">返回数据：</p>
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {test.error && (
                    <div className="bg-red-100 rounded-xl p-4 border-2 border-red-300">
                      <p className="text-xs text-red-600 mb-2 font-semibold">错误信息：</p>
                      <p className="text-sm text-red-700 font-mono">{test.error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 后端数据预览 */}
      {backendData && (
        <div className="mt-6 bg-white rounded-3xl shadow-lg border-4 border-blue-100 p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            📊 后端返回的完整数据
          </h3>
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <pre className="text-sm overflow-x-auto text-gray-800">
              {JSON.stringify(backendData, null, 2)}
            </pre>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-1">用户ID</p>
              <p className="text-2xl font-bold text-purple-600">
                {backendData.userId || 'N/A'}
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
              <p className="text-sm text-gray-600 mb-1">钻石数量</p>
              <p className="text-2xl font-bold text-pink-600">
                💎 {backendData.diamonds || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 帮助信息 */}
      <div className="mt-6 bg-blue-50 border-4 border-blue-200 rounded-3xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">💡 如果测试失败</h3>
        <ol className="space-y-2 text-gray-700 list-decimal list-inside">
          <li className="font-semibold">确认后端已启动（双击 <code className="bg-blue-100 px-2 py-1 rounded">快速启动.bat</code>）</li>
          <li className="font-semibold">检查后端控制台是否显示 "Started TomLearningAppApplication"</li>
          <li className="font-semibold">尝试在浏览器访问 <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:8081/api/game/ping</code></li>
          <li className="font-semibold">检查防火墙是否阻止了 8081 端口</li>
          <li className="font-semibold">重启前端：按 Ctrl+C 停止，然后再次运行 <code className="bg-blue-100 px-2 py-1 rounded">npm start</code></li>
        </ol>
      </div>
    </div>
  );
}

export default ApiTestPage;


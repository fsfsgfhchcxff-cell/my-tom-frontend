import React, { useState, useEffect } from 'react';
import { ShoppingBag, Gem, Sparkles } from 'lucide-react';
import { getApiUrl } from '../config/api';

function ShopPage({ userId }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [userDiamonds, setUserDiamonds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPurchaseEffect, setShowPurchaseEffect] = useState(false);

  useEffect(() => {
    loadItems();
    loadUserData();
  }, [userId]);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, items]);

  const loadItems = async () => {
    try {
      const response = await fetch(getApiUrl('/api/items'));
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('加载商品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/game/home/${userId}`));
      if (response.ok) {
        const data = await response.json();
        setUserDiamonds(data.diamonds);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  };

  const filterItems = () => {
    if (selectedCategory === 'ALL') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === selectedCategory));
    }
  };

  const handlePurchase = async (item) => {
    if (userDiamonds < item.price) {
      alert('钻石不足啦~ 去学习赚钻石吧！💎');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/shop/purchase'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId: item.id })
      });

      if (response.ok) {
        setUserDiamonds(userDiamonds - item.price);
        setShowPurchaseEffect(true);
        setTimeout(() => setShowPurchaseEffect(false), 2000);
        // 播放购买音效（可选）
        playPurchaseSound();
      } else {
        const error = await response.json();
        alert(error.error || '购买失败~ 请重试');
      }
    } catch (error) {
      console.error('购买失败:', error);
      alert('购买失败~ 请重试 (｡•́︿•̀｡)');
    }
  };

  const playPurchaseSound = () => {
    // 这里可以添加音效播放逻辑
    console.log('✨ 购买成功音效');
  };

  const getItemEmoji = (name) => {
    const match = name.match(/[\u{1F300}-\u{1F9FF}]/u);
    return match ? match[0] : '🎁';
  };

  const categories = [
    { id: 'ALL', name: '全部', emoji: '🌟', color: 'purple' },
    { id: 'FOOD', name: '食物', emoji: '🍔', color: 'pink' },
    { id: 'CLOTH', name: '衣服', emoji: '👕', color: 'blue' },
    { id: 'FURNITURE', name: '家具', emoji: '🛋️', color: 'yellow' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-6xl animate-bounce">🛍️</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* 顶部钻石栏 */}
      <div className="bg-white rounded-3xl shadow-lg border-4 border-purple-100 p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-3 border-4 border-white shadow-md">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800">梦幻商店</h2>
            <p className="text-sm text-gray-500 font-semibold">让汤姆猫更可爱~ ✨</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl px-5 py-3 border-2 border-purple-200">
          <div className="flex items-center gap-2">
            <Gem className="text-purple-500" size={20} fill="currentColor" />
            <span className="text-2xl font-extrabold text-purple-600">{userDiamonds}</span>
          </div>
        </div>
      </div>

      {/* 分类选择 */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            active={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </div>

      {/* 商品列表 */}
      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            emoji={getItemEmoji(item.name)}
            canAfford={userDiamonds >= item.price}
            onPurchase={() => handlePurchase(item)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎈</div>
          <p className="text-gray-500 font-semibold">这个分类还没有商品哦~</p>
        </div>
      )}

      {/* 购买成功特效 */}
      {showPurchaseEffect && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-8xl animate-ping">✨</div>
          <div className="absolute text-4xl font-extrabold text-pink-500 animate-bounce">
            购买成功！
          </div>
        </div>
      )}
    </div>
  );
}

// 分类按钮
function CategoryButton({ category, active, onClick }) {
  const colorClasses = {
    purple: 'from-purple-400 to-purple-500 border-purple-600',
    pink: 'from-pink-400 to-pink-500 border-pink-600',
    blue: 'from-blue-400 to-blue-500 border-blue-600',
    yellow: 'from-yellow-400 to-yellow-500 border-yellow-600',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
        active
          ? `bg-gradient-to-b ${colorClasses[category.color]} border-b-4 text-white shadow-lg scale-110`
          : 'bg-white text-gray-600 border-2 border-gray-200 hover:scale-105'
      }`}
    >
      <span className="text-xl">{category.emoji}</span>
      <span>{category.name}</span>
    </button>
  );
}

// 商品卡片
function ItemCard({ item, emoji, canAfford, onPurchase }) {
  const typeColors = {
    FOOD: 'from-pink-400 to-rose-400 border-pink-500',
    CLOTH: 'from-blue-400 to-cyan-400 border-blue-500',
    FURNITURE: 'from-yellow-400 to-orange-400 border-yellow-500',
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border-4 border-gray-100 overflow-hidden hover:scale-105 transition-all kawaii-card">
      {/* 商品图片区域 */}
      <div className={`bg-gradient-to-br ${typeColors[item.type]} p-6 border-b-4 ${typeColors[item.type].split(' ')[1]}`}>
        <div className="text-6xl text-center animate-float">{emoji}</div>
      </div>

      {/* 商品信息 */}
      <div className="p-4">
        <h3 className="font-extrabold text-gray-800 text-center mb-2 text-sm">
          {item.name.replace(emoji, '').trim()}
        </h3>
        {item.description && (
          <p className="text-xs text-gray-500 text-center mb-3 font-semibold line-clamp-2">
            {item.description}
          </p>
        )}

        {/* 购买按钮 */}
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            canAfford
              ? 'bg-gradient-to-b from-purple-400 to-purple-500 text-white border-b-4 border-purple-600 active:border-b-0 active:translate-y-1 hover:from-purple-500 hover:to-purple-600 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Gem size={16} fill="currentColor" />
          <span>{item.price}</span>
        </button>
      </div>
    </div>
  );
}

export default ShopPage;


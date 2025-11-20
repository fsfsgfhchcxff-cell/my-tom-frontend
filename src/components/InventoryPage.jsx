import React, { useState, useEffect } from 'react';
import { Package, Sparkles, Shirt, UtensilsCrossed, Armchair, CheckCircle } from 'lucide-react';
import { getApiUrl } from '../config/api';

function InventoryPage({ userId }) {
  const [inventory, setInventory] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    loadInventory();
    loadItems();
  }, [userId]);

  const loadInventory = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/shop/inventory/${userId}`));
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('加载背包失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      const response = await fetch(getApiUrl('/api/items'));
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('加载商品列表失败:', error);
    }
  };

  const handleEquip = async (inventoryItem) => {
    try {
      const response = await fetch(getApiUrl('/api/shop/equip'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, inventoryId: inventoryItem.id })
      });

      if (response.ok) {
        loadInventory(); // 重新加载背包
      } else {
        const error = await response.json();
        alert(error.error || '操作失败~ 请重试');
      }
    } catch (error) {
      console.error('装备失败:', error);
      alert('操作失败~ 请重试 (｡•́︿•̀｡)');
    }
  };

  const getItemDetails = (itemId) => {
    return items.find(item => item.id === itemId);
  };

  const getItemEmoji = (name) => {
    if (!name) return '🎁';
    const match = name.match(/[\u{1F300}-\u{1F9FF}]/u);
    return match ? match[0] : '🎁';
  };

  const filteredInventory = selectedCategory === 'ALL'
    ? inventory
    : inventory.filter(inv => {
        const item = getItemDetails(inv.itemId);
        return item && item.type === selectedCategory;
      });

  const categories = [
    { id: 'ALL', name: '全部', icon: <Package size={20} />, color: 'purple' },
    { id: 'FOOD', name: '食物', icon: <UtensilsCrossed size={20} />, color: 'pink' },
    { id: 'CLOTH', name: '衣服', icon: <Shirt size={20} />, color: 'blue' },
    { id: 'FURNITURE', name: '家具', icon: <Armchair size={20} />, color: 'yellow' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-6xl animate-bounce">🎒</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* 顶部标题 */}
      <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-100 p-6 mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-blue-400 to-purple-400 rounded-full p-3 border-4 border-white shadow-md">
            <Package className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">我的背包</h2>
        </div>
        <p className="text-gray-500 font-semibold">
          共有 <span className="text-blue-500 font-extrabold">{inventory.length}</span> 件物品 ✨
        </p>
      </div>

      {/* 分类选择 */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            category={category}
            active={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </div>

      {/* 背包物品列表 */}
      {filteredInventory.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredInventory.map((invItem) => {
            const itemDetails = getItemDetails(invItem.itemId);
            if (!itemDetails) return null;

            return (
              <InventoryItemCard
                key={invItem.id}
                inventoryItem={invItem}
                itemDetails={itemDetails}
                emoji={getItemEmoji(itemDetails.name)}
                onEquip={() => handleEquip(invItem)}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg border-4 border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🎈</div>
          <p className="text-gray-500 font-semibold mb-2">背包空空如也~</p>
          <p className="text-sm text-gray-400">快去商店购买道具吧！</p>
        </div>
      )}
    </div>
  );
}

// 分类标签
function CategoryTab({ category, active, onClick }) {
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
      {category.icon}
      <span>{category.name}</span>
    </button>
  );
}

// 背包物品卡片
function InventoryItemCard({ inventoryItem, itemDetails, emoji, onEquip }) {
  const typeColors = {
    FOOD: 'from-pink-400 to-rose-400 border-pink-500',
    CLOTH: 'from-blue-400 to-cyan-400 border-blue-500',
    FURNITURE: 'from-yellow-400 to-orange-400 border-yellow-500',
  };

  const isFood = itemDetails.type === 'FOOD';
  const buttonText = isFood ? '使用' : (inventoryItem.isEquipped ? '已装备' : '装备');

  return (
    <div className="bg-white rounded-3xl shadow-lg border-4 border-gray-100 overflow-hidden hover:scale-105 transition-all kawaii-card relative">
      {/* 已装备标签 */}
      {inventoryItem.isEquipped && !isFood && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-md">
          <CheckCircle size={14} fill="currentColor" />
          装备中
        </div>
      )}

      {/* 数量标签（仅食物） */}
      {isFood && inventoryItem.quantity > 1 && (
        <div className="absolute top-2 right-2 z-10 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
          {inventoryItem.quantity}
        </div>
      )}

      {/* 物品图片区域 */}
      <div className={`bg-gradient-to-br ${typeColors[itemDetails.type]} p-6 border-b-4 ${typeColors[itemDetails.type].split(' ')[1]}`}>
        <div className="text-6xl text-center animate-float">{emoji}</div>
      </div>

      {/* 物品信息 */}
      <div className="p-4">
        <h3 className="font-extrabold text-gray-800 text-center mb-2 text-sm">
          {itemDetails.name.replace(emoji, '').trim()}
        </h3>

        {itemDetails.description && (
          <p className="text-xs text-gray-500 text-center mb-3 font-semibold line-clamp-2">
            {itemDetails.description}
          </p>
        )}

        {/* 操作按钮 */}
        <button
          onClick={onEquip}
          disabled={inventoryItem.isEquipped && !isFood}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            inventoryItem.isEquipped && !isFood
              ? 'bg-green-100 text-green-600 border-2 border-green-300'
              : 'bg-gradient-to-b from-purple-400 to-purple-500 text-white border-b-4 border-purple-600 active:border-b-0 active:translate-y-1 hover:from-purple-500 hover:to-purple-600 shadow-md'
          }`}
        >
          <Sparkles size={16} />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}

export default InventoryPage;


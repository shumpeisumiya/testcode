import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Package, Calendar, Truck, Users, DollarSign, CheckCircle, XCircle, Menu } from 'lucide-react';

const ConstructionRentalApp = () => {
  const [view, setView] = useState('user'); // 'user' or 'admin'
  const [orders, setOrders] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationStatus, setConversationStatus] = useState('idle');
  const [currentOrder, setCurrentOrder] = useState(null);
  const conversationRef = useRef(null);

  // Load orders from storage
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const result = await window.storage.list('order:');
      if (result && result.keys) {
        const orderData = await Promise.all(
          result.keys.map(async (key) => {
            const data = await window.storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setOrders(orderData.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.log('注文データの読み込み:', error);
    }
  };

  const saveOrder = async (orderData) => {
    try {
      const orderId = `order:${Date.now()}`;
      await window.storage.set(orderId, JSON.stringify(orderData));
      await loadOrders();
    } catch (error) {
      console.error('注文の保存に失敗:', error);
    }
  };

  const startConversation = async () => {
    try {
      setConversationStatus('connecting');
      
      // ElevenLabs Conversational AI の初期化
      const conversation = await window.elevenlabs.Conversation.startSession({
        agentId: 'agent_8901kdnrdyhtfx7ahkhc3qy4xd1f',
        onConnect: () => {
          setIsConnected(true);
          setConversationStatus('connected');
        },
        onDisconnect: () => {
          setIsConnected(false);
          setConversationStatus('idle');
        },
        onMessage: (message) => {
          // エージェントからのメッセージを処理
          console.log('Agent message:', message);
        },
        onMetadata: (metadata) => {
          // メタデータから注文情報を抽出
          if (metadata.order) {
            const order = {
              ...metadata.order,
              timestamp: Date.now(),
              status: 'pending',
              id: `ORD-${Date.now()}`
            };
            setCurrentOrder(order);
            saveOrder(order);
          }
        }
      });
      
      conversationRef.current = conversation;
    } catch (error) {
      console.error('接続エラー:', error);
      setConversationStatus('error');
      alert('音声エージェントへの接続に失敗しました。ElevenLabsのエージェントIDを設定してください。');
    }
  };

  const endConversation = () => {
    if (conversationRef.current) {
      conversationRef.current.endSession();
      conversationRef.current = null;
    }
    setIsConnected(false);
    setConversationStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        .construction-title {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.05em;
        }
        
        .construction-text {
          font-family: 'Rajdhani', sans-serif;
        }
        
        .warning-stripe {
          background: repeating-linear-gradient(
            45deg,
            #f59e0b,
            #f59e0b 20px,
            #18181b 20px,
            #18181b 40px
          );
          height: 8px;
        }
        
        .glow-orange {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }
        
        .glow-orange-strong {
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.6), 0 0 60px rgba(245, 158, 11, 0.3);
        }
        
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(245, 158, 11, 0.6), 0 0 80px rgba(245, 158, 11, 0.3);
          }
        }
        
        .slide-in {
          animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .grid-bg {
          background-image: 
            linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Header with warning stripe */}
      <div className="warning-stripe"></div>
      
      {/* Navigation */}
      <div className="bg-zinc-900/90 backdrop-blur-sm border-b-2 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="w-10 h-10 text-amber-500" strokeWidth={2.5} />
              <div>
                <h1 className="construction-title text-3xl text-amber-500">建機レンタル</h1>
                <p className="construction-text text-xs text-zinc-400 tracking-wider">CONSTRUCTION EQUIPMENT RENTAL</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setView('user')}
                className={`construction-text px-6 py-2 rounded-md transition-all font-semibold tracking-wide ${
                  view === 'user'
                    ? 'bg-amber-500 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                注文画面
              </button>
              <button
                onClick={() => setView('admin')}
                className={`construction-text px-6 py-2 rounded-md transition-all font-semibold tracking-wide ${
                  view === 'admin'
                    ? 'bg-amber-500 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                管理画面
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === 'user' ? (
        <UserView
          isConnected={isConnected}
          conversationStatus={conversationStatus}
          currentOrder={currentOrder}
          startConversation={startConversation}
          endConversation={endConversation}
        />
      ) : (
        <AdminView orders={orders} loadOrders={loadOrders} />
      )}
    </div>
  );
};

const UserView = ({ isConnected, conversationStatus, currentOrder, startConversation, endConversation }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Main Voice Interface */}
      <div className="bg-zinc-800 rounded-2xl border-2 border-zinc-700 overflow-hidden slide-in">
        <div className="grid-bg bg-zinc-900/50 px-8 py-6 border-b-2 border-amber-500">
          <h2 className="construction-title text-2xl text-amber-500 mb-2">音声注文システム</h2>
          <p className="construction-text text-zinc-400">AIアシスタントと対話して建機をレンタル</p>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col items-center justify-center py-12">
            {/* Voice Status Indicator */}
            <div className={`relative mb-8 ${isConnected ? 'pulse-glow' : ''}`}>
              <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
                isConnected 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 glow-orange-strong' 
                  : 'bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-zinc-600'
              }`}>
                <Phone className={`w-24 h-24 ${isConnected ? 'text-zinc-900' : 'text-zinc-500'}`} strokeWidth={2} />
              </div>
              
              {isConnected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-4 border-amber-500 animate-ping opacity-20"></div>
                </div>
              )}
            </div>

            {/* Status Text */}
            <div className="text-center mb-8">
              <h3 className="construction-text text-2xl font-bold text-white mb-2">
                {conversationStatus === 'idle' && '音声注文を開始'}
                {conversationStatus === 'connecting' && '接続中...'}
                {conversationStatus === 'connected' && '通話中'}
                {conversationStatus === 'error' && 'エラーが発生しました'}
              </h3>
              <p className="construction-text text-zinc-400">
                {conversationStatus === 'idle' && 'ボタンを押してAIアシスタントと対話を開始してください'}
                {conversationStatus === 'connecting' && 'AIアシスタントに接続しています'}
                {conversationStatus === 'connected' && 'レンタルしたい建機について話してください'}
                {conversationStatus === 'error' && '接続に失敗しました。もう一度お試しください'}
              </p>
            </div>

            {/* Action Button */}
            {!isConnected ? (
              <button
                onClick={startConversation}
                disabled={conversationStatus === 'connecting'}
                className="construction-text bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold px-12 py-5 rounded-xl text-xl tracking-wide transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed glow-orange"
              >
                {conversationStatus === 'connecting' ? '接続中...' : '音声注文を開始'}
              </button>
            ) : (
              <button
                onClick={endConversation}
                className="construction-text bg-red-600 hover:bg-red-500 text-white font-bold px-12 py-5 rounded-xl text-xl tracking-wide transition-all transform hover:scale-105"
              >
                <PhoneOff className="w-6 h-6 inline mr-2" />
                通話を終了
              </button>
            )}
          </div>

          {/* Current Order Display */}
          {currentOrder && (
            <div className="mt-8 bg-zinc-900/50 border-2 border-amber-500/50 rounded-xl p-6 slide-in">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="construction-text text-xl font-bold text-white">注文が確定しました</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 construction-text text-zinc-300">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">建機名</p>
                  <p className="font-semibold">{currentOrder.equipment || '未設定'}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">レンタル期間</p>
                  <p className="font-semibold">{currentOrder.duration || '未設定'}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">配送先</p>
                  <p className="font-semibold">{currentOrder.location || '未設定'}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">注文番号</p>
                  <p className="font-semibold text-amber-500">{currentOrder.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: Phone, title: '1. 通話開始', desc: 'ボタンを押して対話開始' },
              { icon: Package, title: '2. 建機を選択', desc: '必要な建機を音声で伝える' },
              { icon: CheckCircle, title: '3. 注文確定', desc: '内容確認後に自動で注文' }
            ].map((step, idx) => (
              <div key={idx} className="bg-zinc-900/30 border border-zinc-700 rounded-lg p-4 text-center">
                <step.icon className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="construction-text font-bold text-white mb-1">{step.title}</h4>
                <p className="construction-text text-sm text-zinc-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
        <h3 className="construction-text text-lg font-bold text-green-500 mb-3">✅ エージェント設定済み</h3>
        <div className="construction-text text-zinc-300 space-y-2 text-sm">
          <p>ElevenLabs Conversational AIエージェントが接続されています。</p>
          <p className="text-green-400">エージェントID: agent_8901kdnrdyhtfx7ahkhc3qy4xd1f</p>
          <div className="mt-3 p-3 bg-zinc-900/50 rounded-lg">
            <p className="font-semibold mb-2">💡 使い方:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>「音声注文を開始」ボタンをクリック</li>
              <li>マイクの使用を許可</li>
              <li>AIアシスタントと対話して建機をレンタル</li>
              <li>注文内容が自動的に保存されます</li>
            </ol>
          </div>
          <p className="mt-3 text-amber-400">⚠️ ElevenLabs SDKがページに読み込まれている必要があります</p>
        </div>
      </div>
    </div>
  );
};

const AdminView = ({ orders, loadOrders }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const updatedOrder = { ...order, status: newStatus };
        await window.storage.set(`order:${order.timestamp}`, JSON.stringify(updatedOrder));
        await loadOrders();
      }
    } catch (error) {
      console.error('ステータス更新エラー:', error);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: '総注文数', value: stats.total, icon: Package, color: 'amber' },
          { label: '保留中', value: stats.pending, icon: Calendar, color: 'yellow' },
          { label: '確認済み', value: stats.confirmed, icon: CheckCircle, color: 'blue' },
          { label: '完了', value: stats.completed, icon: Truck, color: 'green' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-zinc-800 border-2 border-zinc-700 rounded-xl p-6 slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
              <span className="construction-title text-4xl text-white">{stat.value}</span>
            </div>
            <p className="construction-text text-zinc-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-zinc-800 border-2 border-zinc-700 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-2">
          {['all', 'pending', 'confirmed', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`construction-text px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === status
                  ? 'bg-amber-500 text-zinc-900'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              {status === 'all' && 'すべて'}
              {status === 'pending' && '保留中'}
              {status === 'confirmed' && '確認済み'}
              {status === 'completed' && '完了'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-800 border-2 border-zinc-700 rounded-xl overflow-hidden">
        <div className="grid-bg bg-zinc-900/50 px-6 py-4 border-b-2 border-amber-500">
          <h2 className="construction-title text-2xl text-amber-500">注文一覧</h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="construction-text text-zinc-500 text-lg">注文がありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/50">
                <tr className="construction-text text-zinc-400 text-sm">
                  <th className="px-6 py-4 text-left font-semibold">注文番号</th>
                  <th className="px-6 py-4 text-left font-semibold">建機名</th>
                  <th className="px-6 py-4 text-left font-semibold">期間</th>
                  <th className="px-6 py-4 text-left font-semibold">配送先</th>
                  <th className="px-6 py-4 text-left font-semibold">ステータス</th>
                  <th className="px-6 py-4 text-left font-semibold">日時</th>
                  <th className="px-6 py-4 text-left font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="construction-text">
                {filteredOrders.map((order, idx) => (
                  <tr key={idx} className="border-t border-zinc-700 hover:bg-zinc-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-amber-500 font-semibold">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{order.equipment || '未設定'}</td>
                    <td className="px-6 py-4 text-zinc-300">{order.duration || '未設定'}</td>
                    <td className="px-6 py-4 text-zinc-300">{order.location || '未設定'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {order.status === 'pending' && '保留中'}
                        {order.status === 'confirmed' && '確認済み'}
                        {order.status === 'completed' && '完了'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {new Date(order.timestamp).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-zinc-700 text-white px-3 py-1 rounded-lg text-sm border border-zinc-600 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="pending">保留中</option>
                        <option value="confirmed">確認済み</option>
                        <option value="completed">完了</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstructionRentalApp;

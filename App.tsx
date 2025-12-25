
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Bell, 
  User, 
  CheckCircle, 
  Clock, 
  Info,
  ChevronRight,
  Sparkles,
  // Fix: Added missing LayoutDashboard import
  LayoutDashboard
} from 'lucide-react';
import { 
  LedgerCategory, 
  LedgerStatus, 
  LedgerRecord 
} from './types';
import { 
  HOME_NAV_ITEMS, 
  MOCK_RECORDS, 
  CATEGORY_ICONS 
} from './constants';
import { GoogleGenAI } from "@google/genai";

// Views
const HomeView = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-blue-600 p-6 rounded-b-3xl text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs opacity-80">欢迎回来</p>
              <h2 className="font-bold">系统管理员</h2>
            </div>
          </div>
          <div className="relative">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center border-2 border-blue-600">3</span>
          </div>
        </div>
        
        <div className="bg-blue-700/50 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
          <Info className="text-yellow-400 shrink-0" size={20} />
          <p className="text-xs">
            <span className="font-bold">今日提示：</span>今日需执行4项台账任务，请在当日下午18点前完成所有清洗与检查工作。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-6">
        {HOME_NAV_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
            onClick={() => item.id === 'ledger' && navigate('/ledger')}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color} shadow-sm`}>
              {/* Fix: Cast item.icon to React.ReactElement<any> to resolve size property error */}
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">待办任务</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">门店卫生自查</h4>
                  <p className="text-xs text-gray-500">截止日期: 今日 18:00</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full">去执行</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LedgerManagementView = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 flex items-center sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => navigate('/')} className="p-1"><ChevronLeft /></button>
        <h1 className="flex-1 text-center font-bold text-lg -ml-7">台账管理</h1>
      </header>
      
      <div className="p-4 space-y-4">
        <p className="text-xs text-gray-400 font-medium ml-1">日常台账</p>
        {Object.values(LedgerCategory).map((cat) => (
          <div 
            key={cat}
            className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all active:bg-gray-50"
            onClick={() => cat === LedgerCategory.WASTE_OIL && navigate('/waste-oil')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                {CATEGORY_ICONS[cat]}
              </div>
              <span className="font-bold text-gray-700">{cat}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium">
              查看记录 <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/create')}
        className="fixed right-6 bottom-10 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-300 active:scale-95 transition-transform"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

const CreateLedgerView = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    time: new Date().toISOString().split('T')[0],
    content: LedgerCategory.WASTE_OIL,
    details: '',
    store: '北京朝阳店',
    remarks: ''
  });
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
    alert('提交成功！');
    navigate('/waste-oil');
  };

  const handleAiFill = async () => {
    setIsAiLoading(true);
    try {
      // Fix: Direct use of process.env.API_KEY as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest a realistic detailed description for a "${formData.content}" ledger entry for a professional kitchen store. Return only the description string.`,
      });
      setFormData(prev => ({ ...prev, details: response.text || '' }));
    } catch (error) {
      console.error(error);
      setFormData(prev => ({ ...prev, details: '废油回收 20L，由特种废油回收公司处理，状态良好。' }));
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-sm">取消</button>
        <h1 className="font-bold text-lg">新增台账</h1>
        <div className="w-8"></div>
      </header>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 pb-32">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">时间</label>
          <input 
            type="date" 
            className="w-full bg-gray-50 rounded-xl p-3 border-none outline-none focus:ring-2 focus:ring-blue-100"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">内容选择</label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(LedgerCategory).map((cat) => (
              <div 
                key={cat}
                onClick={() => setFormData({...formData, content: cat})}
                className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all ${
                  formData.content === cat ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {CATEGORY_ICONS[cat]}
                  <span className="text-sm font-medium">{cat}</span>
                </div>
                {formData.content === cat && (
                  <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 relative">
          <label className="text-sm font-bold text-gray-700 flex justify-between items-center">
            详情描述
            <button 
              type="button"
              onClick={handleAiFill}
              disabled={isAiLoading}
              className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 disabled:opacity-50"
            >
              <Sparkles size={12} />
              {isAiLoading ? '生成中...' : 'AI智能填空'}
            </button>
          </label>
          <textarea 
            placeholder="例如：回收 20L / 更换3号滤芯"
            rows={3}
            className="w-full bg-gray-50 rounded-xl p-3 border-none outline-none focus:ring-2 focus:ring-blue-100"
            value={formData.details}
            onChange={(e) => setFormData({...formData, details: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">门店</label>
          <input 
            type="text" 
            className="w-full bg-gray-50 rounded-xl p-3 border-none outline-none focus:ring-2 focus:ring-blue-100"
            value={formData.store}
            readOnly
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">备注</label>
          <input 
            type="text" 
            placeholder="请输入备注信息..."
            className="w-full bg-gray-50 rounded-xl p-3 border-none outline-none focus:ring-2 focus:ring-blue-100"
            value={formData.remarks}
            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">
            提交
          </button>
        </div>
      </form>
    </div>
  );
};

const WasteOilListView = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 flex items-center sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => navigate('/ledger')} className="p-1"><ChevronLeft /></button>
        <h1 className="flex-1 text-center font-bold text-lg -ml-7">废油台账</h1>
      </header>

      <div className="p-4 space-y-4">
        {MOCK_RECORDS.map((record) => (
          <div 
            key={record.id}
            className="bg-white p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer active:bg-gray-50"
            onClick={() => navigate(`/detail/${record.id}`)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-800">{record.content}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                record.status === LedgerStatus.PENDING 
                  ? 'bg-orange-50 text-orange-500' 
                  : 'bg-green-50 text-green-500'
              }`}>
                {record.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500">
              <p>时间：<span className="text-gray-800">{record.date}</span></p>
              <p>门店：<span className="text-gray-800">{record.store}</span></p>
              <p>责任人：<span className="text-gray-800">{record.person}</span></p>
              <p>部门：<span className="text-gray-800">{record.department}</span></p>
            </div>
            {record.remarks && (
              <p className="text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg">备注：{record.remarks}</p>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/create')}
        className="fixed right-6 bottom-10 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-300 active:scale-95 transition-transform"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

const DetailView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const record = MOCK_RECORDS.find(r => r.id === id);

  if (!record) return <div>Record not found</div>;

  const isPending = record.status === LedgerStatus.PENDING;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-4 py-3 flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600"><ChevronLeft size={20} /> 返回</button>
        <h1 className="flex-1 text-center font-bold text-lg -ml-12">台账详情</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className={`p-6 rounded-2xl flex items-center gap-4 ${
          isPending ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isPending ? 'bg-orange-100' : 'bg-green-100'
          }`}>
            {isPending ? <Clock size={28} /> : <CheckCircle size={28} />}
          </div>
          <div>
            <h2 className="font-bold text-lg">{record.status}</h2>
            <p className="text-xs opacity-70">当前状态</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-400 text-xs tracking-wider uppercase">基本信息</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">日期</span>
              <span className="text-gray-800 font-medium">{record.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">门店</span>
              <span className="text-gray-800 font-medium">{record.store}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">部门</span>
              <span className="text-gray-800 font-medium">{record.department}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">责任人</span>
              <span className="text-gray-800 font-medium">{record.person}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-400 text-xs tracking-wider uppercase">内容详情</h3>
          <div className="space-y-2">
            <span className="text-gray-500 text-sm block">记录内容</span>
            <p className="text-gray-800 font-bold text-lg">{record.content}</p>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="bg-white p-6 border-t border-gray-100 flex gap-4">
          <button 
            className="flex-1 border-2 border-gray-200 text-gray-500 font-bold py-3 rounded-xl active:bg-gray-50 flex items-center justify-center gap-2"
            onClick={() => { alert('已驳回'); navigate(-1); }}
          >
            <span className="text-xl">×</span> 驳回
          </button>
          <button 
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
            onClick={() => { alert('已通过'); navigate(-1); }}
          >
            <CheckCircle size={18} /> 通过
          </button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="max-w-md mx-auto h-screen relative bg-gray-50 overflow-hidden shadow-2xl">
      <div className="h-full overflow-y-auto no-scrollbar">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/ledger" element={<LedgerManagementView />} />
          <Route path="/waste-oil" element={<WasteOilListView />} />
          <Route path="/create" element={<CreateLedgerView />} />
          <Route path="/detail/:id" element={<DetailView />} />
        </Routes>
      </div>
      
      {/* Bottom Tab Bar (Only visible on home) */}
      <Routes>
        <Route path="/" element={
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-4">
            <div className="flex flex-col items-center gap-1 text-blue-600">
              <LayoutDashboard size={20} />
              <span className="text-[10px] font-bold">首页</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <Search size={20} />
              <span className="text-[10px]">搜索</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <User size={20} />
              <span className="text-[10px]">我的</span>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;

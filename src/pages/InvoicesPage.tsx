import { useState } from 'react';
import { FileText, Download, Calendar, Building } from 'lucide-react';

const invoices = [
  {
    id: 'INV-001',
    orderId: 'ORD-123456',
    amount: 128,
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-01-30',
    type: '个人',
  },
  {
    id: 'INV-002',
    orderId: 'ORD-123457',
    amount: 49,
    status: 'paid',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25',
    type: '企业',
    companyName: 'XX科技有限公司',
    taxId: '91110105MA01234567',
  },
];

export function InvoicesPage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [invoiceType, setInvoiceType] = useState('personal');
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    taxId: '',
    address: '',
    phone: '',
  });

  const handleApply = () => {
    setShowApplyModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">发票管理</h1>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            申请发票
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">发票编号</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">订单编号</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">金额</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">类型</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{invoice.orderId}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-accent-500">¥{invoice.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.type === '个人' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {invoice.type === '个人' ? '个人' : '企业'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-medium">已开票</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">申请发票</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">发票类型</label>
                <div className="flex gap-4">
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      invoiceType === 'personal'
                        ? 'border-2 border-primary-600 bg-primary-50'
                        : 'border border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="personal"
                      checked={invoiceType === 'personal'}
                      onChange={(e) => setInvoiceType(e.target.value)}
                      className="hidden"
                    />
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">个人发票</span>
                  </label>
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      invoiceType === 'company'
                        ? 'border-2 border-primary-600 bg-primary-50'
                        : 'border border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="company"
                      checked={invoiceType === 'company'}
                      onChange={(e) => setInvoiceType(e.target.value)}
                      className="hidden"
                    />
                    <Building className="w-5 h-5" />
                    <span className="font-medium">企业发票</span>
                  </label>
                </div>
              </div>

              {invoiceType === 'company' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">企业名称</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={companyInfo.companyName}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                      placeholder="输入企业名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">税号</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={companyInfo.taxId}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, taxId: e.target.value })}
                      placeholder="输入税务登记号"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">注册地址</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      placeholder="输入注册地址"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      placeholder="输入联系电话"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  提交申请
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

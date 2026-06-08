import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    value: "₹4,52,890",
    change: "+12.5%",
    isPositive: true,
    icon: IndianRupee,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    label: "Orders",
    value: "1,234",
    change: "+8.2%",
    isPositive: true,
    icon: ShoppingCart,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Products",
    value: "256",
    change: "+3",
    isPositive: true,
    icon: Package,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    label: "Customers",
    value: "3,891",
    change: "+15.3%",
    isPositive: true,
    icon: Users,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

const recentOrders = [
  { id: "KG-2025-1234", customer: "Priyanka B.", total: "₹8,999", status: "Delivered", date: "5 Jun 2025" },
  { id: "KG-2025-1233", customer: "Ankita S.", total: "₹12,499", status: "Shipped", date: "5 Jun 2025" },
  { id: "KG-2025-1232", customer: "Ritu B.", total: "₹6,999", status: "Processing", date: "4 Jun 2025" },
  { id: "KG-2025-1231", customer: "Deepshikha K.", total: "₹15,999", status: "Confirmed", date: "4 Jun 2025" },
  { id: "KG-2025-1230", customer: "Manash D.", total: "₹3,499", status: "Pending", date: "3 Jun 2025" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-purple-100 text-purple-700",
  Pending: "bg-gray-100 text-gray-700",
};

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stat.isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-sm text-brand-red hover:underline"
          >
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Order ID
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Customer
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Total
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3 font-medium">{order.id}</td>
                  <td className="px-5 py-3">{order.customer}</td>
                  <td className="px-5 py-3 font-semibold">{order.total}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status] || ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-gold" />
            Top Selling Products
          </h3>
          <div className="space-y-3">
            {[
              { name: "Golden Muga Silk Mekhela Sador", sold: 45, revenue: "₹4,04,955" },
              { name: "Bridal Red Silk Mekhela Sador", sold: 32, revenue: "₹5,11,968" },
              { name: "Handwoven Eri Silk Mekhela", sold: 28, revenue: "₹1,95,972" },
            ].map((product, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sold} sold
                  </p>
                </div>
                <span className="text-sm font-semibold">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Category Performance
          </h3>
          <div className="space-y-3">
            {[
              { name: "Muga Silk", percentage: 35 },
              { name: "Pat Silk", percentage: 25 },
              { name: "Eri Silk", percentage: 20 },
              { name: "Wedding Collection", percentage: 15 },
              { name: "Cotton", percentage: 5 },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{cat.name}</span>
                  <span className="font-medium">{cat.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-red rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

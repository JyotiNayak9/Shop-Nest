import  { useContext, useEffect, useState } from 'react';
import { Card, Title, Text, Grid, DonutChart, BarChart } from '@tremor/react';
import authSvc from '../../auth/auth.service';
import AuthContext from '../../../context/auth.context';
import {  Heading3 } from '../../../components/common/title';
import { HiCurrencyDollar } from 'react-icons/hi';
import { FaBox } from 'react-icons/fa';
import { HiTrophy } from 'react-icons/hi2';

interface SalesData {
  dailySales: Array<{
    _id: string;
    totalSales: number;
    orderCount: number;
  }>;
  salesByStatus: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  topProducts: Array<{
    _id: {
      productId: string;
      productTitle: string;
    };
    totalQuantity: number;
    totalRevenue: number;
  }>;
  summary: {
    totalSales: number;
    totalOrders: number;
    avgOrderValue: number;
  };
}

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [ordercount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { LoggedInUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
    const order: any = await authSvc .getRequest("/order/getAllOrders", {auth:true});
        setOrderCount(order.meta.total)
        const response:any = await authSvc.getRequest('/order/analytics', { auth: true });
        if (response && response.result) {
          setSalesData(response.result);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (LoggedInUser) {
      fetchSalesData();
    }
  }, [LoggedInUser]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-80 bg-gray-200 rounded"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!salesData) {
    return <div className="text-center text-gray-500 mt-10">No data available</div>;
  }

  const { summary, dailySales, salesByStatus, topProducts } = salesData;

  const salesChartData = dailySales.map(day => ({
    date: day._id,
    'Total Sales': day.totalSales,
    'Number of Orders': day.orderCount,
  }));

  const statusChartData = salesByStatus.map(status => ({
    name: status._id.toUpperCase(),
    value: status.count,
    amount: status.totalAmount,
  }));

  const topProductsData = topProducts.map(product => ({
    name: product._id.productTitle,
    'Quantity Sold': product.totalQuantity,
    'Revenue': product.totalRevenue,
  }));

  return (
    <div className="p-4 space-y-8">
      <Heading3><> Sales Performance </></Heading3>

     
      <Grid numItemsMd={3} className="gap-6">
        <Card className="shadow-sm border border-gray-200">
          <Text className="text-gray-600 font-bold"><HiCurrencyDollar/> Total Sales</Text>
          <Title className="text-black-600 text-2xl">Rs. {summary.totalSales.toFixed(2)}</Title>
        </Card>
        <Card className="shadow-sm border border-gray-200">
          <Text className="text-gray-600 font-bold"><FaBox/> Total Orders</Text>
          <Title className="text-black-600 text-2xl">{ordercount}</Title>
        </Card>
        {/* <Card className="shadow-sm border border-gray-200">
          <Text className="text-gray-600">📊 Avg. Order Value</Text>
          <Title className="text-blue-600 text-2xl">Rs. {summary.avgOrderValue.toFixed(2)}</Title>
        </Card> */}
      </Grid>

  
      <Card className="shadow-sm border border-gray-200">
        <Title className="text-2xl font-bold text-gray-700 mb-2">Order Status Overview</Title>
        <DonutChart
          className="mt-4 font-bold"
          data={statusChartData}
          category="amount"
          index="name"
          valueFormatter={(value) => `Rs. ${value.toFixed(2)}`}
          colors={['blue', 'emerald', 'rose']}
        />
        <div className="mt-6 space-y-2 text-md font-semibold">
          {statusChartData.map((item) => (
            <div key={item.name} className="flex justify-between text-gray-600">
              <Text>{item.name}</Text>
              <Text>{item.value} orders (Rs. {item.amount.toFixed(2)})</Text>
            </div>
          ))}
        </div>
      </Card>

      <Card className="shadow-sm border border-gray-200">
        <Title className="text-xl font-semibold text-gray-700 mb-2"><HiTrophy/> Top Selling Products</Title>
        <BarChart
          className="mt-6"
          data={topProductsData}
          index="name"
          categories={['Revenue']}
          colors={['black']}
          yAxisWidth={150}
          yAxisLabel='Revenue (Rs.)'
          xAxisLabel='Products'
          showXAxis={false}
          layout="horizontal"
        />
      </Card>
      <Card className="shadow-sm border border-gray-200">
  <Title className="text-xl font-semibold text-gray-700 mb-2">
    Daily Sales Overview
  </Title>

  <BarChart
    className="mt-6"
    data={salesChartData}
    index="date"
    categories={['Total Sales']}
    yAxisLabel="Sales (Rs.)"
  />
</Card>
    </div>
  );
};

export default SalesAnalytics;
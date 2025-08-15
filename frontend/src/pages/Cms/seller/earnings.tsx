import React, { useContext, useEffect, useState } from 'react';
import { Card, Title, Text, Metric, BarChart} from '@tremor/react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { Select, SelectItem } from '@tremor/react';
import { toast } from 'react-toastify';
import authSvc from '../../auth/auth.service';
import AuthContext from '../../../context/auth.context';

interface EarningData {
  date: string;
  totalEarnings: number;
  totalOrders: number;
}

const timeRanges = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
];

const SellerEarnings: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<EarningData[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const { LoggedInUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!LoggedInUser?._id) return;
      
      try {
        setLoading(true);
        const response:any = await authSvc.getRequest(
          `order/seller/earnings?days=${timeRange}`, 
          { auth: true }
        );
        
        setEarningsData(response.result.dailyData || []);
        setTotalEarnings(response.result.totalEarnings || 0);
        setTotalOrders(response.result.totalOrders || 0);
      } catch (error) {
        console.error('Error fetching earnings:', error);
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [timeRange, LoggedInUser?._id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title>Earnings Overview</Title>
          <Text>Track your sales and earnings performance</Text>
        </div>
        <div className="w-48">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
            disabled={loading}
          >
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <Text>Total Earnings</Text>
          <Metric className="mt-2">{formatCurrency(totalEarnings)}</Metric>
          <Text className="mt-2">All time</Text>
        </Card>
        <Card>
          <Text>Total Orders</Text>
          <Metric className="mt-2">{totalOrders}</Metric>
          <Text className="mt-2">Completed orders</Text>
        </Card>
        <Card>
          <Text>Average Order Value</Text>
          <Metric className="mt-2">
            {totalOrders > 0 ? formatCurrency(totalEarnings / totalOrders) : formatCurrency(0)}
          </Metric>
          <Text className="mt-2">Per order</Text>
        </Card>
      </div>

      <Card className="mt-6">
        <Title>Earnings Overview</Title>
        <Text>Daily earnings for the selected period</Text>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={earningsData}
              categories={['totalEarnings']}
              index="date"
              // margin={{
              //   top: 20,
              //   right: 30,
              //   left: 20,
              //   bottom: 5,
              // }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value:any) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                tickFormatter={(value:any) => `Rs. ${value}`}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`Rs. ${value.toFixed(2)}`, 'Earnings']}
                labelFormatter={(label:any) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                }}
              />
              
              <Bar
                dataKey="totalEarnings" 
                name="Earnings (NPR)" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Title>Recent Transactions</Title>
          <div className="mt-4 space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading transactions...</p>
              </div>
            ) : earningsData.length > 0 ? (
              earningsData.slice(0, 5).map((day) => (
                <div key={day.date} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-500">{day.totalOrders} orders</p>
                  </div>
                  <p className="font-medium text-blue-600">
                    {formatCurrency(day.totalEarnings)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">No transaction data available</p>
            )}
          </div>
        </Card>

        <Card>
          <Title>Earnings Summary</Title>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <Text>Total Sales</Text>
              <Text className="font-medium">{formatCurrency(totalEarnings)}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Total Orders</Text>
              <Text className="font-medium">{totalOrders}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Average Order Value</Text>
              <Text className="font-medium">
                {totalOrders > 0 ? formatCurrency(totalEarnings / totalOrders) : formatCurrency(0)}
              </Text>
            </div>
            <div className="pt-3 mt-3 border-t">
              <div className="flex justify-between font-medium">
                <Text>Net Earnings</Text>
                <Text className="text-blue-600">{formatCurrency(totalEarnings)}</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SellerEarnings;

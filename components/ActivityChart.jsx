import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { monthActivity } from '../data/mockData.js';
import { styled } from '../styles/theme.js';

const TooltipCard = styled('div', {
  padding: '$3',
  borderRadius: '$md',
  backgroundColor: '$panel',
  minWidth: '120px',
  border: '1px solid $borderStrong',
  boxShadow: '0 12px 40px $shadow',
});

const Muted = styled('p', {
  margin: 0,
  color: '$textMuted',
  lineHeight: 1.5,
  fontSize: '$2',
});

function MonthTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <TooltipCard>
      <strong>{label}</strong>
      <Muted css={{ marginTop: '$1' }}>{payload[0].value} scans</Muted>
    </TooltipCard>
  );
}

export default function ActivityChart({ height = 120 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={monthActivity} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="scanFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4d61fc" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#4d61fc" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#6c738a"
            tick={{ fill: '#8b92a8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#6c738a"
            tick={{ fill: '#8b92a8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<MonthTooltip />} cursor={{ stroke: 'rgba(77,97,252,0.25)' }} />
          <Area
            type="monotone"
            dataKey="scans"
            stroke="#4d61fc"
            strokeWidth={2}
            fill="url(#scanFill)"
            dot={{ r: 3, fill: '#4d61fc', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#6b7cff', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

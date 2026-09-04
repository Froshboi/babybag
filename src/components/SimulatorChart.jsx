'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const SimulatorChart = ({ data }) => {
  return (
    <div className="card w-full max-w-full min-w-0 h-80 border-t-4 border-t-mint">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#1A2A3A" />
          <YAxis domain={['auto', 'auto']} stroke="#1A2A3A" />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #98D8C8', backgroundColor: '#FFF8E7' }} />
          <Line type="monotone" dataKey="price" stroke="#7BC4B2" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
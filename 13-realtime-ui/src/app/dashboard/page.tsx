'use client';

import { useEffect, useState } from 'react';
import { ConnectionStatus } from '@/components/connection-status';
import { LiveOrderFeed } from '@/components/live-order-feed';
import { useLiveOrders } from '@/hooks/use-live-orders';
import { logoutAction } from '../actions/auth';

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (match) setToken(match[1]);
  }, []);

  const { events, status } = useLiveOrders(token);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Live Dashboard</h1>
        <div className="flex items-center gap-4">
          <ConnectionStatus status={status} />
          <form action={logoutAction}>
            <button type="submit" className="text-red-600 hover:text-red-800">Logout</button>
          </form>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Live Event Feed</h2>
        <LiveOrderFeed events={events} />
      </div>
    </div>
  );
}

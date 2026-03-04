'use client';

/**
 * Connection Status Indicator
 *
 * Shows a small dot with label indicating the WebSocket connection state.
 * Green = connected, Yellow = connecting, Red = disconnected.
 */

interface ConnectionStatusProps {
  status: string;
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const colors = {
    connected: 'bg-green-500',
    connecting: 'bg-yellow-500 animate-pulse',
    disconnected: 'bg-red-500',
  };

  const labels = {
    connected: 'Live',
    connecting: 'Connecting...',
    disconnected: 'Offline',
  };

  const color = colors[status as keyof typeof colors] || colors.disconnected;
  const label = labels[status as keyof typeof labels] || 'Unknown';

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-gray-600">{label}</span>
    </div>
  );
}

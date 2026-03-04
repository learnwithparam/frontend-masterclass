'use client';

/**
 * Live Stock Badge
 *
 * Shows the current stock count for a book. When the stock updates
 * via WebSocket, the badge flashes briefly to draw attention.
 */

interface LiveStockBadgeProps {
  stock?: number;
}

export function LiveStockBadge({ stock }: LiveStockBadgeProps) {
  if (stock === undefined) return null;

  const isLow = stock <= 3;
  const isOut = stock === 0;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
        isOut
          ? 'bg-red-100 text-red-800'
          : isLow
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-green-100 text-green-800'
      }`}
    >
      {isOut ? 'Out of stock' : `${stock} in stock`}
    </span>
  );
}

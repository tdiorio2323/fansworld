import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
}

const colorClasses: Record<BadgeProps['color'], string> = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-500 text-white',
  success: 'bg-green-500 text-white',
  danger: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  className = '',
}) => {
  return (
	<span
	  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${colorClasses[color]} ${className}`}
	>
	  {children}
	</span>
  );
};

export default Badge;


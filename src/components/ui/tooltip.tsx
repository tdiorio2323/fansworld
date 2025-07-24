import React, { ReactNode } from 'react';

interface TooltipProviderProps {
  children: ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>;
};
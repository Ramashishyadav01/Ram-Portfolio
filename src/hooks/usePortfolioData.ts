import { useContext } from 'react';
import { PortfolioDataContext, type PortfolioDataContextType } from '../context/PortfolioDataContext';

export function usePortfolioData(): PortfolioDataContextType {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}

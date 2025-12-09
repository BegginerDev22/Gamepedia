import React, { createContext, useContext, useState } from 'react';
import { Match, MatchStatus } from '../types';
import { MOCK_MATCHES } from '../constants';

interface MatchContextType {
  matches: Match[];
  updateMatch: (id: string, updates: Partial<Match>) => void;
  getMatch: (id: string) => Match | undefined;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);

  const updateMatch = (id: string, updates: Partial<Match>) => {
    setMatches(prev => prev.map(match => 
      match.id === id ? { ...match, ...updates } : match
    ));
  };

  const getMatch = (id: string) => matches.find(m => m.id === id);

  return (
    <MatchContext.Provider value={{ matches, updateMatch, getMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatches = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};
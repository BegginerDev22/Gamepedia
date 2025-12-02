
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_BADGES, MOCK_MISSIONS } from '../constants';
import { Badge, StoreItem, Mission } from '../types';

interface Bet {
  id: string;
  matchId: string;
  teamId: string;
  amount: number;
  odds: number;
  potentialPayout: number;
  status: 'open' | 'won' | 'lost';
  timestamp: string;
}

interface UserContextType {
  points: number;
  bets: Bet[];
  badges: Badge[];
  inventory: StoreItem[];
  missions: Mission[];
  xp: number;
  level: number;
  placeBet: (matchId: string, teamId: string, amount: number, odds: number) => boolean;
  settleBets: (matchId: string, winningTeamId: string) => number; // Returns total payout amount
  addPoints: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  purchaseItem: (item: StoreItem) => boolean;
  claimMission: (missionId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with some "Welcome" points
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('gp_points');
    return saved ? parseInt(saved, 10) : 2500;
  });

  const [bets, setBets] = useState<Bet[]>(() => {
    const saved = localStorage.getItem('gp_bets');
    return saved ? JSON.parse(saved) : [];
  });

  const [inventory, setInventory] = useState<StoreItem[]>(() => {
      const saved = localStorage.getItem('gp_inventory');
      return saved ? JSON.parse(saved) : [];
  });

  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);

  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [xp, setXp] = useState(1250); // Mock XP
  const level = Math.floor(xp / 1000) + 1;

  useEffect(() => {
    localStorage.setItem('gp_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('gp_bets', JSON.stringify(bets));
  }, [bets]);

  useEffect(() => {
      localStorage.setItem('gp_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const placeBet = (matchId: string, teamId: string, amount: number, odds: number): boolean => {
    if (amount > points) return false;

    const newBet: Bet = {
      id: `bet-${Date.now()}`,
      matchId,
      teamId,
      amount,
      odds,
      potentialPayout: Math.floor(amount * odds),
      status: 'open',
      timestamp: new Date().toISOString()
    };

    setPoints(prev => prev - amount);
    setBets(prev => [newBet, ...prev]);
    return true;
  };

  // Settle bets for a finished match
  const settleBets = (matchId: string, winningTeamId: string): number => {
    let totalPayout = 0;
    
    const updatedBets = bets.map(bet => {
        if (bet.matchId === matchId && bet.status === 'open') {
            if (bet.teamId === winningTeamId) {
                totalPayout += bet.potentialPayout;
                return { ...bet, status: 'won' as const };
            } else {
                return { ...bet, status: 'lost' as const };
            }
        }
        return bet;
    });

    if (totalPayout > 0) {
        setPoints(prev => prev + totalPayout);
        setXp(prev => prev + 100); // Gain XP for winning
    }
    
    setBets(updatedBets);
    return totalPayout;
  };

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
    if (amount > 0) setXp(prev => prev + 50);
  };

  const unlockBadge = (badgeId: string) => {
      setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, unlocked: true } : b));
  };

  const purchaseItem = (item: StoreItem): boolean => {
      if (points < item.price) return false;
      if (inventory.some(i => i.id === item.id)) return false; // Already owned

      setPoints(prev => prev - item.price);
      setInventory(prev => [...prev, item]);
      return true;
  };

  const claimMission = (missionId: string) => {
      const mission = missions.find(m => m.id === missionId);
      if (mission && mission.completed && !mission.claimed) {
          setPoints(prev => prev + mission.reward);
          setXp(prev => prev + 20); // Bonus XP
          setMissions(prev => prev.map(m => m.id === missionId ? { ...m, claimed: true } : m));
      }
  };

  return (
    <UserContext.Provider value={{ points, bets, placeBet, settleBets, addPoints, badges, unlockBadge, xp, level, inventory, purchaseItem, missions, claimMission }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

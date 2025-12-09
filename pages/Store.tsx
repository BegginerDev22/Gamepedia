
import React, { useState } from 'react';
import { ShoppingBag, Coins, Tag, CheckCircle, AlertCircle, Gem, Filter, Star } from 'lucide-react';
import { MOCK_STORE_ITEMS } from '../constants';
import { useUser } from '../contexts/UserContext';
import { StoreItem } from '../types';

export const StorePage: React.FC = () => {
    const { points, inventory, purchaseItem } = useUser();
    const [filterType, setFilterType] = useState('All');
    const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);

    const categories = ['All', 'Avatar', 'Frame', 'Title', 'Banner'];

    const filteredItems = MOCK_STORE_ITEMS.filter(item => 
        filterType === 'All' || item.type === filterType
    );

    const handlePurchase = (item: StoreItem) => {
        setPurchaseSuccess(null);
        setPurchaseError(null);

        if (inventory.some(i => i.id === item.id)) {
            setPurchaseError("You already own this item!");
            return;
        }

        const success = purchaseItem(item);
        if (success) {
            setPurchaseSuccess(`Successfully purchased ${item.name}!`);
        } else {
            setPurchaseError("Insufficient points to purchase this item.");
        }
    };

    const getRarityColor = (rarity: string) => {
        switch(rarity) {
            case 'Legendary': return 'text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'Epic': return 'text-purple-500 border-purple-500 bg-purple-50 dark:bg-purple-900/20';
            case 'Rare': return 'text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
            default: return 'text-slate-500 border-slate-500 bg-slate-50 dark:bg-slate-800';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold flex items-center mb-2">
                        <ShoppingBag className="mr-3 text-yellow-400" /> Points Marketplace
                    </h1>
                    <p className="text-slate-300 max-w-xl">
                        Redeem your GameCredits for exclusive profile customization items. Show off your achievements!
                    </p>
                </div>
                <div className="mt-6 md:mt-0 flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                    <div className="text-right mr-4">
                        <span className="block text-xs uppercase font-bold text-slate-300">Your Balance</span>
                        <span className="text-2xl font-mono font-bold text-yellow-400">{points.toLocaleString()} PTS</span>
                    </div>
                    <div className="p-2 bg-yellow-400 rounded-full text-slate-900">
                        <Coins size={24} />
                    </div>
                </div>
            </div>

            {/* Feedback Alerts */}
            {purchaseSuccess && (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-6 py-4 rounded-xl font-bold flex items-center animate-bounce-in">
                    <CheckCircle className="mr-2" /> {purchaseSuccess}
                </div>
            )}
            {purchaseError && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-6 py-4 rounded-xl font-bold flex items-center animate-bounce-in">
                    <AlertCircle className="mr-2" /> {purchaseError}
                </div>
            )}

            {/* Filter */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-fit overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterType(cat)}
                        className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-colors ${
                            filterType === cat 
                            ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => {
                    const isOwned = inventory.some(i => i.id === item.id);
                    const canAfford = points >= item.price;

                    return (
                        <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all hover:shadow-md group">
                            <div className="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-6">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="max-w-full max-h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                                />
                                <span className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded border ${getRarityColor(item.rarity)}`}>
                                    {item.rarity}
                                </span>
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.name}</h3>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex-1">{item.description}</p>
                                
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center">
                                        {item.price} <span className="text-xs ml-1 text-slate-400">PTS</span>
                                    </div>
                                    
                                    {isOwned ? (
                                        <button disabled className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-sm rounded-lg cursor-not-allowed flex items-center">
                                            <CheckCircle size={16} className="mr-1.5" /> Owned
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handlePurchase(item)}
                                            disabled={!canAfford}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center ${
                                                canAfford 
                                                ? 'bg-gamepedia-blue text-white hover:bg-blue-600 shadow-md' 
                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Buy Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

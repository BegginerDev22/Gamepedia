
import React, { useState } from 'react';
import { Book, Search, Hash, Info } from 'lucide-react';
import { MOCK_GLOSSARY } from '../constants';

export const GlossaryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLetter, setActiveLetter] = useState('All');

    const alphabet = ['All', ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ')];

    const filteredTerms = MOCK_GLOSSARY.filter(term => {
        const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || term.definition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLetter = activeLetter === 'All' || term.term.toUpperCase().startsWith(activeLetter);
        return matchesSearch && matchesLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Book className="mr-3 text-gamepedia-blue" /> Esports Glossary
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Decode the caster commentary. The definitive dictionary for BGMI terminology.
                </p>
            </div>

            {/* Search & Filter */}
            <div className="space-y-6">
                <div className="relative max-w-xl mx-auto">
                    <input 
                        type="text" 
                        placeholder="Search for a term (e.g. IGL, Rotation)..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue text-lg dark:text-white"
                    />
                    <Search size={20} className="absolute left-4 top-4.5 text-slate-400" />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {alphabet.map(letter => (
                        <button 
                            key={letter}
                            onClick={() => setActiveLetter(letter)}
                            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                                activeLetter === letter 
                                ? 'bg-gamepedia-blue text-white' 
                                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Terms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTerms.length > 0 ? filteredTerms.map(term => (
                    <div key={term.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-gamepedia-blue/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue transition-colors">{term.term}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                {term.category || 'General'}
                            </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            {term.definition}
                        </p>
                        {term.example && (
                            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded border-l-2 border-gamepedia-blue italic">
                                "{term.example}"
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="col-span-2 text-center py-12 text-slate-500">
                        <Hash size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                        <p>No terms found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

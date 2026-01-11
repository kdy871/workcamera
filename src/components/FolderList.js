'use client';

import React, { useState } from 'react';
import { useMedia } from '@/lib/MediaStore';
import { Folder, Plus, Search, Trash2, ChevronRight, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FolderList({ onSelectFolder }) {
    const { folders, addFolder, deleteFolder } = useMedia();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const filteredFolders = folders.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateFolder = (e) => {
        e.preventDefault();
        if (newFolderName.trim()) {
            addFolder(newFolderName.trim());
            setNewFolderName('');
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                        FolderShot
                    </h1>
                    <p className="text-zinc-500 text-sm">Select a folder to start capturing</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-12 h-12 glass-morphism flex items-center justify-center text-blue-400 active:scale-90 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                    type="text"
                    placeholder="Search folders..."
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pb-24 scrollbar-hide">
                <AnimatePresence mode='popLayout'>
                    {filteredFolders.map((folder, index) => (
                        <motion.div
                            key={folder.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelectFolder(folder)}
                            className="glass-morphism p-5 flex items-center gap-4 cursor-pointer hover:bg-zinc-800 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                <Folder fill="currentColor" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-zinc-100">{folder.name}</h3>
                                <p className="text-xs text-zinc-500">{folder.items.length} items</p>
                            </div>
                            <ChevronRight className="text-zinc-700 group-hover:text-zinc-400 transition-colors" size={20} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredFolders.length === 0 && !isAdding && (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                        <Folder size={48} className="mb-4 opacity-20" />
                        <p>No folders found</p>
                    </div>
                )}
            </div>

            {/* Add Folder Modal-ish overlay */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-morphism p-8 w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-6">New Folder</h2>
                            <form onSubmit={handleCreateFolder}>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full input-field mb-6"
                                    placeholder="Enter name..."
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn-primary"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

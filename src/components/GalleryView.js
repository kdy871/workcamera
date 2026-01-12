'use client';

import React, { useState } from 'react';
import { useMedia } from '@/lib/MediaStore';
import { ArrowLeft, Grid, List, Trash2, Share2, Download, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryView({ folder, onBack, onOpenCamera }) {
    const { deleteMedia } = useMedia();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const handleDownload = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-full bg-background animate-slide-up">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-zinc-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-white">{folder.name}</h2>
                        <p className="text-xs text-zinc-500 font-medium">{folder.items.length} items</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400"
                    >
                        {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
                    </button>
                    <button onClick={onOpenCamera} className="btn-primary !py-2 !px-4 !rounded-xl !text-sm">
                        Capture
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-32">
                {folder.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
                        <Share2 size={48} className="mb-4 opacity-10" />
                        <p>No media in this folder</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-3 gap-3" : "flex flex-col gap-4"}>
                        <AnimatePresence>
                            {folder.items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: index * 0.02 }}
                                    className={`group relative ${viewMode === 'list' ? 'glass-morphism overflow-hidden' : ''}`}
                                >
                                    {viewMode === 'grid' ? (
                                        <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                                            <img src={item.url} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDownload(item.url, item.name); }}
                                                    className="w-10 h-10 rounded-full bg-blue-500/80 text-white flex items-center justify-center"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteMedia(folder.id, item.id); }}
                                                    className="w-10 h-10 rounded-full bg-red-500/80 text-white flex items-center justify-center"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4 p-3">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                                                <img src={item.url} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-white text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-zinc-500">{new Date(item.capturedAt).toLocaleTimeString()}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleDownload(item.url, item.name)}
                                                    className="text-zinc-400 hover:text-blue-400 p-2"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteMedia(folder.id, item.id)}
                                                    className="text-zinc-600 hover:text-red-400 p-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

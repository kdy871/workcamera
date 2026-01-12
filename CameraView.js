'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Image as ImageIcon, Check } from 'lucide-react';
import { useMedia } from '@/lib/MediaStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CameraView({ folder, onClose }) {
    const fileInputRef = useRef(null);
    const { addMediaToFolder } = useMedia();
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const triggerCamera = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCapturedImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveMedia = () => {
        if (capturedImage) {
            addMediaToFolder(folder.id, {
                type: 'image',
                url: capturedImage,
                name: `Shot_${Date.now()}.jpg`
            });
            setCapturedImage(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Camera size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Saving to</p>
                        <p className="text-white font-bold">{folder.name}</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <X size={24} />
                </button>
            </div>

            {/* Viewport / Preview */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-900">
                {!capturedImage ? (
                    <div className="text-center p-8">
                        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Camera size={40} className="text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Native Quality Mode</h3>
                        <p className="text-zinc-400 max-w-[250px] mx-auto">
                            시스템 카메라를 실행하여 가장 선명한 화질로 촬영합니다.
                        </p>
                    </div>
                ) : (
                    <img src={capturedImage} className="w-full h-full object-contain" alt="Captured" />
                )}

                {/* Hidden Native Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCapture}
                    className="hidden"
                />
            </div>

            {/* Controls */}
            <div className="p-8 pb-12 bg-black flex flex-col items-center gap-8 border-t border-zinc-900">
                <div className="flex items-center justify-between w-full max-w-sm">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden bg-zinc-900">
                        {folder.items.length > 0 ? (
                            <img src={folder.items[0].url} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="text-white/20" size={20} />
                        )}
                    </div>

                    {!capturedImage ? (
                        <button
                            onClick={triggerCamera}
                            className="w-24 h-24 rounded-full bg-white flex items-center justify-center p-2 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            <div className="w-full h-full rounded-full border-[3px] border-black flex items-center justify-center">
                                <Camera size={32} className="text-black" />
                            </div>
                        </button>
                    ) : (
                        <div className="flex gap-6 animate-slide-up">
                            <button
                                onClick={() => setCapturedImage(null)}
                                className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-white"
                            >
                                <RefreshCw size={24} />
                            </button>
                            <button
                                onClick={saveMedia}
                                className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/40"
                            >
                                <Check size={32} />
                            </button>
                        </div>
                    )}

                    <div className="w-12 h-12 flex items-center justify-center">
                        {/* Placeholder for symmetry */}
                    </div>
                </div>
            </div>
        </div>
    );
}

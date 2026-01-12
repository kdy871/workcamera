'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Image as ImageIcon, Check } from 'lucide-react';
import { useMedia } from '@/lib/MediaStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CameraView({ folder, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const { addMediaToFolder } = useMedia();
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [mode, setMode] = useState('photo'); // 'photo' or 'video'

    const startCamera = async () => {
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 4096 },
                    height: { ideal: 2160 }
                },
                audio: false
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d', { alpha: false });
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
            setCapturedImage(dataUrl);
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
            // Continuous shooting mode - don't close, just clear preview
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

            {/* Viewport */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                {!capturedImage ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="p-8 pb-12 bg-black flex flex-col items-center gap-8">
                <div className="flex items-center gap-12 text-zinc-500 font-medium">
                    <button
                        className={mode === 'photo' ? 'text-white' : ''}
                        onClick={() => setMode('photo')}
                    >
                        PHOTO
                    </button>
                    <button
                        className={mode === 'video' ? 'text-white' : ''}
                        onClick={() => setMode('video')}
                    >
                        VIDEO
                    </button>
                </div>

                <div className="flex items-center justify-between w-full max-w-sm">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden">
                        {folder.items.length > 0 ? (
                            <img src={folder.items[0].url} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="text-white/20" size={20} />
                        )}
                    </div>

                    {!capturedImage ? (
                        <button
                            onClick={takePhoto}
                            className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-1"
                        >
                            <div className="w-full h-full rounded-full border-2 border-black" />
                        </button>
                    ) : (
                        <div className="flex gap-6">
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

                    <button className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white">
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

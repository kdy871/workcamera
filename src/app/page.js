'use client';

import React, { useState } from 'react';
import { useMedia } from '@/lib/MediaStore';
import FolderList from '@/components/FolderList';
import CameraView from '@/components/CameraView';
import GalleryView from '@/components/GalleryView';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { currentFolder, setCurrentFolder } = useMedia();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {!currentFolder ? (
          <motion.div
            key="folders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <FolderList onSelectFolder={(folder) => setCurrentFolder(folder)} />
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <GalleryView
              folder={currentFolder}
              onBack={() => setCurrentFolder(null)}
              onOpenCamera={() => setIsCameraOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            key="camera"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100]"
          >
            <CameraView
              folder={currentFolder}
              onClose={() => setIsCameraOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

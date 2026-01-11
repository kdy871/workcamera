'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const MediaContext = createContext();

export function MediaProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('folder_shot_data');
    if (saved) {
      try {
        setFolders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever folders change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('folder_shot_data', JSON.stringify(folders));
    }
  }, [folders, isInitialized]);

  const addFolder = (name, icon = 'folder') => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      icon,
      items: [],
      createdAt: new Date().toISOString()
    };
    setFolders([...folders, newFolder]);
    return newFolder;
  };

  const deleteFolder = (folderId) => {
    setFolders(folders.filter(f => f.id !== folderId));
    if (currentFolder?.id === folderId) setCurrentFolder(null);
  };

  const addMediaToFolder = (folderId, mediaItem) => {
    setFolders(folders.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          items: [
            {
              ...mediaItem,
              id: Date.now().toString(),
              capturedAt: new Date().toISOString()
            },
            ...f.items
          ]
        };
      }
      return f;
    }));
  };

  const deleteMedia = (folderId, itemId) => {
    setFolders(folders.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          items: f.items.filter(item => item.id !== itemId)
        };
      }
      return f;
    }));
  };

  return (
    <MediaContext.Provider value={{
      folders,
      currentFolder,
      setCurrentFolder,
      addFolder,
      deleteFolder,
      addMediaToFolder,
      deleteMedia
    }}>
      {children}
    </MediaContext.Provider>
  );
}

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error("useMedia must be used within a MediaProvider");
  return context;
};

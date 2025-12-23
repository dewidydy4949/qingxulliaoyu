import React from 'react';
import { RouterProvider } from 'react-router-dom';
import appRouter from './router';
import { AudioManagerProvider } from './audio/AudioManager';
import './index.css';

const App: React.FC = () => {
  return (
    <AudioManagerProvider>
      <RouterProvider router={appRouter} />
    </AudioManagerProvider>
  );
};

export default App;
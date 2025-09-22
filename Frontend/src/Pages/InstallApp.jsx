import React, { useState, useEffect } from 'react';
import { 
  clearDeferredPrompt, 
  getDeferredPrompt,
  subscribeToPromptChange,
  isPWAInstalled,
  isPWAInstallable,
  markPWAInstalled,
  markPWAInstallRejected,
  checkPWARequirements,
  resetPWAState
} from '../utils/installPromptStore.js';

function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkInstallStatus = () => {
      setTimeout(() => {
        const installed = isPWAInstalled();
        const installable = isPWAInstallable();
        const requirements = checkPWARequirements();
        const prompt = getDeferredPrompt();
        
        console.log('=== PWA Status Debug ===');
        console.log('Installed:', installed);
        console.log('Installable:', installable);
        console.log('Requirements:', requirements);
        console.log('Prompt available:', !!prompt);
        console.log('========================');
        
        setDebugInfo({
          installed,
          installable,
          requirements,
          hasPrompt: !!prompt,
          userAgent: navigator.userAgent,
          protocol: location.protocol,
          hostname: location.hostname
        });
        
        setIsInstalled(installed);
        setShowInstallButton(installable && !installed);
        
        if (installable && !installed) {
          setDeferredPrompt(prompt);
        }
        
        setIsLoading(false);
      }, 500);
    };

    checkInstallStatus();

    const unsubscribe = subscribeToPromptChange((newPrompt) => {
      console.log('Prompt changed:', newPrompt);
      setDeferredPrompt(newPrompt);
      
      const installed = isPWAInstalled();
      setIsInstalled(installed);
      setShowInstallButton(!!newPrompt && !installed);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA installed');
          markPWAInstalled();
          setIsInstalled(true);
          setShowInstallButton(false);
        } else {
          console.log('PWA installation rejected');
          markPWAInstallRejected();
          setShowInstallButton(false);
        }
        
        clearDeferredPrompt();
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Error during PWA installation:', error);
        alert('Installation failed. This might be because your browser doesn\'t support PWA installation or the app doesn\'t meet PWA requirements.');
      }
    } else {
      // Fallback for when no prompt is available
      alert('Direct installation is not available. Please use your browser\'s "Add to Home Screen" or "Install" option from the menu.');
    }
  };

  const handleDismiss = () => {
    markPWAInstallRejected();
    setShowInstallButton(false);
  };

  const handleReset = () => {
    resetPWAState();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
        <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
          <p className="text-gray-500">Checking installation status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Install Our App</h1>
        
        <p className="text-gray-600 mb-6">
          Get the best experience by installing our App.
          <br />
          Enjoy fast access and offline support!
        </p>

        {isInstalled ? (
          <div className="text-green-600">
            <div className="text-4xl mb-3">✓</div>
            <p className="text-lg font-semibold mb-2">App is installed!</p>
            <p className="text-sm text-gray-500">
              You're using the installed version.
            </p>
          </div>
        ) : showInstallButton ? (
          <div className="space-y-4">
            <button
              onClick={handleInstallClick}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
            >
              {deferredPrompt ? 'Install App' : 'Install App (Manual)'}
            </button>
            <button
              onClick={handleDismiss}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Not now
            </button>
          </div>
        ) : (
          <div className="text-gray-500">
            <p className="text-sm mb-4">
              App installation is not available on this device/browser.
            </p>
            {!debugInfo.requirements?.https && (
              <p className="text-xs text-red-500 mb-2">⚠️ HTTPS required for PWA installation</p>
            )}
            {!debugInfo.requirements?.manifest && (
              <p className="text-xs text-red-500 mb-2">⚠️ Web App Manifest not found</p>
            )}
            {!debugInfo.requirements?.serviceWorker && (
              <p className="text-xs text-red-500 mb-2">⚠️ Service Worker not supported</p>
            )}
          </div>
        )}

        {/* Debug Panel */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-gray-400 hover:text-gray-600 mb-2"
          >
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </button>
          
          {showDebug && (
            <div className="text-xs text-left bg-gray-100 p-3 rounded mt-2">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              <button
                onClick={handleReset}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
              >
                Reset PWA State
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstallApp;
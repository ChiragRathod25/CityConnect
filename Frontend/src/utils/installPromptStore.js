// Enhanced installPromptStore.js with debugging
let deferredPrompt = null;
let listeners = [];

const PWA_INSTALL_KEY = 'pwa_installed';
const PWA_INSTALL_REJECTED_KEY = 'pwa_install_rejected';

// Debug flag - set to true during development
const DEBUG_MODE = true;

const debugLog = (message, data = null) => {
  if (DEBUG_MODE) {
    console.log(`[PWA Debug] ${message}`, data || '');
  }
};

const setDeferredPrompt = (prompt) => {
  debugLog('Setting deferred prompt', prompt);
  deferredPrompt = prompt;
  listeners.forEach((cb) => cb(deferredPrompt));
};

const clearDeferredPrompt = () => {
  debugLog('Clearing deferred prompt');
  setDeferredPrompt(null);
};

const getDeferredPrompt = () => {
  debugLog('Getting deferred prompt', deferredPrompt);
  return deferredPrompt;
};

const subscribeToPromptChange = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((fn) => fn !== cb);
  };
};

// Mark PWA as installed in localStorage
const markPWAInstalled = () => {
  debugLog('Marking PWA as installed');
  try {
    localStorage.setItem(PWA_INSTALL_KEY, 'true');
    localStorage.removeItem(PWA_INSTALL_REJECTED_KEY);
  } catch (e) {
    debugLog('localStorage not available', e);
  }
};

// Mark PWA install as rejected
const markPWAInstallRejected = () => {
  debugLog('Marking PWA install as rejected');
  try {
    localStorage.setItem(PWA_INSTALL_REJECTED_KEY, Date.now().toString());
  } catch (e) {
    debugLog('localStorage not available', e);
  }
};

// Check if user previously rejected installation (within 7 days)
const wasInstallRecentlyRejected = () => {
  try {
    const rejectedTime = localStorage.getItem(PWA_INSTALL_REJECTED_KEY);
    if (!rejectedTime) return false;
    
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const wasRejected = parseInt(rejectedTime) > sevenDaysAgo;
    debugLog('Was install recently rejected?', wasRejected);
    return wasRejected;
  } catch (e) {
    return false;
  }
};

// Enhanced function to check if PWA is installed
const isPWAInstalled = () => {
  debugLog('Checking if PWA is installed...');
  
  // First check localStorage flag
  try {
    const localStorageFlag = localStorage.getItem(PWA_INSTALL_KEY);
    if (localStorageFlag === 'true') {
      debugLog('PWA installed (localStorage flag)');
      return true;
    }
  } catch (e) {
    debugLog('localStorage check failed', e);
  }
  
  // Check if running in standalone mode (installed PWA)
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    debugLog('PWA installed (standalone mode)');
    markPWAInstalled();
    return true;
  }
  
  // Check if running in PWA context (iOS Safari)
  if (window.navigator.standalone === true) {
    debugLog('PWA installed (iOS standalone)');
    markPWAInstalled();
    return true;
  }
  
  // Check document referrer (Android Chrome)
  if (document.referrer.includes('android-app://')) {
    debugLog('PWA installed (Android referrer)');
    markPWAInstalled();
    return true;
  }
  
  debugLog('PWA not installed');
  return false;
};

// Check PWA requirements
const checkPWARequirements = () => {
  const requirements = {
    https: location.protocol === 'https:' || location.hostname === 'localhost',
    serviceWorker: 'serviceWorker' in navigator,
    manifest: document.querySelector('link[rel="manifest"]') !== null,
    beforeInstallPrompt: 'onbeforeinstallprompt' in window
  };
  
  debugLog('PWA Requirements Check', requirements);
  return requirements;
};

// Enhanced function to check if PWA is installable
const isPWAInstallable = () => {
  debugLog('Checking if PWA is installable...');
  
  // If already installed, not installable
  if (isPWAInstalled()) {
    debugLog('Not installable - already installed');
    return false;
  }
  
  // If user recently rejected, don't show again
  if (wasInstallRecentlyRejected()) {
    debugLog('Not installable - recently rejected');
    return false;
  }
  
  // Check PWA requirements
  const requirements = checkPWARequirements();
  if (!requirements.https || !requirements.serviceWorker || !requirements.manifest) {
    debugLog('Not installable - missing requirements', requirements);
    return false;
  }
  
  // If we have a deferred prompt, it's installable
  if (deferredPrompt) {
    debugLog('Installable - has deferred prompt');
    return true;
  }
  
  // For debugging: allow manual installation even without prompt
  if (DEBUG_MODE && !deferredPrompt) {
    debugLog('Debug mode: showing install option even without prompt');
    return true;
  }
  
  debugLog('Not installable - no deferred prompt');
  return false;
};

// Clear installation rejection (useful for testing)
const clearInstallRejection = () => {
  try {
    localStorage.removeItem(PWA_INSTALL_REJECTED_KEY);
    debugLog('Cleared install rejection');
  } catch (e) {
    debugLog('Failed to clear install rejection', e);
  }
};

// Reset all PWA state (for debugging)
const resetPWAState = () => {
  try {
    localStorage.removeItem(PWA_INSTALL_KEY);
    localStorage.removeItem(PWA_INSTALL_REJECTED_KEY);
    deferredPrompt = null;
    debugLog('Reset all PWA state');
  } catch (e) {
    debugLog('Failed to reset PWA state', e);
  }
};

export { 
  setDeferredPrompt, 
  clearDeferredPrompt, 
  getDeferredPrompt, 
  subscribeToPromptChange,
  isPWAInstalled,
  isPWAInstallable,
  markPWAInstalled,
  markPWAInstallRejected,
  clearInstallRejection,
  resetPWAState,
  checkPWARequirements
};
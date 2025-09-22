import { useEffect, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import "../styles/GoogleTranslate.css";

const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Get language from cookie on component mount
    const cookieMatch = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    return cookieMatch ? cookieMatch[1] : "en";
  });
  const [isTranslateReady, setIsTranslateReady] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  // Helper function to set cookie properly across different domains
  const setGoogleTransCookie = (value, isDelete = false) => {
    const hostname = window.location.hostname;
    const domain = hostname.includes('localhost') ? '' : hostname.startsWith('.') ? hostname : '.' + hostname;
    
    if (isDelete) {
      // Delete cookie for multiple possible domains
      const domains = ['', domain, hostname, '.' + hostname.split('.').slice(-2).join('.')];
      domains.forEach(d => {
        const domainStr = d ? `domain=${d}; ` : '';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; ${domainStr}`;
      });
    } else {
      // First, clear any existing googtrans cookies
      setGoogleTransCookie('', true);
      
      // Set new cookie
      const domainStr = hostname.includes('localhost') ? '' : `domain=${domain}; `;
      document.cookie = `googtrans=${value}; path=/; ${domainStr}max-age=86400`;
    }
  };

  useEffect(() => {
    // Check current language state on mount and after any changes
    const checkCurrentLanguage = () => {
      const cookieMatch = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      const currentLang = cookieMatch ? cookieMatch[1] : "en";
      
      if (currentLang !== selectedLanguage) {
        setSelectedLanguage(currentLang);
      }
    };

    // Load Google Translate script
    const addScript = document.createElement("script");
    addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      const translateElement = new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,gu,fr,de,es",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_element"
      );
      
      // Wait a bit for the element to be ready
      setTimeout(() => {
        setIsTranslateReady(true);
        checkCurrentLanguage(); // Check language state after initialization
      }, 1000);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.translate-dropdown')) {
        setIsOpen(false);
      }
    };

    // Listen for language changes (in case user uses browser back/forward)
    const handleLanguageCheck = () => {
      setTimeout(checkCurrentLanguage, 100);
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('load', handleLanguageCheck);
    
    // Check language state periodically
    const intervalId = setInterval(checkCurrentLanguage, 2000);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('load', handleLanguageCheck);
      clearInterval(intervalId);
      // Clean up script
      const scripts = document.querySelectorAll('script[src*="translate.google.com"]');
      scripts.forEach(script => script.remove());
    };
  }, [selectedLanguage]);

  const handleLanguageChange = (langCode) => {
    if (!isTranslateReady) return;

    setSelectedLanguage(langCode);
    setIsOpen(false);

    try {
      if (langCode === 'en') {
        // Special handling for English - reset to original
        setGoogleTransCookie('', true); // Delete all googtrans cookies
        
        // Try multiple methods to reset to English
        const resetToEnglish = () => {
          // Method 1: Reset through select element first
          const selectElement = document.querySelector('.goog-te-combo');
          if (selectElement) {
            selectElement.value = '';
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Reset to English via select element');
          }
          
          // Method 2: Try finding and clicking the restore/original button
          setTimeout(() => {
            const restoreButtons = [
              '.goog-te-menu-value span',
              '.goog-te-gadget-simple .goog-te-menu-value span',
              'a[onclick*="restore"]',
              'span[onclick*="restore"]'
            ];
            
            for (const selector of restoreButtons) {
              const btn = document.querySelector(selector);
              if (btn && btn.textContent.includes('English')) {
                btn.click();
                break;
              }
            }
          }, 100);
          
          // Method 3: Manual DOM restoration
          setTimeout(() => {
            // Remove translated classes and attributes
            const translatedElements = document.querySelectorAll('[class*="translated"]');
            translatedElements.forEach(el => {
              el.classList.remove('translated-ltr');
              el.classList.remove('translated-rtl');
            });
            
            // Reset body attributes
            if (document.body) {
              document.body.removeAttribute('translate');
              document.body.classList.remove('translated-ltr', 'translated-rtl');
            }
            
            // Reset html attributes
            if (document.documentElement) {
              document.documentElement.removeAttribute('translate');
              document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
            }
          }, 200);
        };
        
        resetToEnglish();
        
      } else {
        // For other languages, set cookie and trigger translation
        setGoogleTransCookie(`/en/${langCode}`);
        
        const selectElement = document.querySelector('.goog-te-combo');
        console.log('Select Element for', langCode, ':', selectElement);
        if (selectElement) {
          selectElement.value = langCode;
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          selectElement.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Fallback method with timeout
        setTimeout(() => {
          const translateButton = document.querySelector('.goog-te-gadget-simple a');
          if (translateButton) {
            translateButton.click();
            
            setTimeout(() => {
              const langOption = document.querySelector(`option[value="${langCode}"]`);
              if (langOption) {
                langOption.selected = true;
                const selectEl = langOption.parentElement;
                if (selectEl) {
                  selectEl.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }
            }, 100);
          }
        }, 100);

        // Ultimate fallback: reload if translation doesn't work
        // setTimeout(() => {
        //   const bodyLang = document.body.getAttribute('class') || '';
        //   if (!bodyLang.includes('translated') && langCode !== 'en') {
        //     window.location.reload();
        //   }
        // }, 1500);
      }

    } catch (error) {
      console.error('Translation error:', error);
      // Set cookie as last resort without reload
      if (langCode === 'en') {
        setGoogleTransCookie('', true);
      } else {
        setGoogleTransCookie(`/en/${langCode}`);
      }
    }
  };

  const getLanguageSearchTerm = (langCode) => {
    const searchTerms = {
      'hi': 'hindi',
      'gu': 'gujarati',
      'fr': 'french',
      'de': 'german',
      'es': 'spanish',
    };
    return searchTerms[langCode] || langCode;
  };

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div className="google-translate-hidden">
        <div id="google_translate_element"></div>
      </div>

      {/* Custom Modern Dropdown */}
      <div className="translate-dropdown">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="translate-button"
          disabled={!isTranslateReady}
        >
          <Globe className="translate-icon" />
          <span className="translate-text">
            <span className="flag">{selectedLang?.flag}</span>
            <span className="language-name">{selectedLang?.name}</span>
          </span>
          <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-content">
              <div className="dropdown-header">
                <Globe className="dropdown-header-icon" />
                <span>Choose Language</span>
              </div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`dropdown-item ${
                    selectedLanguage === language.code ? 'selected' : ''
                  }`}
                >
                  <span className="item-flag">{language.flag}</span>
                  <span className="item-name">{language.name}</span>
                  {selectedLanguage === language.code && (
                    <div className="selected-indicator"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GoogleTranslate;
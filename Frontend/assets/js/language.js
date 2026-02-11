/**
 * Multi-Language Support for E-AGRI
 * Supports English, Kannada, and Hindi
 */

// Language translations
const translations = {
    english: {
        // Navigation
        'nav.home': 'Home',
        'nav.features': 'Features',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'nav.login': 'Login',
        'nav.register': 'Register',
        
        // Hero Section
        'hero.title': 'Empowering Farmers with',
        'hero.title.highlight': 'Digital Technology',
        'hero.subtitle': 'Get real-time weather updates, market prices, AI-powered crop recommendations, and access to verified dealers - all in one platform',
        'hero.btn.getstarted': 'Get Started',
        'hero.btn.learnmore': 'Learn More',
        'hero.stats.farmers': 'Active Farmers',
        'hero.stats.dealers': 'Verified Dealers',
        'hero.stats.products': 'Products Listed',
        
        // Features
        'features.title': 'Powerful Features for Modern Agriculture',
        'features.subtitle': 'Everything you need to manage your agricultural business digitally',
        'features.weather': 'Real-Time Weather',
        'features.weather.desc': 'Get accurate weather forecasts and alerts for your farm location',
        'features.prices': 'Market Prices',
        'features.prices.desc': 'Access daily mandi prices to make informed selling decisions',
        'features.ai': 'AI Recommendations',
        'features.ai.desc': 'Get smart crop suggestions based on soil type and season',
        'features.marketplace': 'Online Marketplace',
        'features.marketplace.desc': 'Buy quality crops, fertilizers, and equipment from verified dealers',
        'features.voice': 'Voice Support',
        'features.voice.desc': 'Interact with the platform using voice commands in your language',
        'features.multilang': 'Multi-Language',
        'features.multilang.desc': 'Available in English, Kannada, and Hindi for easy access',
        
        // About
        'about.title': 'About E-AGRI',
        'about.subtitle': 'Transforming agriculture through digital innovation',
        'about.mission': 'Our Mission',
        'about.mission.text': 'E-AGRI is dedicated to empowering farmers with cutting-edge digital tools and technologies.',
        
        // Contact
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Get in touch with our team',
        'contact.address': 'Address',
        'contact.phone': 'Phone',
        'contact.email': 'Email',
        'contact.send': 'Send Message',
        
        // Common
        'common.loading': 'Loading...',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.submit': 'Submit',
        'common.close': 'Close'
    },
    
    kannada: {
        // Navigation
        'nav.home': 'ಮುಖಪೃಷ್ಠ',
        'nav.features': 'ವೈಶಿಷ್ಟ್ಯಗಳು',
        'nav.about': 'ನಮ್ಮ ಬಗ್ಗೆ',
        'nav.contact': 'ಸಂಪರ್ಕಿಸಿ',
        'nav.login': 'ಲಾಗಿನ್',
        'nav.register': 'ನೋಂದಣಿ',
        
        // Hero Section
        'hero.title': 'ರೈತರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು',
        'hero.title.highlight': 'ಡಿಜಿಟಲ್ ತಂತ್ರಜ್ಞಾನ',
        'hero.subtitle': 'ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ನವೀಕರಣಗಳು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು, AI-ಚಾಲಿತ ಬೆಳೆ ಶಿಫಾರಸುಗಳು ಮತ್ತು ಪರಿಶೀಲಿತ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಪ್ರವೇಶವನ್ನು ಪಡೆಯಿರಿ',
        'hero.btn.getstarted': 'ಪ್ರಾರಂಭಿಸಿ',
        'hero.btn.learnmore': 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
        'hero.stats.farmers': 'ಸಕ್ರಿಯ ರೈತರು',
        'hero.stats.dealers': 'ಪರಿಶೀಲಿತ ವ್ಯಾಪಾರಿಗಳು',
        'hero.stats.products': 'ಪಟ್ಟಿ ಮಾಡಲಾದ ಉತ್ಪನ್ನಗಳು',
        
        // Features
        'features.title': 'ಆಧುನಿಕ ಕೃಷಿಗಾಗಿ ಶಕ್ತಿಶಾಲಿ ವೈಶಿಷ್ಟ್ಯಗಳು',
        'features.subtitle': 'ನಿಮ್ಮ ಕೃಷಿ ವ್ಯವಹಾರವನ್ನು ಡಿಜಿಟಲ್ ಆಗಿ ನಿರ್ವಹಿಸಲು ಬೇಕಾದ ಎಲ್ಲವೂ',
        'features.weather': 'ನೈಜ-ಸಮಯದ ಹವಾಮಾನ',
        'features.weather.desc': 'ನಿಮ್ಮ ಕೃಷಿ ಸ್ಥಳಕ್ಕೆ ನಿಖರವಾದ ಹವಾಮಾನ ಮುನ್ನೋಟಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ',
        'features.prices': 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
        'features.prices.desc': 'ತಿಳುವಳಿಕೆಯುಳ್ಳ ಮಾರಾಟ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ದೈನಂದಿನ ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ಪ್ರವೇಶಿಸಿ',
        'features.ai': 'AI ಶಿಫಾರಸುಗಳು',
        'features.ai.desc': 'ಮಣ್ಣಿನ ಪ್ರಕಾರ ಮತ್ತು ಋತುವಿನ ಆಧಾರದ ಮೇಲೆ ಬುದ್ಧಿವಂತ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ',
        'features.marketplace': 'ಆನ್‌ಲೈನ್ ಮಾರುಕಟ್ಟೆ',
        'features.marketplace.desc': 'ಪರಿಶೀಲಿತ ವ್ಯಾಪಾರಿಗಳಿಂದ ಗುಣಮಟ್ಟದ ಬೆಳೆಗಳು, ಗೊಬ್ಬರಗಳು ಮತ್ತು ಉಪಕರಣಗಳನ್ನು ಖರೀದಿಸಿ',
        'features.voice': 'ಧ್ವನಿ ಬೆಂಬಲ',
        'features.voice.desc': 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಧ್ವನಿ ಆಜ್ಞೆಗಳನ್ನು ಬಳಸಿಕೊಂಡು ವೇದಿಕೆಯೊಂದಿಗೆ ಸಂವಹನ ನಡೆಸಿ',
        'features.multilang': 'ಬಹು-ಭಾಷೆ',
        'features.multilang.desc': 'ಸುಲಭ ಪ್ರವೇಶಕ್ಕಾಗಿ ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಮತ್ತು ಹಿಂದಿಯಲ್ಲಿ ಲಭ್ಯವಿದೆ',
        
        // About
        'about.title': 'E-AGRI ಬಗ್ಗೆ',
        'about.subtitle': 'ಡಿಜಿಟಲ್ ನವೀಕರಣದ ಮೂಲಕ ಕೃಷಿಯನ್ನು ಪರಿವರ್ತಿಸುವುದು',
        
        // Contact
        'contact.title': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
        'contact.subtitle': 'ನಮ್ಮ ತಂಡದೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ',
        'contact.address': 'ವಿಳಾಸ',
        'contact.phone': 'ದೂರವಾಣಿ',
        'contact.email': 'ಇಮೇಲ್',
        'contact.send': 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
        
        // Common
        'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        'common.save': 'ಉಳಿಸಿ',
        'common.cancel': 'ರದ್ದುಮಾಡಿ',
        'common.submit': 'ಸಲ್ಲಿಸಿ',
        'common.close': 'ಮುಚ್ಚಿ'
    },
    
    hindi: {
        // Navigation
        'nav.home': 'होम',
        'nav.features': 'विशेषताएं',
        'nav.about': 'हमारे बारे में',
        'nav.contact': 'संपर्क करें',
        'nav.login': 'लॉगिन',
        'nav.register': 'रजिस्टर',
        
        // Hero Section
        'hero.title': 'किसानों को सशक्त बनाना',
        'hero.title.highlight': 'डिजिटल तकनीक',
        'hero.subtitle': 'रियल-टाइम मौसम अपडेट, बाजार की कीमतें, AI-संचालित फसल सिफारिशें, और सत्यापित डीलरों तक पहुंच प्राप्त करें',
        'hero.btn.getstarted': 'शुरू करें',
        'hero.btn.learnmore': 'और जानें',
        'hero.stats.farmers': 'सक्रिय किसान',
        'hero.stats.dealers': 'सत्यापित डीलर',
        'hero.stats.products': 'सूचीबद्ध उत्पाद',
        
        // Features
        'features.title': 'आधुनिक कृषि के लिए शक्तिशाली सुविधाएं',
        'features.subtitle': 'अपने कृषि व्यवसाय को डिजिटल रूप से प्रबंधित करने के लिए आवश्यक सब कुछ',
        'features.weather': 'रियल-टाइम मौसम',
        'features.weather.desc': 'अपने खेत के स्थान के लिए सटीक मौसम पूर्वानुमान और अलर्ट प्राप्त करें',
        'features.prices': 'बाजार मूल्य',
        'features.prices.desc': 'सूचित बिक्री निर्णय लेने के लिए दैनिक मंडी की कीमतों तक पहुंचें',
        'features.ai': 'AI सिफारिशें',
        'features.ai.desc': 'मिट्टी के प्रकार और मौसम के आधार पर स्मार्ट फसल सुझाव प्राप्त करें',
        'features.marketplace': 'ऑनलाइन बाज़ार',
        'features.marketplace.desc': 'सत्यापित डीलरों से गुणवत्ता वाली फसलें, उर्वरक और उपकरण खरीदें',
        'features.voice': 'आवाज़ सहायता',
        'features.voice.desc': 'अपनी भाषा में ध्वनि कमांड का उपयोग करके प्लेटफ़ॉर्म के साथ इंटरैक्ट करें',
        'features.multilang': 'बहु-भाषा',
        'features.multilang.desc': 'आसान पहुंच के लिए अंग्रेजी, कन्नड़ और हिंदी में उपलब्ध',
        
        // About
        'about.title': 'E-AGRI के बारे में',
        'about.subtitle': 'डिजिटल नवाचार के माध्यम से कृषि को बदलना',
        
        // Contact
        'contact.title': 'संपर्क करें',
        'contact.subtitle': 'हमारी टीम के साथ संपर्क में रहें',
        'contact.address': 'पता',
        'contact.phone': 'फ़ोन',
        'contact.email': 'ईमेल',
        'contact.send': 'संदेश भेजें',
        
        // Common
        'common.loading': 'लोड हो रहा है...',
        'common.save': 'सहेजें',
        'common.cancel': 'रद्द करें',
        'common.submit': 'जमा करें',
        'common.close': 'बंद करें'
    }
};

// Current language
let currentLanguage = localStorage.getItem('eagri_language') || 'english';

// Initialize language support
function initLanguage() {
    // Check if language selector exists
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = currentLanguage;
        languageSelector.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    // Apply current language
    applyLanguage(currentLanguage);
}

// Change language
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error('Language not supported:', lang);
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('eagri_language', lang);
    applyLanguage(lang);
    
    // Show notification
    if (typeof eagri !== 'undefined' && eagri.showNotification) {
        const langNames = {
            english: 'English',
            kannada: 'ಕನ್ನಡ',
            hindi: 'हिंदी'
        };
        eagri.showNotification(`Language changed to ${langNames[lang]}`, 'success');
    }
}

// Apply language to page
function applyLanguage(lang) {
    const trans = translations[lang];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (trans[key]) {
            // Check if it's an input placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = trans[key];
            } else {
                element.textContent = trans[key];
            }
        }
    });
    
    // Update document direction for RTL languages if needed
    // document.documentElement.dir = (lang === 'arabic' || lang === 'urdu') ? 'rtl' : 'ltr';
}

// Get translation
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Add language selector to navbar if not exists
function addLanguageSelector() {
    const navbar = document.querySelector('.navbar .container');
    if (!navbar) return;
    
    // Check if selector already exists
    if (document.getElementById('languageSelector')) return;
    
    const navActions = navbar.querySelector('.nav-actions');
    if (!navActions) return;
    
    const selectorHTML = `
        <select id="languageSelector" class="language-selector" onchange="changeLanguage(this.value)">
            <option value="english">English</option>
            <option value="kannada">ಕನ್ನಡ</option>
            <option value="hindi">हिंदी</option>
        </select>
    `;
    
    navActions.insertAdjacentHTML('afterbegin', selectorHTML);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        addLanguageSelector();
        initLanguage();
    });
} else {
    addLanguageSelector();
    initLanguage();
}

// Export functions
window.changeLanguage = changeLanguage;
window.t = t;

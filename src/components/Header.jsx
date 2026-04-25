import { Sprout, Moon, Sun } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode, language, setLanguage, translations }) => {
    const t = translations[language];

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        <Sprout className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t.appTitle}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                            {t.appSubtitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                        {language === 'en' ? 'हिंदी' : 'English'}
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
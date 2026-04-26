// PWA Install Button Component
import { Download, Check, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const InstallButton = ({ language, translations }) => {
    const { isInstallable, isInstalled, installApp } = usePWAInstall();
    const t = translations[language];

    // Don't show if already installed
    if (isInstalled) return null;

    // Show install button if PWA is installable
    if (isInstallable) {
        return (
            <button
                onClick={installApp}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
                <Download className="w-5 h-5" />
                {t.installApp}
            </button>
        );
    }

    // Show iOS install instructions for Safari users
    if (typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
        return (
            <div className="relative group">
                <button
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                >
                    <Info className="w-5 h-5" />
                    {t.installHelp}
                </button>
                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>{t.iosInstructions}:</strong><br />
                        1. {t.tapShare}<br />
                        2. {t.tapAddToHome}
                    </p>
                </div>
            </div>
        );
    }

    return null;
};

export default InstallButton;
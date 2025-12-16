import { Globe, Check } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import type { Language } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'th' as Language, name: 'Thai', nativeName: 'ไทย' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find(l => l.code === language)?.nativeName}
          </span>
          <span className="sm:hidden">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">({lang.name})</span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for mobile or tight spaces
export function LanguageSwitcherCompact() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'th' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="font-mono text-xs">
        {language === 'en' ? 'EN' : 'TH'}
      </span>
    </Button>
  );
}

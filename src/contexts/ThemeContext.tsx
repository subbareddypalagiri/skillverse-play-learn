import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
};

const colorPalettes: ColorPalette[] = [
  {
    name: 'Purple',
    primary: '139, 92, 246',
    secondary: '168, 85, 247',
    accent: '147, 51, 234'
  },
  {
    name: 'Blue',
    primary: '59, 130, 246',
    secondary: '96, 165, 250',
    accent: '37, 99, 235'
  },
  {
    name: 'Green',
    primary: '34, 197, 94',
    secondary: '74, 222, 128',
    accent: '22, 163, 74'
  },
  {
    name: 'Orange',
    primary: '251, 146, 60',
    secondary: '253, 186, 116',
    accent: '249, 115, 22'
  },
  {
    name: 'Pink',
    primary: '236, 72, 153',
    secondary: '244, 114, 182',
    accent: '219, 39, 119'
  },
  {
    name: 'Teal',
    primary: '20, 184, 166',
    secondary: '94, 234, 212',
    accent: '13, 148, 136'
  }
];

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorPalette?: ColorPalette;
  storageKey?: string;
  colorStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  availablePalettes: ColorPalette[];
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  colorPalette: colorPalettes[0],
  setColorPalette: () => null,
  availablePalettes: colorPalettes
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorPalette = colorPalettes[0],
  storageKey = 'risee-ui-theme',
  colorStorageKey = 'risee-color-palette',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [colorPalette, setColorPaletteState] = useState<ColorPalette>(
    () => {
      const savedPalette = localStorage.getItem(colorStorageKey);
      if (savedPalette) {
        try {
          const parsed = JSON.parse(savedPalette);
          return colorPalettes.find(p => p.name === parsed.name) || parsed;
        } catch {
          return defaultColorPalette;
        }
      }
      return defaultColorPalette;
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Update CSS custom properties for colors
    root.style.setProperty('--primary-rgb', colorPalette.primary);
    root.style.setProperty('--secondary-rgb', colorPalette.secondary);
    root.style.setProperty('--accent-rgb', colorPalette.accent);
  }, [colorPalette]);

  const setColorPalette = (palette: ColorPalette) => {
    localStorage.setItem(colorStorageKey, JSON.stringify(palette));
    setColorPaletteState(palette);
  };

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    colorPalette,
    setColorPalette,
    availablePalettes: colorPalettes
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

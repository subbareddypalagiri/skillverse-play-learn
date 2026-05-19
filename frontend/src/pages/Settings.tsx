import { useState } from "react";
import { Sun, Moon, Monitor, Save, RotateCcw, Sparkles, Palette, Check, Settings2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import PageLayout from "@/components/PageLayout";

const Settings = () => {
  const { theme, setTheme, colorPalette, setColorPalette, availablePalettes } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);
  const [tempTheme, setTempTheme] = useState(theme);
  const [tempPalette, setTempPalette] = useState(colorPalette);
  const [saved, setSaved] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => { setTempTheme(newTheme); setHasChanges(true); };
  const handlePaletteChange = (palette: any) => { setTempPalette(palette); setHasChanges(true); };

  const handleSave = () => {
    setTheme(tempTheme);
    setColorPalette(tempPalette);
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setTempTheme('system');
    setTempPalette(availablePalettes[0]);
    setHasChanges(true);
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Clean bright interface' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follows device' },
  ];

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-reveal-up">
          <div className="badge-gradient inline-flex mb-4">
            <Settings2 className="w-3 h-3" />
            Preferences
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Settings
          </h1>
          <p className="text-muted-foreground">Personalize your Risee experience</p>
        </div>

        {/* Saved toast */}
        {saved && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-3 animate-reveal-up">
            <Check className="w-4 h-4" />
            Settings saved successfully!
          </div>
        )}

        {/* Appearance Card */}
        <div className="rounded-2xl border border-border/50 overflow-hidden mb-5 animate-reveal-up delay-100"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center justify-between p-6 border-b border-border/40">
            <div>
              <h2 className="font-bold text-foreground text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>Appearance</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Choose your preferred theme</p>
            </div>
            {hasChanges && (
              <span className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400">
                Unsaved changes
              </span>
            )}
          </div>

          <div className="p-6">
            {/* Theme options */}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Theme Mode</h3>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {themeOptions.map(({ value, label, icon: Icon, description }) => {
                const isSelected = tempTheme === value;
                return (
                  <button key={value} onClick={() => handleThemeChange(value as any)}
                    className={`relative group flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-300 text-center ${
                      isSelected
                        ? 'border-primary/50 bg-primary/8 shadow-[0_0_20px_rgba(124,58,237,0.12)]'
                        : 'border-border/40 hover:border-border hover:bg-white/3'
                    }`}>
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground group-hover:text-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{label}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Color palette */}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" /> Color Theme
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availablePalettes.map((palette) => {
                const isSelected = tempPalette.name === palette.name;
                return (
                  <button key={palette.name} onClick={() => handlePaletteChange(palette)}
                    className={`relative group p-4 rounded-xl border transition-all duration-300 text-left ${
                      isSelected
                        ? 'border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                        : 'border-border/40 hover:border-border hover:bg-white/3'
                    }`}>
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <div className="w-full h-10 rounded-lg mb-3 shadow-inner"
                      style={{ background: `linear-gradient(135deg, rgb(${palette.primary}), rgb(${palette.secondary}))` }} />
                    <p className="text-xs font-semibold text-foreground">{palette.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t border-border/40 bg-white/1">
            <button onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground border border-border/50 hover:text-foreground hover:border-border hover:bg-white/3 transition-all duration-200">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset defaults
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => { setTempTheme(theme); setTempPalette(colorPalette); setHasChanges(false); }}
                disabled={!hasChanges}
                className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground border border-border/50 hover:text-foreground hover:border-border transition-all duration-200 disabled:opacity-40">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!hasChanges}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-40 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                <Save className="w-3.5 h-3.5" />
                Save changes
              </button>
            </div>
          </div>
        </div>

        {/* Current settings summary */}
        <div className="rounded-2xl border border-border/50 p-6 animate-reveal-up delay-200"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            <Sparkles className="w-4 h-4 text-primary" />
            Current Settings
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-border/30">
              <span className="text-sm text-muted-foreground">Theme Mode</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">{theme}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-border/30">
              <span className="text-sm text-muted-foreground">Color Palette</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full shadow-sm"
                  style={{ background: `linear-gradient(135deg, rgb(${colorPalette.primary}), rgb(${colorPalette.secondary}))` }} />
                <span className="text-xs font-semibold text-foreground">{colorPalette.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;

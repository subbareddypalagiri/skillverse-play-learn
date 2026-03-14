import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Monitor, Palette, Save, RotateCcw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import PageLayout from "@/components/PageLayout";

const Settings = () => {
  const { theme, setTheme, colorPalette, setColorPalette, availablePalettes } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);
  const [tempTheme, setTempTheme] = useState(theme);
  const [tempPalette, setTempPalette] = useState(colorPalette);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTempTheme(newTheme);
    setHasChanges(true);
  };

  const handlePaletteChange = (palette: any) => {
    setTempPalette(palette);
    setHasChanges(true);
  };

  const handleSave = () => {
    setTheme(tempTheme);
    setColorPalette(tempPalette);
    setHasChanges(false);
  };

  const handleReset = () => {
    setTempTheme('system');
    setTempPalette(availablePalettes[0]);
    setHasChanges(true);
  };

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Clean and bright interface'
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes in low light'
    },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
      description: 'Follows your device preference'
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Customize your RISEE experience</p>
          </div>

          {/* Theme Settings */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Appearance</h2>
                <p className="text-muted-foreground">Choose your preferred theme and colors</p>
              </div>
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Unsaved changes
                </Badge>
              )}
            </div>

            {/* Theme Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Theme Mode</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = tempTheme === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value as any)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-card'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {option.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      {isSelected && (
                        <div className="mt-3">
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Color Theme</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {availablePalettes.map((palette) => {
                  const isSelected = tempPalette.name === palette.name;
                  
                  return (
                    <button
                      key={palette.name}
                      onClick={() => handlePaletteChange(palette)}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? 'border-primary shadow-card'
                          : 'border-border hover:border-primary/50'
                      }`}
                      title={palette.name}
                    >
                      <div
                        className="w-full h-12 rounded-md mb-2"
                        style={{
                          background: `linear-gradient(135deg, rgb(${palette.primary}), rgb(${palette.secondary}))`
                        }}
                      />
                      <p className="text-sm font-medium text-foreground">{palette.name}</p>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Default</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTempTheme(theme);
                    setTempPalette(colorPalette);
                    setHasChanges(false);
                  }}
                  disabled={!hasChanges}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Current Settings Display */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Current Settings</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Theme Mode</span>
                <Badge variant="secondary">{theme}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Color Palette</span>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, rgb(${colorPalette.primary}), rgb(${colorPalette.secondary}))`
                    }}
                  />
                  <Badge variant="secondary">{colorPalette.name}</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
    </PageLayout>
  );
};

export default Settings;

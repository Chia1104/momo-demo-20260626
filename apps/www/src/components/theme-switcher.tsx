import { Button, useTheme, ButtonGroup } from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme("system");

  return (
    <ButtonGroup variant="outline" size="sm" className="p-1">
      <Button
        onPress={() => setTheme("light")}
        isIconOnly
        variant={theme === "light" ? "secondary" : "ghost"}>
        <Sun className="h-5 w-5" />
      </Button>
      <Button
        onPress={() => setTheme("dark")}
        isIconOnly
        variant={theme === "dark" ? "secondary" : "ghost"}>
        <Moon className="h-5 w-5" />
      </Button>
      <Button
        onPress={() => setTheme("system")}
        isIconOnly
        variant={theme === "system" ? "secondary" : "ghost"}>
        <Monitor className="h-5 w-5" />
      </Button>
    </ButtonGroup>
  );
}

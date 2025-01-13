import { useState, useEffect } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import useResizeObserver from "use-resize-observer";
import { Flex, Theme, Box, Tabs, ThemeProps } from "@radix-ui/themes";
import {
  BookOpenIcon,
  FlaskConicalIcon,
  HashIcon,
  WandIcon,
} from "lucide-react";
import "@radix-ui/themes/styles.css";
import "./App.css";
import { useLocalStorage, useTheme } from "./hooks";
import Generator from "./components/Generator";
import Hasher from "./components/Hasher";
import Analyzer from "./components/Analyzer";
import Principles from "./components/Principles";

const ACCENT_COLOR_KEY = "passwords-app-accent-color";
const DEFAULT_ACCENT_COLOR = "indigo";

function App() {
  const [panelType, setPanelType] = useState("generator");

  const theme = useTheme();
  const [storedThemeColorValue, setThemeColorValue] = useLocalStorage(
    ACCENT_COLOR_KEY,
    DEFAULT_ACCENT_COLOR
  );

  async function setWindowHeight(height: number) {
    await getCurrentWindow().setSize(new LogicalSize(480, height));
  }

  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ height }) => {
      if (height) {
        setWindowHeight(height);
      }
    },
  });

  useEffect(() => {
    // disable context menu
    document.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        return false;
      },
      { capture: true }
    );
  }, []);

  return (
    <Theme
      appearance={theme}
      hasBackground={true}
      panelBackground="translucent"
      accentColor={storedThemeColorValue as ThemeProps["accentColor"]}
      grayColor="slate"
    >
      <Box ref={ref} data-tauri-drag-region>
        <Box
          height="30px"
          data-tauri-drag-region
          style={{
            backgroundColor:
              theme === "light"
                ? "whitesmoke"
                : theme === "dark"
                ? "black"
                : "",
          }}
        ></Box>
        <Tabs.Root value={panelType} onValueChange={setPanelType}>
          <Tabs.List
            justify="center"
            style={{
              backgroundColor:
                theme === "light"
                  ? "whitesmoke"
                  : theme === "dark"
                  ? "black"
                  : "",
            }}
          >
            <Tabs.Trigger value="generator">
              <Flex gap="2" align="center">
                <WandIcon size={16} />
                Generator
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="hasher">
              <Flex gap="2" align="center">
                <HashIcon size={16} />
                Hasher
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="analyzer">
              <Flex gap="2" align="center">
                <FlaskConicalIcon size={16} />
                Analyzer
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="principles">
              <Flex gap="2" align="center">
                <BookOpenIcon size={16} />
                Principles
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>
          <Box px="5" py="4" data-tauri-drag-region>
            <Tabs.Content value="generator">
              <Generator />
            </Tabs.Content>
            <Tabs.Content value="hasher">
              <Hasher />
            </Tabs.Content>
            <Tabs.Content value="analyzer">
              <Analyzer />
            </Tabs.Content>
            <Tabs.Content value="principles">
              <Principles setThemeColorValue={setThemeColorValue} />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Theme>
  );
}

export default App;

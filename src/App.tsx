import { useEffect, useState } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import useResizeObserver from "use-resize-observer";
import {
  Flex,
  Theme,
  Text,
  Button,
  Grid,
  Card,
  Slider,
  TextField,
  Box,
  Switch,
  Badge,
  DataList,
  BadgeProps,
  Tabs,
  RadioCards,
  Heading,
  Separator,
  TextArea,
  IconButton,
  Spinner,
  Table,
  ButtonProps,
  ThemeProps,
  Tooltip,
} from "@radix-ui/themes";
import {
  BookOpenIcon,
  CircleHelpIcon,
  ClipboardPasteIcon,
  DraftingCompassIcon,
  EraserIcon,
  FlaskConicalIcon,
  HashIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  ShuffleIcon,
  SignatureIcon,
  SquareAsteriskIcon,
  WandIcon,
} from "lucide-react";
import "@radix-ui/themes/styles.css";
import "./App.css";
import { isDigit, isLetter } from "./utils";
import {
  useCopy,
  useDebounce,
  useLocalStorage,
  useTheme,
} from "./hooks";
import natives, { AnalyzedResult } from "./natives";
import Hasher from "./components/Hasher";

const ACCENT_COLOR_KEY = "passwords-app-accent-color";
const DEFAULT_ACCENT_COLOR = "indigo";
const COLORS: ButtonProps["color"][] = [
  "gray",
  "gold",
  "bronze",
  "brown",
  "yellow",
  "amber",
  "orange",
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "lime",
  "mint",
  "sky",
];

const getStrengthString = (score: number): string => {
  if (score >= 0 && score < 20) {
    return "VERY DANGEROUS";
  } else if (score >= 20 && score < 40) {
    return "DANGEROUS";
  } else if (score >= 40 && score < 60) {
    return "VERY WEAK";
  } else if (score >= 60 && score < 80) {
    return "WEAK";
  } else if (score >= 80 && score < 90) {
    return "GOOD";
  } else if (score >= 90 && score < 95) {
    return "STRONG";
  } else if (score >= 95 && score < 99) {
    return "VERY STRONG";
  } else if (score >= 99 && score <= 100) {
    return "INVULNERABLE";
  } else return "";
};

const getStrengthColor = (score: number): BadgeProps["color"] | undefined => {
  if (score >= 0 && score < 40) {
    return "red";
  } else if (score >= 40 && score < 60) {
    return "orange";
  } else if (score >= 60 && score < 80) {
    return "yellow";
  } else if (score >= 80 && score <= 100) {
    return "green";
  } else {
    return undefined;
  }
};

function App() {
  const [panelType, setPanelType] = useState("generator");
  const [passwordType, setPasswordType] = useState("random");
  const [randomLength, setRandomLength] = useState(20);
  const [randomSymbols, setRandomSymbols] = useState(false);
  const [randomNumbers, setRandomNumbers] = useState(true);
  const [randomUppercase, setRandomUppercase] = useState(true);
  const [randomExcludeSimilarChars, setRandomExcludeSimilarChars] =
    useState(false);
  const [randomStrict, setRandomStrict] = useState(true);
  const [memorableLength, setMemorableLength] = useState(4);
  const [memorableUseFullWords, setMemorableUseFullWords] = useState(true);
  const [memorableCapitalize, setMemorableCapitalize] = useState(false);
  const [memorableUppercase, setMemorableUppercase] = useState(false);
  const [memorableSeparator, setMemorableSeparator] = useState("-");
  const [pinLength, setPinLength] = useState(6);
  const [strength, setStrength] = useState("");
  const [strengthColor, setStrengthColor] =
    useState<BadgeProps["color"]>(undefined);
  const [crackTime, setCrackTime] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [password, setPassword] = useState("");
  const [analysisPassword, setAnalysisPassword] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalyzedResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const randomLengthDebounce = useDebounce(randomLength, 200);
  const memorableLengthDebounce = useDebounce(memorableLength, 200);
  const pinLengthDebounce = useDebounce(pinLength, 200);
  const analyzeDebounce = useDebounce(analysisPassword, 400);

  const theme = useTheme();
  const { isCopied, copyToClipboard, resetCopyStatus } = useCopy();
  const [storedThemeColorValue, setThemeColorValue] = useLocalStorage(
    ACCENT_COLOR_KEY,
    DEFAULT_ACCENT_COLOR
  );

  async function generateRandomPassword() {
    const pass: string = await natives.generatePassword({
      length: randomLength,
      symbols: randomSymbols,
      numbers: randomNumbers,
      uppercase: randomUppercase,
      lowercase: true,
      spaces: false,
      excludeSimilarCharacters: randomExcludeSimilarChars,
      strict: randomStrict,
    });
    const score: number = await natives.score(pass);
    const time: string = await natives.crackTimes(pass);
    setPassword(pass);
    setStrength(getStrengthString(score));
    setStrengthColor(getStrengthColor(score));
    setCrackTime(time);
    setIsGenerating(false);
    resetCopyStatus();
  }

  async function generateWords() {
    const words: string[] = await natives.generateWords(
      memorableLength,
      memorableUseFullWords
    );
    let pass = words
      .map((w) =>
        memorableUppercase
          ? w.toUpperCase()
          : memorableCapitalize
          ? w.charAt(0).toUpperCase() + w.slice(1)
          : w
      )
      .join(memorableSeparator === "" ? " " : memorableSeparator);
    setPassword(pass);
    setIsGenerating(false);
    resetCopyStatus();
  }

  async function generatePin() {
    setPassword(await natives.generatePin(pinLength));
    setIsGenerating(false);
    resetCopyStatus();
  }

  async function analyzeAsync() {
    setIsAnalyzing(true);
    if (analysisPassword) {
      let obj: AnalyzedResult = await natives.analyze(analysisPassword);
      obj.score = await natives.score(analysisPassword);
      obj.crack_times = await natives.crackTimes(analysisPassword);
      setAnalysisResult(obj);
    } else {
      setAnalysisResult(null);
    }
    setIsAnalyzing(false);
  }

  useEffect(() => {
    setIsGenerating(true);
    generateRandomPassword();
  }, [
    randomLengthDebounce,
    randomNumbers,
    randomSymbols,
    randomUppercase,
    randomExcludeSimilarChars,
    randomStrict,
  ]);

  useEffect(() => {
    setIsGenerating(true);
    generateWords();
  }, [
    memorableLengthDebounce,
    memorableCapitalize,
    memorableUppercase,
    memorableUseFullWords,
    memorableSeparator,
  ]);

  useEffect(() => {
    setIsGenerating(true);
    generatePin();
  }, [pinLengthDebounce]);

  useEffect(() => {
    analyzeAsync();
  }, [analyzeDebounce]);

  const copy = async () => {
    await copyToClipboard(password);
  };

  useEffect(() => {
    if (passwordType === "random") {
      setIsGenerating(true);
      generateRandomPassword();
    } else if (passwordType === "memorable") {
      setIsGenerating(true);
      generateWords();
    } else if (passwordType === "pin") {
      setIsGenerating(true);
      generatePin();
    }
  }, [passwordType]);

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
              <Flex direction="column" gap="2">
                <Text weight="medium">Choose a password type</Text>
                <RadioCards.Root
                  size="1"
                  columns="3"
                  value={passwordType}
                  onValueChange={setPasswordType}
                  my="2"
                  gap="3"
                >
                  <RadioCards.Item value="random">
                    <Flex gap="2" align="center">
                      <ShuffleIcon size={16} strokeWidth={1} />
                      Random
                    </Flex>
                  </RadioCards.Item>

                  <RadioCards.Item value="memorable">
                    <Flex gap="2" align="center">
                      <LightbulbIcon size={16} strokeWidth={1} />
                      Memorable
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="pin">
                    <Flex gap="2" align="center">
                      <SquareAsteriskIcon size={16} strokeWidth={1} />
                      PIN
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
                <Text weight="medium">Customize your password</Text>
                {passwordType === "random" ? (
                  <Flex direction="column" gap="4" my="2">
                    <Flex gap="4" align="center">
                      <Text color="gray">Characters</Text>
                      <Slider
                        value={[randomLength]}
                        onValueChange={(values) => setRandomLength(values[0])}
                        min={4}
                        max={128}
                      />
                      <Box width="50px">
                        <TextField.Root
                          size="1"
                          type="number"
                          min="4"
                          max="128"
                          value={randomLength}
                          readOnly
                        />
                      </Box>
                    </Flex>
                    <Separator size="4" />
                    <Flex gap="4" align="center" wrap="wrap">
                      <Text color="gray">Numbers</Text>
                      <Switch
                        checked={randomNumbers}
                        onCheckedChange={setRandomNumbers}
                      />
                      <Text color="gray">Symbols</Text>
                      <Switch
                        checked={randomSymbols}
                        onCheckedChange={setRandomSymbols}
                      />
                      <Text color="gray">Uppercase</Text>
                      <Switch
                        checked={randomUppercase}
                        onCheckedChange={setRandomUppercase}
                      />
                    </Flex>
                    <Separator size="4" />
                    <Flex gap="4" align="center" wrap="wrap">
                      <Flex align="center" wrap="wrap" gap="1">
                        <Text color="gray">Exclude similar characters</Text>
                        <Tooltip content={"iI1loO0\"'`|"}>
                          <IconButton variant="ghost" size="1">
                            <CircleHelpIcon size={16} color="gray" />
                          </IconButton>
                        </Tooltip>
                      </Flex>
                      <Switch
                        checked={randomExcludeSimilarChars}
                        onCheckedChange={setRandomExcludeSimilarChars}
                      />
                      <Text color="gray">Strict</Text>
                      <Switch
                        checked={randomStrict}
                        onCheckedChange={setRandomStrict}
                      />
                    </Flex>
                  </Flex>
                ) : passwordType === "memorable" ? (
                  <Flex my="2" direction="column" gap="4">
                    <Flex gap="4" align="center">
                      <Text color="gray">Characters</Text>
                      <Slider
                        value={[memorableLength]}
                        onValueChange={(values) =>
                          setMemorableLength(values[0])
                        }
                        min={3}
                        max={20}
                      />
                      <Box width="50px">
                        <TextField.Root
                          size="1"
                          type="number"
                          min="3"
                          max="20"
                          value={memorableLength}
                          readOnly
                        />
                      </Box>
                    </Flex>
                    <Separator size="4" />
                    <Flex gap="4" align="center">
                      <Text color="gray">Capitalize</Text>
                      <Switch
                        checked={memorableCapitalize}
                        onCheckedChange={(checked) => {
                          setMemorableCapitalize(checked);
                          if (checked) {
                            setMemorableUppercase(false);
                          }
                        }}
                      />
                      <Text color="gray">Uppercase</Text>
                      <Switch
                        checked={memorableUppercase}
                        onCheckedChange={(checked) => {
                          setMemorableUppercase(checked);
                          if (checked) {
                            setMemorableCapitalize(false);
                          }
                        }}
                      />
                    </Flex>
                    <Separator size="4" />
                    <Flex gap="4" align="center">
                      <Text color="gray">Use full words</Text>
                      <Switch
                        checked={memorableUseFullWords}
                        onCheckedChange={setMemorableUseFullWords}
                      />
                      <Text color="gray">Separator</Text>
                      <Box width="100px">
                        <TextField.Root
                          size="2"
                          maxLength={10}
                          value={memorableSeparator}
                          onChange={(e) =>
                            setMemorableSeparator(e.currentTarget.value)
                          }
                        />
                      </Box>
                    </Flex>
                  </Flex>
                ) : (
                  <Flex my="2" direction="column" gap="4">
                    <Flex gap="4" align="center">
                      <Text color="gray">Characters</Text>
                      <Slider
                        value={[pinLength]}
                        onValueChange={(values) => setPinLength(values[0])}
                        min={3}
                        max={12}
                      />
                      <Box width="50px">
                        <TextField.Root
                          size="1"
                          type="number"
                          min="3"
                          max="12"
                          value={pinLength}
                          readOnly
                        />
                      </Box>
                    </Flex>
                  </Flex>
                )}
                <Text weight="medium" my="2">
                  Generated Password
                </Text>
                <Card
                  onDoubleClick={async () => {
                    copy();
                  }}
                >
                  <Flex minHeight="80px" align="center" justify="center" p="2">
                    <Flex
                      wrap="wrap"
                      align="center"
                      justify="center"
                      gap={passwordType === "pin" ? "2" : "0"}
                    >
                      {[...password].map((char, i) =>
                        char === " " ? (
                          <span key={i}>&nbsp;</span>
                        ) : (
                          <Text
                            key={i}
                            size={passwordType === "pin" ? "8" : "4"}
                            color={
                              isDigit(char)
                                ? "blue"
                                : isLetter(char)
                                ? undefined
                                : "orange"
                            }
                            weight="medium"
                          >
                            {char}
                          </Text>
                        )
                      )}
                    </Flex>
                  </Flex>
                </Card>
                {passwordType === "random" ? (
                  <Box my="2">
                    <DataList.Root>
                      <DataList.Item align="center">
                        <DataList.Label>Your password strength:</DataList.Label>
                        <DataList.Value>
                          <Badge color={strengthColor}>{strength}</Badge>
                        </DataList.Value>
                      </DataList.Item>
                      <DataList.Item align="center">
                        <DataList.Label>
                          Estimated time to crack:
                        </DataList.Label>
                        <DataList.Value>{crackTime}</DataList.Value>
                      </DataList.Item>
                    </DataList.Root>
                  </Box>
                ) : null}
                <Grid columns="2" gap="4" width="auto" my="2">
                  <Button
                    size="3"
                    variant="solid"
                    color={isCopied ? "green" : undefined}
                    onClick={async () => {
                      copy();
                    }}
                  >
                    {isCopied ? "Password Copied!" : "Copy Password"}
                  </Button>
                  <Button
                    size="3"
                    variant="outline"
                    onClick={() => {
                      if (passwordType === "random") {
                        setIsGenerating(true);
                        generateRandomPassword();
                      } else if (passwordType === "memorable") {
                        setIsGenerating(true);
                        generateWords();
                      } else if (passwordType === "pin") {
                        setIsGenerating(true);
                        generatePin();
                      }
                    }}
                  >
                    Refresh Password
                  </Button>
                </Grid>
              </Flex>
              <Flex align="center" gap="2" justify="center" height="1px" mt="1">
                {isGenerating ? (
                  <>
                    <Spinner size="1" />
                    <Text color="gray" size="1">
                      generating...
                    </Text>
                  </>
                ) : null}
              </Flex>
            </Tabs.Content>
            <Tabs.Content value="hasher">
              <Hasher />
            </Tabs.Content>
            <Tabs.Content value="analyzer">
              <Flex direction="column" mb="3">
                <TextArea
                  placeholder="Enter or paste password here..."
                  value={analysisPassword}
                  rows={2}
                  onChange={(e) => setAnalysisPassword(e.currentTarget.value)}
                />
              </Flex>
              <Flex align="center" gap="4" justify="end" pr="2" mb="3">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    const clipboardText = await readText();
                    if (clipboardText !== analysisPassword) {
                      setIsAnalyzing(true);
                      setAnalysisPassword(clipboardText);
                    }
                  }}
                >
                  <ClipboardPasteIcon size={16} strokeWidth={1} /> Paste
                </Button>
                <Button variant="ghost" onClick={() => setAnalysisPassword("")}>
                  <EraserIcon size={16} strokeWidth={1} /> Clear
                </Button>
              </Flex>
              <Flex direction="column" gap="4">
                <Table.Root variant="surface">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Number of characters</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.length}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Lowercase letters</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.lowercase_letters_count}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Uppercase letters</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.uppercase_letters_count}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Numbers</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.numbers_count}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Spaces</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.spaces_count}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Symbols</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.symbols_count}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Other characters</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.other_characters_count}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">
                          Consecutive repeated characters
                        </Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.consecutive_count}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">
                          Non consecutive repeated characters
                        </Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.non_consecutive_count}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Progressive characters</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.progressive_count}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
                <Table.Root variant="surface">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Strength</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult ? (
                          <Badge color={getStrengthColor(analysisResult.score)}>
                            {getStrengthString(analysisResult.score)}
                          </Badge>
                        ) : (
                          ""
                        )}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Common password</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult ? (
                          analysisResult.is_common ? (
                            <Badge color="red">YES</Badge>
                          ) : (
                            <Badge color="green">NO</Badge>
                          )
                        ) : (
                          ""
                        )}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Text color="gray">Estimated time to crack</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        {analysisResult?.crack_times}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Flex>
              <Flex align="center" gap="2" justify="center" height="1px" mt="3">
                {isAnalyzing ? (
                  <>
                    <Spinner size="1" />
                    <Text color="gray" size="1">
                      analyzing...
                    </Text>
                  </>
                ) : null}
              </Flex>
            </Tabs.Content>
            <Tabs.Content value="principles">
              <Flex direction="column" gap="2" p="2">
                <Heading size="6" mb="2">
                  The principles of generating a strong password
                </Heading>
                <Flex gap="4" align="center">
                  <SignatureIcon strokeWidth={1} />
                  <Heading size="5" align="center">
                    Make it unique
                  </Heading>
                </Flex>
                <Text size="3" color="gray" mb="2">
                  Passwords should be unique to different accounts. This reduces
                  the likelihood that multiple accounts of yours could be hacked
                  if one of your passwords is exposed in a data breach.
                </Text>
                <Flex gap="4" align="center">
                  <ShuffleIcon strokeWidth={1} />
                  <Heading size="5" align="center">
                    Make it random
                  </Heading>
                </Flex>
                <Text size="3" color="gray" mb="2">
                  The password has a combination of uppercase and lowercase
                  letters, numbers, special characters, and words with no
                  discernable pattern, unrelated to your personal information.
                </Text>
                <Flex gap="4" align="center">
                  <DraftingCompassIcon strokeWidth={1} />
                  <Heading size="5" align="center">
                    Make it long
                  </Heading>
                </Flex>
                <Text size="3" color="gray" mb="2">
                  The password consists of 14 characters or longer. An
                  8-character password will take a hacker 39 minutes to crack
                  while a 16-character password will take a hacker a billion
                  years to crack.
                </Text>
              </Flex>
              <Flex gap="2" wrap="wrap" align="center" justify="center" my="4">
                {COLORS.map((color) => (
                  <IconButton
                    color={color}
                    size="1"
                    value={color}
                    key={color}
                    onClick={(e) => {
                      setThemeColorValue(e.currentTarget.value);
                    }}
                  ></IconButton>
                ))}
              </Flex>
              <Flex align="center" justify="center" p="2">
                <ShieldCheckIcon size={32} color="gray" strokeWidth={1} />
              </Flex>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Theme>
  );
}

export default App;

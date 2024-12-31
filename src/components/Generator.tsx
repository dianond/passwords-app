import { useEffect, useState } from "react";
import {
  Flex,
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
  RadioCards,
  Separator,
  IconButton,
  Spinner,
  Tooltip,
} from "@radix-ui/themes";
import {
  CircleHelpIcon,
  LightbulbIcon,
  ShuffleIcon,
  SquareAsteriskIcon,
} from "lucide-react";
import { useCopy, useDebounce } from "../hooks";
import natives from "../natives";
import {
  isDigit,
  isLetter,
  getStrengthString,
  getStrengthColor,
} from "../utils";

export default function Generator() {
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

  const randomLengthDebounce = useDebounce(randomLength, 200);
  const memorableLengthDebounce = useDebounce(memorableLength, 200);
  const pinLengthDebounce = useDebounce(pinLength, 200);

  const { isCopied, copyToClipboard, resetCopyStatus } = useCopy();

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

  return (
    <>
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
                onValueChange={(values) => setMemorableLength(values[0])}
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
                  onChange={(e) => setMemorableSeparator(e.currentTarget.value)}
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
                <DataList.Label>Estimated time to crack:</DataList.Label>
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
    </>
  );
}

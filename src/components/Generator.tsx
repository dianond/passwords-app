import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Button,
  Grid,
  Card,
  Box,
  Badge,
  DataList,
  BadgeProps,
  RadioCards,
  Spinner,
} from "@radix-ui/themes";
import {
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
import RandomPart from "./RandomPart";
import MemorablePart from "./MemorablePart";
import PinPart from "./PinPart";

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
          <RandomPart
            randomLength={randomLength}
            randomSymbols={randomSymbols}
            randomNumbers={randomNumbers}
            randomUppercase={randomUppercase}
            randomExcludeSimilarChars={randomExcludeSimilarChars}
            randomStrict={randomStrict}
            setRandomLength={setRandomLength}
            setRandomSymbols={setRandomSymbols}
            setRandomNumbers={setRandomNumbers}
            setRandomUppercase={setRandomUppercase}
            setRandomExcludeSimilarChars={setRandomExcludeSimilarChars}
            setRandomStrict={setRandomStrict}
          />
        ) : passwordType === "memorable" ? (
          <MemorablePart
            memorableLength={memorableLength}
            memorableUseFullWords={memorableUseFullWords}
            memorableCapitalize={memorableCapitalize}
            memorableUppercase={memorableUppercase}
            memorableSeparator={memorableSeparator}
            setMemorableLength={setMemorableLength}
            setMemorableUseFullWords={setMemorableUseFullWords}
            setMemorableCapitalize={setMemorableCapitalize}
            setMemorableUppercase={setMemorableUppercase}
            setMemorableSeparator={setMemorableSeparator}
          />
        ) : (
          <PinPart pinLength={pinLength} setPinLength={setPinLength} />
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

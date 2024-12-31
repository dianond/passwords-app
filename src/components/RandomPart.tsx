import {
  Flex,
  Slider,
  Box,
  TextField,
  Text,
  Switch,
  Separator,
  Tooltip,
  IconButton,
} from "@radix-ui/themes";
import { CircleHelpIcon } from "lucide-react";

export default function Randompart(props: {
  randomLength: number;
  randomSymbols: boolean;
  randomNumbers: boolean;
  randomUppercase: boolean;
  randomExcludeSimilarChars: boolean;
  randomStrict: boolean;
  setRandomLength: (value: number) => void;
  setRandomSymbols: (value: boolean) => void;
  setRandomNumbers: (value: boolean) => void;
  setRandomUppercase: (value: boolean) => void;
  setRandomExcludeSimilarChars: (value: boolean) => void;
  setRandomStrict: (value: boolean) => void;
}) {
  const {
    randomLength,
    randomSymbols,
    randomNumbers,
    randomUppercase,
    randomExcludeSimilarChars,
    randomStrict,
    setRandomLength,
    setRandomSymbols,
    setRandomNumbers,
    setRandomUppercase,
    setRandomExcludeSimilarChars,
    setRandomStrict,
  } = props;

  return (
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
        <Switch checked={randomNumbers} onCheckedChange={setRandomNumbers} />
        <Text color="gray">Symbols</Text>
        <Switch checked={randomSymbols} onCheckedChange={setRandomSymbols} />
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
        <Switch checked={randomStrict} onCheckedChange={setRandomStrict} />
      </Flex>
    </Flex>
  );
}

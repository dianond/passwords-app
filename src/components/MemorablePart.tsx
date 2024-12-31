import {
  Flex,
  Slider,
  Box,
  TextField,
  Text,
  Switch,
  Separator,
} from "@radix-ui/themes";

export default function MemorablePart(props: {
  memorableLength: number;
  memorableUseFullWords: boolean;
  memorableCapitalize: boolean;
  memorableUppercase: boolean;
  memorableSeparator: string;
  setMemorableLength: (value: number) => void;
  setMemorableUseFullWords: (value: boolean) => void;
  setMemorableCapitalize: (value: boolean) => void;
  setMemorableUppercase: (value: boolean) => void;
  setMemorableSeparator: (value: string) => void;
}) {
  const {
    memorableLength,
    memorableUseFullWords,
    memorableCapitalize,
    memorableUppercase,
    memorableSeparator,
    setMemorableLength,
    setMemorableUseFullWords,
    setMemorableCapitalize,
    setMemorableUppercase,
    setMemorableSeparator,
  } = props;

  return (
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
  );
}

import { Flex, Slider, Box, TextField, Text } from "@radix-ui/themes";

export default function PinPart(props: {
  pinLength: number;
  setPinLength: (value: number) => void;
}) {
  const { pinLength, setPinLength } = props;

  return (
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
  );
}

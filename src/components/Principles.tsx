import { Flex, Text, Heading, IconButton, ButtonProps } from "@radix-ui/themes";
import {
  DraftingCompassIcon,
  ShieldCheckIcon,
  ShuffleIcon,
  SignatureIcon,
} from "lucide-react";

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

export default function Principles(props: {
  setThemeColorValue: (val: string) => void;
}) {
  const { setThemeColorValue } = props;

  return (
    <>
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
          Passwords should be unique to different accounts. This reduces the
          likelihood that multiple accounts of yours could be hacked if one of
          your passwords is exposed in a data breach.
        </Text>
        <Flex gap="4" align="center">
          <ShuffleIcon strokeWidth={1} />
          <Heading size="5" align="center">
            Make it random
          </Heading>
        </Flex>
        <Text size="3" color="gray" mb="2">
          The password has a combination of uppercase and lowercase letters,
          numbers, special characters, and words with no discernable pattern,
          unrelated to your personal information.
        </Text>
        <Flex gap="4" align="center">
          <DraftingCompassIcon strokeWidth={1} />
          <Heading size="5" align="center">
            Make it long
          </Heading>
        </Flex>
        <Text size="3" color="gray" mb="2">
          The password consists of 14 characters or longer. An 8-character
          password will take a hacker 39 minutes to crack while a 16-character
          password will take a hacker a billion years to crack.
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
    </>
  );
}

import { ReactNode } from "react";
import { Flex, TextArea, Text, Box, IconButton } from "@radix-ui/themes";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCopy, useHover } from "../hooks";

export default function TextBox(props: {
  label: string;
  text: string;
  placeholder?: string;
  rows?: number;
  toolbar?: ReactNode;
}) {
  const { label, text, placeholder, rows, toolbar } = props;

  const { isCopied, copyToClipboard } = useCopy();
  const { hovered, ref } = useHover();

  return (
    <Flex direction="column" gap="2">
      <Flex justify="between">
        <Text weight="medium">{label}</Text>
        {toolbar}
      </Flex>
      <Box position="relative" ref={ref}>
        <TextArea
          readOnly
          rows={rows || undefined}
          value={text}
          placeholder={placeholder}
        />
        <Box position="absolute" top="2" right="2">
          {hovered && text ? (
            <IconButton
              size="1"
              radius="large"
              color={isCopied ? "green" : undefined}
              onClick={() => copyToClipboard(text)}
              variant="solid"
            >
              {isCopied ? (
                <CheckIcon size={12} strokeWidth={1.5} />
              ) : (
                <CopyIcon size={12} strokeWidth={1.5} />
              )}
            </IconButton>
          ) : null}
        </Box>
      </Box>
    </Flex>
  );
}

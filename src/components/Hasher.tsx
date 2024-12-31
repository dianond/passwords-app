import { useState, useEffect } from "react";
import {
  Flex,
  TextArea,
  Button,
  Text,
  Box,
  Slider,
  TextField,
  Checkbox,
  RadioGroup,
  Spinner,
} from "@radix-ui/themes";
import { ClipboardPasteIcon, EraserIcon } from "lucide-react";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { useDebounce } from "../hooks";
import natives from "../natives";
import TextBox from "./TextBox";

export default function Hasher() {
  const [hashPassword, setHashPassword] = useState("");

  const [md5String, setMd5String] = useState("");
  const [base64String, setBase64String] = useState("");
  const [bcryptString, setBcryptString] = useState("");
  const [sha1String, setSha1String] = useState("");
  const [sha224String, setSha224String] = useState("");
  const [sha256String, setSha256String] = useState("");
  const [sha384String, setSha384String] = useState("");
  const [sha512String, setSha512String] = useState("");

  const [md5Uppercase, setMd5Uppercase] = useState(false);
  const [bcryptRounds, setBcryptRounds] = useState(10);
  const [shaType, setShaType] = useState("256");

  const hashDebounce = useDebounce(hashPassword, 400);
  const bcryptRoundsDebounce = useDebounce(bcryptRounds, 200);

  const [isCalculating, setIsCalculating] = useState(false);

  async function hashAsync() {
    if (hashPassword) {
      setMd5String(await natives.md5(hashPassword));
      setBase64String(await natives.base64(hashPassword));
      setBcryptString(await natives.bcrypt(hashPassword, bcryptRounds));
      setSha1String(await natives.sha1(hashPassword));
      setSha224String(await natives.sha224(hashPassword));
      setSha256String(await natives.sha256(hashPassword));
      setSha384String(await natives.sha384(hashPassword));
      setSha512String(await natives.sha512(hashPassword));
    } else {
      setMd5String("");
      setBase64String("");
      setBcryptString("");
      setSha1String("");
      setSha224String("");
      setSha256String("");
      setSha384String("");
      setSha512String("");
    }
    setIsCalculating(false);
  }

  async function bcryptAsync(password: string, rounds: number) {
    if (password) {
      const value: string = await natives.bcrypt(password, rounds);
      setBcryptString(value);
    }
  }

  useEffect(() => {
    setIsCalculating(true);
    hashAsync();
  }, [hashDebounce]);

  useEffect(() => {
    bcryptAsync(hashPassword, bcryptRounds);
    setIsCalculating(false);
  }, [bcryptRoundsDebounce]);

  return (
    <Flex direction="column" gap="3">
      <TextArea
        placeholder="Enter or paste password here..."
        value={hashPassword}
        rows={2}
        onChange={(e) => setHashPassword(e.currentTarget.value)}
      />
      <Flex align="center" gap="4" justify="end" pr="2" mb="3">
        <Button
          variant="ghost"
          onClick={async () => {
            const clipboardText = await readText();
            if (clipboardText != hashPassword) {
              setIsCalculating(true);
              setHashPassword(clipboardText);
            }
          }}
        >
          <ClipboardPasteIcon size={16} strokeWidth={1} /> Paste
        </Button>
        <Button variant="ghost" onClick={() => setHashPassword("")}>
          <EraserIcon size={16} strokeWidth={1} /> Clear
        </Button>
      </Flex>
      <TextBox
        label="MD5"
        text={md5Uppercase ? md5String.toUpperCase() : md5String}
        placeholder="MD5 is a hashing function that creates a unique 128-bit hash with 32 characters long for every string."
        toolbar={
          <Flex gap="4" align="center" p="1">
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox
                  checked={md5Uppercase}
                  onCheckedChange={(checked) =>
                    setMd5Uppercase(checked as boolean)
                  }
                />
                Uppercase
              </Flex>
            </Text>
          </Flex>
        }
      />
      <TextBox
        label="BCrypt"
        text={bcryptString}
        placeholder="BCrypt is a password-hashing function based on the Blowfish cipher."
        toolbar={
          <Flex align="center" gap="2" width="250px">
            <Text size="2" color="gray">
              Rounds
            </Text>
            <Slider
              value={[bcryptRounds]}
              min={4}
              max={12}
              size="1"
              onValueChange={(value) => {
                setIsCalculating(true);
                setBcryptRounds(value[0]);
              }}
            />
            <Box width="50px">
              <TextField.Root value={bcryptRounds} size="1" readOnly />
            </Box>
          </Flex>
        }
      />
      <TextBox
        label="SHA"
        text={
          shaType === "1"
            ? sha1String
            : shaType === "224"
            ? sha224String
            : shaType === "256"
            ? sha256String
            : shaType === "384"
            ? sha384String
            : shaType === "512"
            ? sha512String
            : ""
        }
        rows={3}
        placeholder={
          shaType === "1"
            ? "SHA1 has a 160-bit hash output which corresponds to a 40 character string."
            : shaType === "224"
            ? "SHA224 is a hashing function that creates a unique 224-bit hash with 56 characters long for every string."
            : shaType === "256"
            ? "SHA256 is a hashing function that creates a unique 256-bit hash with 64 characters long for every string."
            : shaType === "384"
            ? "SHA384 is a hashing function that creates a unique 384-bit hash with 96 characters long for every string."
            : shaType === "512"
            ? "SHA512 is a hashing function that creates a unique 512-bit hash with 128 characters long for every string."
            : ""
        }
        toolbar={
          <RadioGroup.Root value={shaType} onValueChange={setShaType}>
            <Flex align="center" gap="4" pr="2">
              <RadioGroup.Item value="1">1</RadioGroup.Item>
              <RadioGroup.Item value="224">224</RadioGroup.Item>
              <RadioGroup.Item value="256">256</RadioGroup.Item>
              <RadioGroup.Item value="384">384</RadioGroup.Item>
              <RadioGroup.Item value="512">512</RadioGroup.Item>
            </Flex>
          </RadioGroup.Root>
        }
      />
      <TextBox
        label="Base64"
        text={base64String}
        rows={5}
        placeholder="Base64 is a binary-to-text encoding scheme."
      />
      <Flex align="center" gap="2" justify="center" height="1px" mt="1">
        {isCalculating ? (
          <>
            <Spinner size="1" />
            <Text color="gray" size="1">
              calculating...
            </Text>
          </>
        ) : null}
      </Flex>
    </Flex>
  );
}

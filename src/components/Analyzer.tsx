import { useState, useEffect } from "react";
import {
  Flex,
  TextArea,
  Button,
  Text,
  Badge,
  Table,
  Spinner,
} from "@radix-ui/themes";
import { ClipboardPasteIcon, EraserIcon } from "lucide-react";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { useDebounce } from "../hooks";
import natives, { AnalyzedResult } from "../natives";
import { getStrengthString, getStrengthColor } from "../utils";

export default function Analyzer() {
  const [analysisPassword, setAnalysisPassword] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalyzedResult | null>(
    null
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeDebounce = useDebounce(analysisPassword, 400);

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
    analyzeAsync();
  }, [analyzeDebounce]);

  return (
    <>
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
              <Table.Cell align="right">{analysisResult?.length}</Table.Cell>
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
                <Text color="gray">Consecutive repeated characters</Text>
              </Table.Cell>
              <Table.Cell align="right">
                {analysisResult?.consecutive_count}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Text color="gray">Non consecutive repeated characters</Text>
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
    </>
  );
}

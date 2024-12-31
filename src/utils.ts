import { BadgeProps } from "@radix-ui/themes";

export function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export function isDigit(char: string): boolean {
  return /^\d$/.test(char);
}

export function isLetter(char: string): boolean {
  return /^[A-Za-z]$/.test(char);
}

export function getStrengthString(score: number): string {
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
}

export function getStrengthColor(
  score: number
): BadgeProps["color"] | undefined {
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
}

import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

export const palette = {
  transparent: "transparent",
  white: "#ffffff",
  black: "#000000",
  euler: {
    100: "#020508",
    200: "#040A10",
    300: "#08131F",
    400: "#0C1D2F",
    500: "#10263E",
    600: "#14304E",
    700: "#435971",
    800: "#728395",
    900: "#A1ACB8",
    1000: "#F7F7F8",
  },
  teal: {
    100: "#041713",
    200: "#093229",
    300: "#0e4e3f",
    400: "#167a62",
    500: "#1c997c",
    600: "#23c09b",
    700: "#2ae5b9",
    800: "#66eccd",
    900: "#a1f4e0",
    1000: "#ddfbf4",
  },
  green: {
    100: "#0a1108",
    200: "#142310",
    300: "#274520",
    400: "#3b682f",
    500: "#4e8a3f",
    600: "#62ad4f",
    700: "#81bd72",
    800: "#a1ce95",
    900: "#c0deb9",
    1000: "#e0efdc",
  },
  yellow: {
    100: "#181305",
    200: "#2f260a",
    300: "#5e4d14",
    400: "#8e731f",
    500: "#bd9a29",
    600: "#ecc033",
    700: "#f0cd5d",
    800: "#f4d985",
    900: "#f7e6ad",
    1000: "#fbf2d6",
  },
  orange: {
    100: "#180f03",
    200: "#301f07",
    300: "#5f3d0e",
    400: "#8f5c14",
    500: "#be7a1b",
    600: "#ee9922",
    700: "#f1ad3e",
    800: "#f5c27a",
    900: "#f8d6a7",
    1000: "#fcebd3",
  },
  red: {
    100: "#130404",
    200: "#260807",
    300: "#4d100e",
    400: "#731715",
    500: "#9a1f1c",
    600: "#c02723",
    700: "#cd524f",
    800: "#d97d7b",
    900: "#e6a9a7",
    1000: "#f2d4d3",
  },
};

const config: Config = {
  darkMode: ["class"],
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        ...palette,
        background: {
          base: palette.euler[300],
          subtle: palette.euler[400],
          component: palette.euler[500],
          field: palette.euler[500],
        },
        foreground: {
          base: palette.euler[1000],
          subtle: palette.euler[900],
          muted: palette.euler[800],
          disabled: palette.euler[700],
        },
        border: {
          base: palette.euler[600],
          strong: palette.euler[700],
        },
        semantic: {
          accent: {
            DEFAULT: palette.teal[700],
            secondary: palette.yellow[600],
          },
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    fontFamily: {
      inter: ["var(--font-inter)"],
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        ".heading-1": {
          "@apply font-inter text-[72px] leading-[88px] font-medium": {},
        },
        ".heading-2": {
          "@apply font-inter text-[32px] leading-[44px] font-medium": {},
        },
        ".heading-3": {
          "@apply font-inter text-[24px] leading-[32px] font-medium": {},
        },
        ".heading-4": {
          "@apply font-inter text-[18px] leading-[28px] font-medium": {},
        },
        ".body-xl": {
          "@apply font-inter text-[18px] leading-[28px]": {},
        },
        ".body-lg": {
          "@apply font-inter text-[16px] leading-[24px]": {},
        },
        ".body-md": {
          "@apply font-inter text-[14px] leading-[20px]": {},
        },
        ".body-sm": {
          "@apply font-inter text-[13px] leading-[20px]": {},
        },
        ".body-xs": {
          "@apply font-inter text-[12px] leading-[16px]": {},
        },
      });
    }),
    plugin(function ({ addVariant }: { addVariant: any }) {
      addVariant("not-last", "&:not(:last-child)");
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
    require("tailwindcss-animate"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
export default config;

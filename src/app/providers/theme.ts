import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.900",
      },
    },
  },
  colors: {
    brand: {
      50: "#e8f0ff",
      100: "#c7d9ff",
      200: "#a3c0ff",
      300: "#7da6ff",
      400: "#588cff",
      500: "#2f6fff", // azul principal
      600: "#2458cc",
      700: "#1a4299",
      800: "#102b66",
      900: "#081633",
    },
    success: {
      500: "#22c55e", // verde forte (status ok)
    },
  },
  components: {
    Button: {
      baseStyle: { borderRadius: "6px" },
      defaultProps: { colorScheme: "brand" },
    },
    Input: {
      baseStyle: { field: { borderRadius: "6px" } },
    },
    Select: {
      baseStyle: { field: { borderRadius: "6px" } },
    },
    Table: {
      baseStyle: {
        th: { textTransform: "none", letterSpacing: "normal" },
      },
    },
    Card: {
      baseStyle: {
        container: { borderRadius: "8px" },
      },
    },
  },
});

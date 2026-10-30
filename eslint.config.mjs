import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "dist/**",
    ".vinext/**",
    ".wrangler/**",
    ".sites-runtime/**",
    "outputs/**",
    "work/**",
  ]),
  {
    rules: {
      // The application deliberately uses full-page same-origin links to reset
      // route state and avoid retaining private form data between workspaces.
      "@next/next/no-html-link-for-pages": "off",
      // The API JSON boundary and dynamic database projections are validated
      // with Zod before use; dynamic fixture projections are intentionally loose.
      "@typescript-eslint/no-explicit-any": "warn",
      // Browser preferences and async boot data are initialized after hydration.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: ["components/ui/**/*.{ts,tsx}", "hooks/use-mobile.ts"],
    rules: {
      // These files are vendored verbatim from shadcn@4.17.0. Keep the
      // registry source intact while applying the stricter rules to Site code.
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;

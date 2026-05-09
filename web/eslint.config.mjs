import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import simpleImportSort from "eslint-plugin-simple-import-sort";

import plugin from "@tailwindcss/typography";

const eslintConfig = defineConfig([
	...nextVitals,
	{
		plugins: {
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			"simple-import-sort/imports": [
				"warn",
				{
					groups: [
						["^\\u0000"],

						["^react$", "^react"],

						["^next"],

						["^[^@./]"],

						["^@"],

						["^@lexical"],

						["^@repo/types"],

						["^@/redux"],

						["^@/services"],

						["^@/components"],

						["^@/shadcn"],

						["^@/shared"],

						["^@/lib"],

						["^@/hooks"],

						["^@/types"],

						["^@/"],

						["^\\."],
					],
				},
			],

			"simple-import-sort/exports": "warn",
		},
	},
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;

import globals from "globals";
import { config as baseConfig } from "./base.js";
import simpleImportSort from "eslint-plugin-simple-import-sort";

/**
 * A custom ESLint configuration for Nest.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nestJsConfig = [
	...baseConfig,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: "commonjs",
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "warn",
			"@typescript-eslint/no-unsafe-argument": "warn",
		},
	},
	{
		files: ["src/**/*.ts"],
		plugins: {
			"simple-import-sort": simpleImportSort,
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"simple-import-sort/imports": [
				"warn",
				{
					groups: [
						["^\\u0000"],

						["^@nestjs"],

						["^[^@./]"],

						// e.g "@nestjs/..." etc...
						["^@"],

						// e.g "@/app/users/...", "@/app/products/..." etc...
						["^@/app"],

						// e.g "@/services/resend/...", "@/app/translation/..." etc...
						["@/services"],

						// e.g "@/users/...", "@/products/..." etc...
						["^@/"],

						// e.g "./dto/...", etc...
						["^\\./dto"],

						// e.g "./users/...", "./products/..." etc...
						["^\\."],

						// e.g "../users/...", "../products/..." etc...
						["^\\.\\."],
					],
				},
			],
			"simple-import-sort/exports": "warn",
		},
	},
];

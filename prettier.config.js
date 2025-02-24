// prettier.config.js
module.exports = {
  singleQuote: true,
  semi: true,
  printWidth: 120,
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  requirePragma: false,
  insertPragma: false,
  experimentalTernaries: true,
  trailingComma: 'none',
  proseWrap: 'preserve',
  endOfLine: 'lf',

  importOrder: ['^(react|next|next/.*)$', '^[^@./]', '^@(prisma/.*|/.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy']
};

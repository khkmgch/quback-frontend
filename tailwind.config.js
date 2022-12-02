/** @type {import('tailwindcss').Config} */
module.exports = {
  //NextJsで使用するためのcontentの設定
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        128: '32rem',
        192: '48rem',
        256: '64rem'
      },
    },
  },
  plugins: [],
  //Mantine UIとTailwind CSSの互換性の問題の解消のため、preflightの設定をする
  corePlugins: {
    preflight: false,
  },
}

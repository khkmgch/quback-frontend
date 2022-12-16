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
        256: '64rem',
      },
      colors: {
        'custom-blue-0':'#E4E6EB',
        'custom-blue-1':'#BEC0C4',
        'custom-blue-2':'#999B9E',
        'custom-blue-3':'#747578',
        'custom-blue-4':'#4A4B4D',

        'custom-yellow': '#EBE7CC',
        'custom-red-0': '#EBE4E6',
        'custom-red-1': "#660A24",
        'custom-green-0': '#E6EBE4',
        'custom-orange-0': "#EBB52F"
      },
      rotate: {
        '135': '135deg',
        '225': "225deg",
        '270': "270deg"
      }
    },
  },
  plugins: [],
  //Mantine UIとTailwind CSSの互換性の問題の解消のため、preflightの設定をする
  corePlugins: {
    preflight: false,
  },
}

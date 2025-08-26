module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

git add.
git commit - m "Fix non-ASCII/smart quotes in virtual-gifts components"
git push
npm run build
npm run dev

rg '[^\x00-\x7F]' src / features / addons / virtual - gifts / components

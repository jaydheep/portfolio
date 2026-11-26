// ✏️ Add your side builds here. Each one becomes a card that opens the link.
// The first 5 show as a grid. From the 6th onward they sit behind a "More builds" button
// and open as a row you scroll sideways, so the page never gets endlessly long.
//
// Fields: name, url, blurb (one line), stack (small tags), hue (colour 0 to 360), icon (optional emoji for the cover)
// hue guide: 0 red, 45 gold, 120 green, 200 blue, 280 purple, 320 pink
export const showcase = [
  { name: 'Guess the Number', url: 'https://guess-the-number-alpha-lovat.vercel.app/', icon: '🎯', hue: 265,
    blurb: 'A tiny number guessing game. Find the secret number between 1 and 10 in as few tries as you can.',
    stack: ['Game', 'Web'] },
  { name: 'Coin Catch', url: 'https://coin-catch-game.vercel.app', icon: '🪙', hue: 45,
    blurb: 'A fast arcade game in your browser. Catch coins, grab bonuses, dodge bombs and chase the Top 10.',
    stack: ['Arcade game', 'Top 10 board'] },
]

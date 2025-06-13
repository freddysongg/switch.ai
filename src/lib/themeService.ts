export interface AppTheme {
  name: string;
  id: string;
  path: string;
  baseMode?: 'light' | 'dark';
  previewColors?: {
    background: string;
    text: string;
    primary: string;
  };
}

export function generateThemeName(id: string): string {
  return id
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const availableAppThemes: AppTheme[] = [
  { name: 'Default Light', id: 'light', path: '/themes/light.css', baseMode: 'light' },
  { name: 'Default Dark', id: 'dark', path: '/themes/dark.css', baseMode: 'dark' },
  {
    name: '80s After Dark',
    id: '80s_after_dark',
    path: '/themes/80s_after_dark.css',
    baseMode: 'dark'
  },
  { name: '8008', id: '8008', path: '/themes/8008.css', baseMode: 'dark' },
  { name: '9009', id: '9009', path: '/themes/9009.css', baseMode: 'light' },
  { name: 'Aether', id: 'aether', path: '/themes/aether.css', baseMode: 'dark' },
  { name: 'Alduin', id: 'alduin', path: '/themes/alduin.css', baseMode: 'dark' },
  { name: 'Alpine', id: 'alpine', path: '/themes/alpine.css', baseMode: 'dark' },
  { name: 'Anti Hero', id: 'anti_hero', path: '/themes/anti_hero.css', baseMode: 'dark' },
  { name: 'Arch', id: 'arch', path: '/themes/arch.css', baseMode: 'dark' },
  { name: 'Aurora', id: 'aurora', path: '/themes/aurora.css', baseMode: 'dark' },
  { name: 'Beach', id: 'beach', path: '/themes/beach.css', baseMode: 'light' },
  { name: 'Bento', id: 'bento', path: '/themes/bento.css', baseMode: 'dark' },
  { name: 'Bingsu', id: 'bingsu', path: '/themes/bingsu.css', baseMode: 'light' },
  { name: 'Bliss', id: 'bliss', path: '/themes/bliss.css', baseMode: 'dark' },
  { name: 'Blue Dolphin', id: 'blue_dolphin', path: '/themes/blue_dolphin.css', baseMode: 'dark' },
  {
    name: 'Blueberry Dark',
    id: 'blueberry_dark',
    path: '/themes/blueberry_dark.css',
    baseMode: 'dark'
  },
  {
    name: 'Blueberry Light',
    id: 'blueberry_light',
    path: '/themes/blueberry_light.css',
    baseMode: 'light'
  },
  { name: 'Botanical', id: 'botanical', path: '/themes/botanical.css', baseMode: 'dark' },
  { name: 'Bouquet', id: 'bouquet', path: '/themes/bouquet.css', baseMode: 'dark' },
  { name: 'Breeze', id: 'breeze', path: '/themes/breeze.css', baseMode: 'light' },
  { name: 'Bushido', id: 'bushido', path: '/themes/bushido.css', baseMode: 'dark' },
  { name: 'Cafe', id: 'cafe', path: '/themes/cafe.css', baseMode: 'light' },
  { name: 'Camping', id: 'camping', path: '/themes/camping.css', baseMode: 'light' },
  { name: 'Carbon', id: 'carbon', path: '/themes/carbon.css', baseMode: 'dark' },
  { name: 'Catppuccin', id: 'catppuccin', path: '/themes/catppuccin.css', baseMode: 'dark' },
  { name: 'Chaos Theory', id: 'chaos_theory', path: '/themes/chaos_theory.css', baseMode: 'dark' },
  { name: 'Cheesecake', id: 'cheesecake', path: '/themes/cheesecake.css', baseMode: 'light' },
  {
    name: 'Cherry Blossom',
    id: 'cherry_blossom',
    path: '/themes/cherry_blossom.css',
    baseMode: 'dark'
  },
  { name: 'Comfy', id: 'comfy', path: '/themes/comfy.css', baseMode: 'dark' },
  { name: 'Copper', id: 'copper', path: '/themes/copper.css', baseMode: 'dark' },
  { name: 'Creamsicle', id: 'creamsicle', path: '/themes/creamsicle.css', baseMode: 'light' },
  { name: 'Cy Red', id: 'cy_red', path: '/themes/cy_red.css', baseMode: 'dark' },
  { name: 'Cyberspace', id: 'cyberspace', path: '/themes/cyberspace.css', baseMode: 'dark' },
  {
    name: 'Dark Magic Girl',
    id: 'dark_magic_girl',
    path: '/themes/dark_magic_girl.css',
    baseMode: 'dark'
  },
  { name: 'Dark Note', id: 'dark_note', path: '/themes/dark_note.css', baseMode: 'dark' },
  { name: 'Darling', id: 'darling', path: '/themes/darling.css', baseMode: 'light' },
  { name: 'Deku', id: 'deku', path: '/themes/deku.css', baseMode: 'dark' },
  { name: 'Desert Oasis', id: 'desert_oasis', path: '/themes/desert_oasis.css', baseMode: 'light' },
  { name: 'Dev', id: 'dev', path: '/themes/dev.css', baseMode: 'dark' },
  { name: 'Diner', id: 'diner', path: '/themes/diner.css', baseMode: 'dark' },
  { name: 'Dino', id: 'dino', path: '/themes/dino.css', baseMode: 'light' },
  { name: 'Discord', id: 'discord', path: '/themes/discord.css', baseMode: 'dark' },
  { name: 'Dmg', id: 'dmg', path: '/themes/dmg.css', baseMode: 'light' },
  { name: 'Dollar', id: 'dollar', path: '/themes/dollar.css', baseMode: 'light' },
  { name: 'Dots', id: 'dots', path: '/themes/dots.css', baseMode: 'dark' },
  { name: 'Dracula', id: 'dracula', path: '/themes/dracula.css', baseMode: 'dark' },
  { name: 'Drowning', id: 'drowning', path: '/themes/drowning.css', baseMode: 'dark' },
  { name: 'Dualshot', id: 'dualshot', path: '/themes/dualshot.css', baseMode: 'light' },
  { name: 'Earthsong', id: 'earthsong', path: '/themes/earthsong.css', baseMode: 'dark' },
  { name: 'Everblush', id: 'everblush', path: '/themes/everblush.css', baseMode: 'dark' },
  { name: 'Evil Eye', id: 'evil_eye', path: '/themes/evil_eye.css', baseMode: 'dark' },
  { name: 'Ez Mode', id: 'ez_mode', path: '/themes/ez_mode.css', baseMode: 'dark' },
  { name: 'Fire', id: 'fire', path: '/themes/fire.css', baseMode: 'dark' },
  { name: 'Fledgling', id: 'fledgling', path: '/themes/fledgling.css', baseMode: 'dark' },
  { name: 'Fleuriste', id: 'fleuriste', path: '/themes/fleuriste.css', baseMode: 'light' },
  { name: 'Floret', id: 'floret', path: '/themes/floret.css', baseMode: 'dark' },
  { name: 'Froyo', id: 'froyo', path: '/themes/froyo.css', baseMode: 'light' },
  { name: 'Frozen Llama', id: 'frozen_llama', path: '/themes/frozen_llama.css', baseMode: 'light' },
  { name: 'Fruit Chew', id: 'fruit_chew', path: '/themes/fruit_chew.css', baseMode: 'light' },
  { name: 'Fundamentals', id: 'fundamentals', path: '/themes/fundamentals.css', baseMode: 'light' },
  { name: 'Future Funk', id: 'future_funk', path: '/themes/future_funk.css', baseMode: 'dark' },
  { name: 'Github', id: 'github', path: '/themes/github.css', baseMode: 'dark' },
  { name: 'Godspeed', id: 'godspeed', path: '/themes/godspeed.css', baseMode: 'light' },
  { name: 'Graen', id: 'graen', path: '/themes/graen.css', baseMode: 'dark' },
  { name: 'Grand Prix', id: 'grand_prix', path: '/themes/grand_prix.css', baseMode: 'dark' },
  { name: 'Grape', id: 'grape', path: '/themes/grape.css', baseMode: 'dark' },
  { name: 'Gruvbox Dark', id: 'gruvbox_dark', path: '/themes/gruvbox_dark.css', baseMode: 'dark' },
  {
    name: 'Gruvbox Light',
    id: 'gruvbox_light',
    path: '/themes/gruvbox_light.css',
    baseMode: 'light'
  },
  { name: 'Hammerhead', id: 'hammerhead', path: '/themes/hammerhead.css', baseMode: 'dark' },
  { name: 'Hanok', id: 'hanok', path: '/themes/hanok.css', baseMode: 'light' },
  { name: 'Hedge', id: 'hedge', path: '/themes/hedge.css', baseMode: 'dark' },
  { name: 'Honey', id: 'honey', path: '/themes/honey.css', baseMode: 'light' },
  { name: 'Horizon', id: 'horizon', path: '/themes/horizon.css', baseMode: 'dark' },
  { name: 'Husqy', id: 'husqy', path: '/themes/husqy.css', baseMode: 'dark' },
  { name: 'Iceberg Dark', id: 'iceberg_dark', path: '/themes/iceberg_dark.css', baseMode: 'dark' },
  {
    name: 'Iceberg Light',
    id: 'iceberg_light',
    path: '/themes/iceberg_light.css',
    baseMode: 'light'
  },
  { name: 'Incognito', id: 'incognito', path: '/themes/incognito.css', baseMode: 'dark' },
  { name: 'Ishtar', id: 'ishtar', path: '/themes/ishtar.css', baseMode: 'dark' },
  { name: 'Iv Clover', id: 'iv_clover', path: '/themes/iv_clover.css', baseMode: 'light' },
  { name: 'Iv Spade', id: 'iv_spade', path: '/themes/iv_spade.css', baseMode: 'dark' },
  { name: 'Joker', id: 'joker', path: '/themes/joker.css', baseMode: 'dark' },
  { name: 'Laser', id: 'laser', path: '/themes/laser.css', baseMode: 'dark' },
  { name: 'Lavender', id: 'lavender', path: '/themes/lavender.css', baseMode: 'light' },
  { name: 'Leather', id: 'leather', path: '/themes/leather.css', baseMode: 'dark' },
  { name: 'Lil Dragon', id: 'lil_dragon', path: '/themes/lil_dragon.css', baseMode: 'light' },
  { name: 'Lilac Mist', id: 'lilac_mist', path: '/themes/lilac_mist.css', baseMode: 'light' },
  { name: 'Lime', id: 'lime', path: '/themes/lime.css', baseMode: 'dark' },
  { name: 'Luna', id: 'luna', path: '/themes/luna.css', baseMode: 'dark' },
  { name: 'Macroblank', id: 'macroblank', path: '/themes/macroblank.css', baseMode: 'light' },
  { name: 'Magic Girl', id: 'magic_girl', path: '/themes/magic_girl.css', baseMode: 'light' },
  { name: 'Mashu', id: 'mashu', path: '/themes/mashu.css', baseMode: 'dark' },
  {
    name: 'Matcha Moccha',
    id: 'matcha_moccha',
    path: '/themes/matcha_moccha.css',
    baseMode: 'dark'
  },
  { name: 'Material', id: 'material', path: '/themes/material.css', baseMode: 'dark' },
  { name: 'Matrix', id: 'matrix', path: '/themes/matrix.css', baseMode: 'dark' },
  { name: 'Menthol', id: 'menthol', path: '/themes/menthol.css', baseMode: 'light' },
  { name: 'Metaverse', id: 'metaverse', path: '/themes/metaverse.css', baseMode: 'dark' },
  { name: 'Metropolis', id: 'metropolis', path: '/themes/metropolis.css', baseMode: 'dark' },
  { name: 'Mexican', id: 'mexican', path: '/themes/mexican.css', baseMode: 'light' },
  { name: 'Miami', id: 'miami', path: '/themes/miami.css', baseMode: 'dark' },
  { name: 'Miami Nights', id: 'miami_nights', path: '/themes/miami_nights.css', baseMode: 'dark' },
  { name: 'Midnight', id: 'midnight', path: '/themes/midnight.css', baseMode: 'dark' },
  { name: 'Milkshake', id: 'milkshake', path: '/themes/milkshake.css', baseMode: 'light' },
  { name: 'Mint', id: 'mint', path: '/themes/mint.css', baseMode: 'dark' },
  { name: 'Mizu', id: 'mizu', path: '/themes/mizu.css', baseMode: 'light' },
  { name: 'Modern Dolch', id: 'modern_dolch', path: '/themes/modern_dolch.css', baseMode: 'dark' },
  {
    name: 'Modern Dolch Light',
    id: 'modern_dolch_light',
    path: '/themes/modern_dolch_light.css',
    baseMode: 'light'
  },
  { name: 'Modern Ink', id: 'modern_ink', path: '/themes/modern_ink.css', baseMode: 'light' },
  { name: 'Monokai', id: 'monokai', path: '/themes/monokai.css', baseMode: 'dark' },
  { name: 'Moonlight', id: 'moonlight', path: '/themes/moonlight.css', baseMode: 'dark' },
  { name: 'Mountain', id: 'mountain', path: '/themes/mountain.css', baseMode: 'dark' },
  { name: 'Mr Sleeves', id: 'mr_sleeves', path: '/themes/mr_sleeves.css', baseMode: 'light' },
  { name: 'Ms Cupcakes', id: 'ms_cupcakes', path: '/themes/ms_cupcakes.css', baseMode: 'light' },
  { name: 'Muted', id: 'muted', path: '/themes/muted.css', baseMode: 'dark' },
  { name: 'Nautilus', id: 'nautilus', path: '/themes/nautilus.css', baseMode: 'dark' },
  { name: 'Nebula', id: 'nebula', path: '/themes/nebula.css', baseMode: 'dark' },
  { name: 'Night Runner', id: 'night_runner', path: '/themes/night_runner.css', baseMode: 'dark' },
  { name: 'Nord', id: 'nord', path: '/themes/nord.css', baseMode: 'dark' },
  { name: 'Nord Light', id: 'nord_light', path: '/themes/nord_light.css', baseMode: 'light' },
  { name: 'Norse', id: 'norse', path: '/themes/norse.css', baseMode: 'dark' },
  { name: 'Oblivion', id: 'oblivion', path: '/themes/oblivion.css', baseMode: 'dark' },
  { name: 'Olive', id: 'olive', path: '/themes/olive.css', baseMode: 'light' },
  { name: 'Olivia', id: 'olivia', path: '/themes/olivia.css', baseMode: 'dark' },
  { name: 'Onedark', id: 'onedark', path: '/themes/onedark.css', baseMode: 'dark' },
  { name: 'Paper', id: 'paper', path: '/themes/paper.css', baseMode: 'light' },
  {
    name: 'Passion Fruit',
    id: 'passion_fruit',
    path: '/themes/passion_fruit.css',
    baseMode: 'dark'
  },
  { name: 'Pastel', id: 'pastel', path: '/themes/pastel.css', baseMode: 'light' },
  {
    name: 'Peach Blossom',
    id: 'peach_blossom',
    path: '/themes/peach_blossom.css',
    baseMode: 'dark'
  },
  { name: 'Peaches', id: 'peaches', path: '/themes/peaches.css', baseMode: 'light' },
  { name: 'Phantom', id: 'phantom', path: '/themes/phantom.css', baseMode: 'dark' },
  {
    name: 'Pink Lemonade',
    id: 'pink_lemonade',
    path: '/themes/pink_lemonade.css',
    baseMode: 'light'
  },
  { name: 'Pulse', id: 'pulse', path: '/themes/pulse.css', baseMode: 'dark' },
  { name: 'Purpleish', id: 'purpleish', path: '/themes/purpleish.css', baseMode: 'dark' },
  {
    name: 'Rainbow Trail',
    id: 'rainbow_trail',
    path: '/themes/rainbow_trail.css',
    baseMode: 'light'
  },
  { name: 'Red Dragon', id: 'red_dragon', path: '/themes/red_dragon.css', baseMode: 'dark' },
  { name: 'Red Samurai', id: 'red_samurai', path: '/themes/red_samurai.css', baseMode: 'dark' },
  { name: 'Repose Dark', id: 'repose_dark', path: '/themes/repose_dark.css', baseMode: 'dark' },
  { name: 'Repose Light', id: 'repose_light', path: '/themes/repose_light.css', baseMode: 'light' },
  { name: 'Retro', id: 'retro', path: '/themes/retro.css', baseMode: 'light' },
  { name: 'Retrocast', id: 'retrocast', path: '/themes/retrocast.css', baseMode: 'dark' },
  { name: 'Rgb', id: 'rgb', path: '/themes/rgb.css', baseMode: 'dark' },
  { name: 'Rose Pine', id: 'rose_pine', path: '/themes/rose_pine.css', baseMode: 'dark' },
  {
    name: 'Rose Pine Dawn',
    id: 'rose_pine_dawn',
    path: '/themes/rose_pine_dawn.css',
    baseMode: 'light'
  },
  {
    name: 'Rose Pine Moon',
    id: 'rose_pine_moon',
    path: '/themes/rose_pine_moon.css',
    baseMode: 'dark'
  },
  { name: 'Rudy', id: 'rudy', path: '/themes/rudy.css', baseMode: 'dark' },
  { name: 'Ryujinscales', id: 'ryujinscales', path: '/themes/ryujinscales.css', baseMode: 'dark' },
  { name: 'Serika', id: 'serika', path: '/themes/serika.css', baseMode: 'light' },
  { name: 'Serika Dark', id: 'serika_dark', path: '/themes/serika_dark.css', baseMode: 'dark' },
  { name: 'Sewing Tin', id: 'sewing_tin', path: '/themes/sewing_tin.css', baseMode: 'dark' },
  {
    name: 'Sewing Tin Light',
    id: 'sewing_tin_light',
    path: '/themes/sewing_tin_light.css',
    baseMode: 'light'
  },
  { name: 'Shadow', id: 'shadow', path: '/themes/shadow.css', baseMode: 'dark' },
  { name: 'Shoko', id: 'shoko', path: '/themes/shoko.css', baseMode: 'light' },
  { name: 'Slambook', id: 'slambook', path: '/themes/slambook.css', baseMode: 'light' },
  { name: 'Snes', id: 'snes', path: '/themes/snes.css', baseMode: 'light' },
  {
    name: 'Soaring Skies',
    id: 'soaring_skies',
    path: '/themes/soaring_skies.css',
    baseMode: 'light'
  },
  {
    name: 'Solarized Dark',
    id: 'solarized_dark',
    path: '/themes/solarized_dark.css',
    baseMode: 'dark'
  },
  {
    name: 'Solarized Light',
    id: 'solarized_light',
    path: '/themes/solarized_light.css',
    baseMode: 'light'
  },
  {
    name: 'Solarized Osaka',
    id: 'solarized_osaka',
    path: '/themes/solarized_osaka.css',
    baseMode: 'dark'
  },
  { name: 'Sonokai', id: 'sonokai', path: '/themes/sonokai.css', baseMode: 'dark' },
  { name: 'Stealth', id: 'stealth', path: '/themes/stealth.css', baseMode: 'dark' },
  { name: 'Strawberry', id: 'strawberry', path: '/themes/strawberry.css', baseMode: 'light' },
  { name: 'Striker', id: 'striker', path: '/themes/striker.css', baseMode: 'dark' },
  { name: 'Suisei', id: 'suisei', path: '/themes/suisei.css', baseMode: 'dark' },
  { name: 'Sunset', id: 'sunset', path: '/themes/sunset.css', baseMode: 'dark' },
  { name: 'Superuser', id: 'superuser', path: '/themes/superuser.css', baseMode: 'dark' },
  { name: 'Sweden', id: 'sweden', path: '/themes/sweden.css', baseMode: 'dark' },
  { name: 'Tangerine', id: 'tangerine', path: '/themes/tangerine.css', baseMode: 'light' },
  { name: 'Taro', id: 'taro', path: '/themes/taro.css', baseMode: 'light' },
  { name: 'Terminal', id: 'terminal', path: '/themes/terminal.css', baseMode: 'dark' },
  { name: 'Terra', id: 'terra', path: '/themes/terra.css', baseMode: 'dark' },
  { name: 'Terrazzo', id: 'terrazzo', path: '/themes/terrazzo.css', baseMode: 'light' },
  { name: 'Terror Below', id: 'terror_below', path: '/themes/terror_below.css', baseMode: 'dark' },
  { name: 'Tiramisu', id: 'tiramisu', path: '/themes/tiramisu.css', baseMode: 'light' },
  { name: 'Trackday', id: 'trackday', path: '/themes/trackday.css', baseMode: 'dark' },
  { name: 'Trance', id: 'trance', path: '/themes/trance.css', baseMode: 'dark' },
  { name: 'Tron Orange', id: 'tron_orange', path: '/themes/tron_orange.css', baseMode: 'dark' },
  { name: 'Vaporwave', id: 'vaporwave', path: '/themes/vaporwave.css', baseMode: 'dark' },
  { name: 'Vesper', id: 'vesper', path: '/themes/vesper.css', baseMode: 'dark' },
  { name: 'Viridescent', id: 'viridescent', path: '/themes/viridescent.css', baseMode: 'dark' },
  { name: 'Voc', id: 'voc', path: '/themes/voc.css', baseMode: 'dark' },
  { name: 'Vscode', id: 'vscode', path: '/themes/vscode.css', baseMode: 'dark' },
  { name: 'Watermelon', id: 'watermelon', path: '/themes/watermelon.css', baseMode: 'dark' },
  { name: 'Wavez', id: 'wavez', path: '/themes/wavez.css', baseMode: 'dark' },
  { name: 'Witch Girl', id: 'witch_girl', path: '/themes/witch_girl.css', baseMode: 'light' }
];

export const themeColorPreviews: Record<string, AppTheme['previewColors']> = {
  light: { background: '#ffffff', text: '#0a0a0a', primary: '#007acc' },
  dark: { background: '#0a0a0a', text: '#ffffff', primary: '#ffffff' },
  '80s_after_dark': { background: '#1b1d36', text: '#e1e7ec', primary: '#fca6d1' },
  '8008': { background: '#333a45', text: '#e9ecf0', primary: '#f44c7f' },
  '9009': { background: '#eeebe2', text: '#080909', primary: '#7fa480' },
  aether: { background: '#101820', text: '#eedaea', primary: '#cf6bdd' },
  alduin: { background: '#1c1c1c', text: '#f5f3ed', primary: '#dfd7af' },
  alpine: { background: '#6c687f', text: '#ffffff', primary: '#585568' },
  anti_hero: { background: '#00002e', text: '#f1deef', primary: '#ffadad' },
  arch: { background: '#0c0d11', text: '#f6f5f5', primary: '#7ebab5' },
  aurora: { background: '#011926', text: '#fff', primary: '#00e980' },
  beach: { background: '#ffeead', text: '#5b7869', primary: '#96ceb4' },
  bento: { background: '#2d394d', text: '#fffaf8', primary: '#ff7a90' },
  bingsu: { background: '#b8a7aa', text: '#ebe6ea', primary: '#83616e' },
  bliss: { background: '#262727', text: '#fff', primary: '#f0d3c9' },
  blue_dolphin: { background: '#003950', text: '#82eaff', primary: '#ffcefb' },
  blueberry_dark: { background: '#212b42', text: '#91b4d5', primary: '#add7ff' },
  blueberry_light: { background: '#dae0f5', text: '#678198', primary: '#506477' },
  botanical: { background: '#7b9c98', text: '#eaf1f3', primary: '#eaf1f3' },
  bouquet: { background: '#173f35', text: '#e9e0d2', primary: '#eaa09c' },
  breeze: { background: '#e8d5c4', text: '#1b4c5e', primary: '#7d67a9' },
  bushido: { background: '#242933', text: '#f6f0e9', primary: '#ec4c56' },
  cafe: { background: '#ceb18d', text: '#14120f', primary: '#14120f' },
  camping: { background: '#faf1e4', text: '#3c403b', primary: '#618c56' },
  carbon: { background: '#313131', text: '#f5e6c8', primary: '#f66e0d' },
  catppuccin: { background: '#1e1e2e', text: '#cdd6f4', primary: '#cba6f7' },
  chaos_theory: { background: '#141221', text: '#dde5ed', primary: '#fd77d7' },
  cheesecake: { background: '#fdf0d5', text: '#3a3335', primary: '#8e2949' },
  cherry_blossom: { background: '#323437', text: '#d1d0c5', primary: '#d65ccc' },
  comfy: { background: '#4a5b6e', text: '#f5efee', primary: '#f8cdc6' },
  copper: { background: '#442f29', text: '#e7e0de', primary: '#b46a55' },
  creamsicle: { background: '#ff9869', text: '#fcfcf8', primary: '#fcfcf8' },
  cy_red: { background: '#6e2626', text: '#ffaaaa', primary: '#e55050' },
  cyberspace: { background: '#181c18', text: '#c2fbe1', primary: '#00ce7c' },
  dark_magic_girl: { background: '#091f2c', text: '#a288d9', primary: '#f5b1cc' },
  dark_note: { background: '#1f1f1f', text: '#d2dff4', primary: '#f2c17b' },
  darling: { background: '#fec8cd', text: '#ffffff', primary: '#a30000' }, // main is white, sub is red
  deku: { background: '#058b8c', text: '#f7f2ea', primary: '#b63530' },
  desert_oasis: { background: '#fff2d5', text: '#332800', primary: '#d19d01' },
  dev: { background: '#1b2028', text: '#ccccb5', primary: '#23a9d5' },
  diner: { background: '#537997', text: '#dfdbc8', primary: '#c3af5b' },
  dino: { background: '#ffffff', text: '#1d221f', primary: '#40d672' },
  discord: { background: '#313338', text: '#dcdee3', primary: '#5a65ea' },
  dmg: { background: '#dadbdc', text: '#414141', primary: '#ae185e' },
  dollar: { background: '#e4e4d4', text: '#555a56', primary: '#6b886b' },
  dots: { background: '#121520', text: '#fff', primary: '#fff' },
  dracula: { background: '#282a36', text: '#f8f8f2', primary: '#bd93f9' },
  drowning: { background: '#191826', text: '#9393a7', primary: '#4a6fb5' },
  dualshot: { background: '#737373', text: '#212222', primary: '#212222' },
  earthsong: { background: '#292521', text: '#e6c7a8', primary: '#509452' },
  everblush: { background: '#141b1e', text: '#dadada', primary: '#8ccf7e' },
  evil_eye: { background: '#0084c2', text: '#171718', primary: '#f7f2ea' },
  ez_mode: { background: '#0068c6', text: '#ffffff', primary: '#fa62d5' },
  fire: { background: '#0f0000', text: '#ffffff', primary: '#b31313' },
  fledgling: { background: '#3b363f', text: '#e6d5d3', primary: '#fc6e83' },
  fleuriste: { background: '#c6b294', text: '#091914', primary: '#405a52' },
  floret: { background: '#00272c', text: '#e5e5e5', primary: '#ffdd6d' },
  froyo: { background: '#e1dacb', text: '#7b7d7d', primary: '#7b7d7d' }, // main and text same
  frozen_llama: { background: '#9bf2ea', text: '#ffffff', primary: '#6d44a6' },
  fruit_chew: { background: '#d6d3d6', text: '#282528', primary: '#5c1e5f' },
  fundamentals: { background: '#727474', text: '#131313', primary: '#7fa482' },
  future_funk: { background: '#2e1a47', text: '#f7f2ea', primary: '#f7f2ea' },
  github: { background: '#212830', text: '#ccdae6', primary: '#41ce5c' },
  godspeed: { background: '#eae4cf', text: '#646669', primary: '#9abbcd' },
  graen: { background: '#303c36', text: '#a59682', primary: '#a59682' },
  grand_prix: { background: '#36475c', text: '#c1c7d7', primary: '#c0d036' },
  grape: { background: '#2c003e', text: '#fff', primary: '#ff8f00' },
  gruvbox_dark: { background: '#282828', text: '#ebdbb2', primary: '#d79921' },
  gruvbox_light: { background: '#fbf1c7', text: '#3c3836', primary: '#689d6a' },
  hammerhead: { background: '#030613', text: '#e2f1f5', primary: '#4fcdb9' },
  hanok: { background: '#d8d2c3', text: '#393b3b', primary: '#513a2a' },
  hedge: { background: '#415e31', text: '#f7f1d6', primary: '#6a994e' },
  honey: { background: '#f2aa00', text: '#f3eecb', primary: '#fff546' },
  horizon: { background: '#1c1e26', text: '#bbbbbb', primary: '#c4a88a' },
  husqy: { background: '#000000', text: '#ebd7ff', primary: '#c58aff' },
  iceberg_dark: { background: '#161821', text: '#c6c8d1', primary: '#84a0c6' },
  iceberg_light: { background: '#e8e9ec', text: '#33374c', primary: '#2d539e' },
  incognito: { background: '#0e0e0e', text: '#c6c6c6', primary: '#ff9900' },
  ishtar: { background: '#202020', text: '#fae1c3', primary: '#91170c' },
  iv_clover: { background: '#a0a0a0', text: '#3b2d3b', primary: '#573e40' },
  iv_spade: { background: '#0c0c0c', text: '#d3c2c3', primary: '#b7976a' },
  joker: { background: '#1a0e25', text: '#e9e2f5', primary: '#99de1e' },
  laser: { background: '#221b44', text: '#dbe7e8', primary: '#009eaf' },
  lavender: { background: '#ada6c2', text: '#2f2a41', primary: '#e4e3e9' },
  leather: { background: '#a86948', text: '#ffe4bc', primary: '#ffe4bc' },
  lil_dragon: { background: '#ebe1ef', text: '#212b43', primary: '#8a5bd6' },
  lilac_mist: { background: '#fffbfe', text: '#5c2954', primary: '#b94189' },
  lime: { background: '#7c878e', text: '#bfcfdc', primary: '#93c247' },
  luna: { background: '#221c35', text: '#ffe3eb', primary: '#f67599' },
  macroblank: { background: '#b2d2c8', text: '#490909', primary: '#c13117' },
  magic_girl: { background: '#ffffff', text: '#00ac8c', primary: '#f5b1cc' },
  mashu: { background: '#2b2b2c', text: '#f1e2e4', primary: '#76689a' },
  matcha_moccha: { background: '#523525', text: '#ecddcc', primary: '#7ec160' },
  material: { background: '#263238', text: '#e6edf3', primary: '#80cbc4' },
  matrix: { background: '#000000', text: '#d1ffcd', primary: '#15ff00' },
  menthol: { background: '#00c18c', text: '#ffffff', primary: '#ffffff' },
  metaverse: { background: '#232323', text: '#e8e8e8', primary: '#d82934' },
  metropolis: { background: '#0f1f2c', text: '#e4edf1', primary: '#56c3b7' },
  mexican: { background: '#f8ad34', text: '#eee', primary: '#b12189' },
  miami: { background: '#f35588', text: '#f0e9ec', primary: '#05dfd7' },
  miami_nights: { background: '#18181a', text: '#fff', primary: '#e4609b' },
  midnight: { background: '#0b0e13', text: '#9fadc6', primary: '#60759f' },
  milkshake: { background: '#ffffff', text: '#212b43', primary: '#212b43' },
  mint: { background: '#05385b', text: '#edf5e1', primary: '#5cdb95' },
  mizu: { background: '#afcbdd', text: '#1a2633', primary: '#fcfbf6' },
  modern_dolch: { background: '#2d2e30', text: '#e3e6eb', primary: '#7eddd3' },
  modern_dolch_light: { background: '#dbdbdb', text: '#454545', primary: '#8fd1c3' },
  modern_ink: { background: '#ffffff', text: '#000000', primary: '#ff360d' },
  monokai: { background: '#272822', text: '#e2e2dc', primary: '#a6e22e' },
  moonlight: { background: '#191f28', text: '#ccccb5', primary: '#c69f68' },
  mountain: { background: '#0f0f0f', text: '#e7e7e7', primary: '#e7e7e7' },
  mr_sleeves: { background: '#d1d7da', text: '#1d1d1d', primary: '#daa99b' },
  ms_cupcakes: { background: '#ffffff', text: '#0a282f', primary: '#5ed5f3' },
  muted: { background: '#525252', text: '#b1e4e3', primary: '#c5b4e3' },
  nautilus: { background: '#132237', text: '#1cbaac', primary: '#ebb723' },
  nebula: { background: '#212135', text: '#838686', primary: '#be3c88' },
  night_runner: { background: '#212121', text: '#e8e8e8', primary: '#feff04' },
  nord: { background: '#242933', text: '#d8dee9', primary: '#88c0d0' },
  nord_light: { background: '#eceff4', text: '#8fbcbb', primary: '#8fbcbb' }, // text and main same
  norse: { background: '#242425', text: '#ccc2b1', primary: '#2b5f6d' },
  oblivion: { background: '#313231', text: '#f7f5f1', primary: '#a5a096' },
  olive: { background: '#e9e5cc', text: '#373731', primary: '#92946f' },
  olivia: { background: '#1c1b1d', text: '#f2efed', primary: '#deaf9d' },
  onedark: { background: '#2f343f', text: '#98c379', primary: '#61afef' },
  paper: { background: '#eeeeee', text: '#444444', primary: '#444444' },
  passion_fruit: { background: '#7c2142', text: '#ffffff', primary: '#f4a3b4' },
  pastel: { background: '#e0b2bd', text: '#6d5c6f', primary: '#fbf4b6' },
  peach_blossom: { background: '#292929', text: '#fecea8', primary: '#99b898' },
  peaches: { background: '#e0d7c1', text: '#5f4c41', primary: '#dd7a5f' },
  phantom: { background: '#001', text: '#c0caf5', primary: '#7aa2f7' },
  pink_lemonade: { background: '#f6d992', text: '#fcfcf8', primary: '#f6a192' },
  pulse: { background: '#181818', text: '#e5f4f4', primary: '#17b8bd' },
  purpleish: { background: '#1e1e32', text: '#a3a3cc', primary: '#7a52cc' },
  rainbow_trail: { background: '#f5f5f5', text: '#1f1f1f', primary: '#363636' }, // main and text similar
  red_dragon: { background: '#1a0b0c', text: '#4a4d4e', primary: '#ff3a32' },
  red_samurai: { background: '#84202c', text: '#e2dad0', primary: '#c79e6e' },
  repose_dark: { background: '#2f3338', text: '#d6d2bc', primary: '#d6d2bc' },
  repose_light: { background: '#efead0', text: '#333538', primary: '#5f605e' },
  retro: { background: '#dad3c1', text: '#1d1b17', primary: '#1d1b17' },
  retrocast: { background: '#07737a', text: '#ffffff', primary: '#88dbdf' },
  rose_pine: { background: '#1f1d27', text: '#e0def4', primary: '#9ccfd8' },
  rose_pine_dawn: { background: '#fffaf3', text: '#286983', primary: '#56949f' },
  rose_pine_moon: { background: '#2a273f', text: '#e0def4', primary: '#9ccfd8' },
  rudy: { background: '#1a2b3e', text: '#c9c8bf', primary: '#af8f5c' },
  ryujinscales: { background: '#081426', text: '#ffe4bc', primary: '#f17754' },
  serika: { background: '#e1e1e3', text: '#323437', primary: '#e2b714' },
  serika_dark: { background: '#323437', text: '#d1d0c5', primary: '#e2b714' },
  sewing_tin: { background: '#241963', text: '#ffffff', primary: '#f2ce83' },
  sewing_tin_light: { background: '#ffffff', text: '#2d2076', primary: '#2d2076' },
  shadow: { background: '#000', text: '#eee', primary: '#eee' },
  shoko: { background: '#ced7e0', text: '#3b4c58', primary: '#81c4dd' },
  slambook: { background: '#fffdde', text: '#13005a', primary: '#03001c' },
  snes: { background: '#bfbec2', text: '#2e2e2e', primary: '#553d94' },
  soaring_skies: { background: '#fff9f2', text: '#1d1e1e', primary: '#55c6f0' },
  solarized_dark: { background: '#002b36', text: '#268bd2', primary: '#859900' }, // text is blue, main is green
  solarized_light: { background: '#fdf6e3', text: '#181819', primary: '#859900' },
  solarized_osaka: { background: '#00141a', text: '#eee8d5', primary: '#859900' },
  sonokai: { background: '#2c2e34', text: '#e2e2e3', primary: '#9ed072' },
  stealth: { background: '#010203', text: '#383e42', primary: '#383e42' }, // text and main same
  strawberry: { background: '#f37f83', text: '#fcfcf8', primary: '#fcfcf8' },
  striker: { background: '#124883', text: '#d6dbd9', primary: '#d7dcda' },
  suisei: { background: '#3b4a62', text: '#dbdeeb', primary: '#bef0ff' },
  sunset: { background: '#211e24', text: '#f4e0c9', primary: '#f79777' },
  superuser: { background: '#262a33', text: '#e5f7ef', primary: '#43ffaf' },
  sweden: { background: '#0058a3', text: '#ffffff', primary: '#ffcc02' },
  tangerine: { background: '#ffede0', text: '#3d1705', primary: '#fe5503' },
  taro: { background: '#b3baff', text: '#130f1a', primary: '#130f1a' },
  terminal: { background: '#191a1b', text: '#e7eae0', primary: '#79a617' },
  terra: { background: '#0c100e', text: '#f0edd1', primary: '#89c559' },
  terrazzo: { background: '#f1e5da', text: '#023e3b', primary: '#e0794e' },
  terror_below: { background: '#0b1e1a', text: '#dceae5', primary: '#66ac92' },
  tiramisu: { background: '#cfc6b9', text: '#7d5448', primary: '#c0976f' },
  trackday: { background: '#464d66', text: '#cfcfcf', primary: '#e0513e' },
  trance: { background: '#00021b', text: '#fff', primary: '#e51376' },
  tron_orange: { background: '#0d1c1c', text: '#ffffff', primary: '#f0e800' },
  vaporwave: { background: '#a4a7ea', text: '#f1ebf1', primary: '#e368da' },
  vesper: { background: '#101010', text: '#ffffff', primary: '#ffc799' },
  viridescent: { background: '#2c3333', text: '#e9f5db', primary: '#95d5b2' },
  voc: { background: '#190618', text: '#eeeae4', primary: '#e0caac' },
  vscode: { background: '#1e1e1e', text: '#d4d4d4', primary: '#007acc' },
  watermelon: { background: '#1f4437', text: '#cdc6bc', primary: '#d6686f' },
  wavez: { background: '#1c292f', text: '#e9efe6', primary: '#6bde3b' },
  witch_girl: { background: '#f3dbda', text: '#56786a', primary: '#56786a' }
};

let activeThemeStyleElement: HTMLStyleElement | null = null;

function themeCss(theme: AppTheme) {
  return theme.path ? `@import url('${theme.path}');` : '';
}

export function applyTheme(themeId: string): void {
  const theme = availableAppThemes.find((t) => t.id === themeId);
  if (!theme) {
    console.warn(`Theme '${themeId}' not found.`);
    return;
  }

  const newThemeStyleElement = document.createElement('style');
  newThemeStyleElement.id = `theme-${theme.id}`;
  newThemeStyleElement.innerHTML = themeCss(theme);
  document.head.appendChild(newThemeStyleElement);

  if (activeThemeStyleElement) {
    document.head.removeChild(activeThemeStyleElement);
  }

  activeThemeStyleElement = newThemeStyleElement;

  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme.baseMode ?? 'dark');
  document.documentElement.setAttribute('data-theme', theme.id);
  localStorage.setItem('switch-ai-theme', theme.id);

  window.dispatchEvent(
    new CustomEvent('themechanged', { detail: { theme: theme.id, baseMode: theme.baseMode } })
  );
}

export function loadSavedTheme(): void {
  const savedThemeId = localStorage.getItem('switch-ai-theme');
  if (savedThemeId) {
    applyTheme(savedThemeId);
  } else {
    applyTheme('dark');
  }
}

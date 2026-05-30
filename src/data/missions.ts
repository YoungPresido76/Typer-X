/**
 * TYPER X — Mission Catalogue
 * 150 missions: 90 Daily · 40 Weekly · 20 Achievements
 *
 * XP Reward Philosophy (anti-inflation):
 *   Daily   easy   →  50–100 XP   (quick habits)
 *   Daily   medium → 100–150 XP   (focused sessions)
 *   Daily   hard   → 150–250 XP   (stretch goals)
 *   Weekly  easy   → 300–500 XP   (consistency)
 *   Weekly  medium → 500–800 XP   (endurance)
 *   Weekly  hard   → 800–1500 XP  (mastery)
 *   Achievement    → 200–3000 XP  (permanent milestones)
 *
 *   Target daily earnings (active user): 400–800 XP
 *   Target weekly earnings:             2000–5000 XP
 *   This keeps level 1→2 at ~3 active days, scaling naturally.
 *
 * All currentValue starts at 0 — real progress syncs from IME bridge.
 */

import { Mission } from '../types';

/* ─────────────────────────────────────────
   DAILY MISSIONS  (90 total — 5 active/day)
───────────────────────────────────────── */
export const DAILY_MISSIONS: Mission[] = [
  // ── Word Count ──
  { id: 'd-words-50',     type:'daily', title:'Type 50 words',           description:'A gentle warm-up. Just get typing.',               xpReward:50,  coinReward:20,  currentValue:0, targetValue:50,    completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-100',    type:'daily', title:'Type 100 words',          description:'A short paragraph worth of keys.',                 xpReward:60,  coinReward:25,  currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-250',    type:'daily', title:'Type 250 words',          description:'Keep the momentum going.',                         xpReward:75,  coinReward:30,  currentValue:0, targetValue:250,   completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-500',    type:'daily', title:'Type 500 words',          description:'Half a thousand — a solid daily session.',         xpReward:100, coinReward:40,  currentValue:0, targetValue:500,   completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-750',    type:'daily', title:'Type 750 words',          description:'Three quarters done — push through.',              xpReward:120, coinReward:50,  currentValue:0, targetValue:750,   completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-1000',   type:'daily', title:'Type 1,000 words',        description:'A full session. Dedicated typist.',                xpReward:150, coinReward:60,  currentValue:0, targetValue:1000,  completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-1500',   type:'daily', title:'Type 1,500 words',        description:'The grind is real. Keep going.',                   xpReward:175, coinReward:70,  currentValue:0, targetValue:1500,  completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-2000',   type:'daily', title:'Type 2,000 words',        description:'Two thousand. That\'s some serious typing.',       xpReward:200, coinReward:80,  currentValue:0, targetValue:2000,  completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-3000',   type:'daily', title:'Type 3,000 words',        description:'Unstoppable. Elite daily output.',                 xpReward:250, coinReward:100, currentValue:0, targetValue:3000,  completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-words-5000',   type:'daily', title:'Type 5,000 words',        description:'Marathon daily. Absolute beast mode.',            xpReward:300, coinReward:120, currentValue:0, targetValue:5000,  completed:false, claimed:false, iconName:'FileText' },

  // ── Key Presses ──
  { id: 'd-keys-200',     type:'daily', title:'Press 200 keys',          description:'Warm those fingers up.',                          xpReward:50,  coinReward:20,  currentValue:0, targetValue:200,   completed:false, claimed:false, iconName:'Keyboard' },
  { id: 'd-keys-500',     type:'daily', title:'Press 500 keys',          description:'Half a thousand keystrokes.',                     xpReward:60,  coinReward:25,  currentValue:0, targetValue:500,   completed:false, claimed:false, iconName:'Keyboard' },
  { id: 'd-keys-1000',    type:'daily', title:'Press 1,000 keys',        description:'A thousand taps. Solid foundation.',              xpReward:80,  coinReward:35,  currentValue:0, targetValue:1000,  completed:false, claimed:false, iconName:'Keyboard' },
  { id: 'd-keys-2500',    type:'daily', title:'Press 2,500 keys',        description:'Dedicated finger work today.',                    xpReward:100, coinReward:40,  currentValue:0, targetValue:2500,  completed:false, claimed:false, iconName:'Keyboard' },
  { id: 'd-keys-5000',    type:'daily', title:'Press 5,000 keys',        description:'Five thousand keystrokes. Elite.',                xpReward:150, coinReward:60,  currentValue:0, targetValue:5000,  completed:false, claimed:false, iconName:'Keyboard' },
  { id: 'd-keys-10000',   type:'daily', title:'Press 10,000 keys',       description:'Ten thousand. You\'re a machine.',                xpReward:200, coinReward:80,  currentValue:0, targetValue:10000, completed:false, claimed:false, iconName:'Keyboard' },

  // ── WPM Speed ──
  { id: 'd-wpm-20',       type:'daily', title:'Reach 20 WPM',            description:'A good start for any typist.',                    xpReward:50,  coinReward:20,  currentValue:0, targetValue:20,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'd-wpm-30',       type:'daily', title:'Reach 30 WPM',            description:'Comfortable cruising speed.',                     xpReward:60,  coinReward:25,  currentValue:0, targetValue:30,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'd-wpm-40',       type:'daily', title:'Reach 40 WPM average',    description:'You\'re building real momentum.',                 xpReward:75,  coinReward:30,  currentValue:0, targetValue:40,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'd-wpm-50',       type:'daily', title:'Hit 50 WPM today',        description:'Half a century of words per minute.',             xpReward:100, coinReward:40,  currentValue:0, targetValue:50,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'd-wpm-60',       type:'daily', title:'Hit 60 WPM today',        description:'Getting into expert territory.',                  xpReward:125, coinReward:50,  currentValue:0, targetValue:60,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'd-wpm-70',       type:'daily', title:'Hit 70 WPM today',        description:'70 WPM. Very few reach this daily.',              xpReward:150, coinReward:60,  currentValue:0, targetValue:70,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'd-wpm-80',       type:'daily', title:'Hit 80 WPM today',        description:'Elite speed. You\'re rare.',                     xpReward:200, coinReward:80,  currentValue:0, targetValue:80,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'd-wpm-100',      type:'daily', title:'Hit 100 WPM today',       description:'Century speed. Absolute legend.',                 xpReward:250, coinReward:100, currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'Zap' },

  // ── Accuracy ──
  { id: 'd-acc-80',       type:'daily', title:'80% accuracy session',    description:'Four in five keystrokes correct.',                xpReward:50,  coinReward:20,  currentValue:0, targetValue:80,    completed:false, claimed:false, iconName:'Target' },
  { id: 'd-acc-85',       type:'daily', title:'85% accuracy session',    description:'Consistent and clean.',                          xpReward:60,  coinReward:25,  currentValue:0, targetValue:85,    completed:false, claimed:false, iconName:'Target' },
  { id: 'd-acc-90',       type:'daily', title:'90% accuracy session',    description:'Nine in ten. Impressive precision.',              xpReward:80,  coinReward:35,  currentValue:0, targetValue:90,    completed:false, claimed:false, iconName:'Target' },
  { id: 'd-acc-95',       type:'daily', title:'Maintain 95% accuracy',   description:'Near perfect. Barely any mistakes.',             xpReward:100, coinReward:40,  currentValue:0, targetValue:95,    completed:false, claimed:false, iconName:'Target' },
  { id: 'd-acc-98',       type:'daily', title:'Maintain 98% accuracy',   description:'Two wrong in a hundred. Surgical precision.',    xpReward:150, coinReward:60,  currentValue:0, targetValue:98,    completed:false, claimed:false, iconName:'Target' },
  { id: 'd-acc-100',      type:'daily', title:'Perfect accuracy session', description:'Zero mistakes. Flawless.',                       xpReward:200, coinReward:80,  currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'Target' },

  // ── Sessions / Time ──
  { id: 'd-sess-1',       type:'daily', title:'Complete 1 typing session',description:'Just open the keyboard and go.',                 xpReward:50,  coinReward:20,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Clock' },
  { id: 'd-sess-3',       type:'daily', title:'Complete 3 sessions',     description:'Three separate typing moments today.',           xpReward:75,  coinReward:30,  currentValue:0, targetValue:3,     completed:false, claimed:false, iconName:'Clock' },
  { id: 'd-sess-5',       type:'daily', title:'Complete 5 sessions',     description:'Five times you sat down and typed.',             xpReward:100, coinReward:40,  currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Clock' },
  { id: 'd-sess-10',      type:'daily', title:'Complete 10 sessions',    description:'Ten sessions. All-day typist.',                  xpReward:150, coinReward:60,  currentValue:0, targetValue:10,    completed:false, claimed:false, iconName:'Clock' },
  { id: 'd-time-5',       type:'daily', title:'Type for 5 minutes',      description:'Five solid minutes behind the keyboard.',        xpReward:60,  coinReward:25,  currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Clock' },
  { id: 'd-time-15',      type:'daily', title:'Type for 15 minutes',     description:'Quarter hour of active typing.',                 xpReward:100, coinReward:40,  currentValue:0, targetValue:15,    completed:false, claimed:false, iconName:'Clock' },
  { id: 'd-time-30',      type:'daily', title:'Type for 30 minutes',     description:'Half an hour. Real commitment.',                 xpReward:150, coinReward:60,  currentValue:0, targetValue:30,    completed:false, claimed:false, iconName:'Clock' },
  { id: 'd-time-60',      type:'daily', title:'Type for 60 minutes',     description:'An hour of productive typing.',                  xpReward:200, coinReward:80,  currentValue:0, targetValue:60,    completed:false, claimed:false, iconName:'Clock' },

  // ── Streaks ──
  { id: 'd-streak-1',     type:'daily', title:'Day 1 streak',            description:'First day — the journey begins.',                xpReward:50,  coinReward:20,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'd-streak-2',     type:'daily', title:'2-day streak',            description:'Two days in a row. Habit forming.',              xpReward:60,  coinReward:25,  currentValue:0, targetValue:2,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'd-streak-3',     type:'daily', title:'3-day streak',            description:'Three days. The habit is locking in.',           xpReward:75,  coinReward:30,  currentValue:0, targetValue:3,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'd-streak-5',     type:'daily', title:'5-day streak',            description:'Workweek warrior. Five days straight.',          xpReward:100, coinReward:40,  currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'd-streak-7',     type:'daily', title:'7-day streak',            description:'A full week! You\'re on fire.',                  xpReward:150, coinReward:60,  currentValue:0, targetValue:7,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'd-streak-14',    type:'daily', title:'14-day streak',           description:'Two solid weeks. Unstoppable.',                  xpReward:200, coinReward:80,  currentValue:0, targetValue:14,    completed:false, claimed:false, iconName:'Flame' },
  { id: 'd-streak-30',    type:'daily', title:'30-day streak',           description:'A full month of typing daily. Legend.',          xpReward:300, coinReward:120, currentValue:0, targetValue:30,    completed:false, claimed:false, iconName:'Flame' },

  // ── App Variety ──
  { id: 'd-apps-2',       type:'daily', title:'Type in 2 different apps', description:'Use your keyboard across multiple apps today.',  xpReward:75,  coinReward:30,  currentValue:0, targetValue:2,     completed:false, claimed:false, iconName:'Grid' },
  { id: 'd-apps-3',       type:'daily', title:'Type in 3 different apps', description:'Versatile typist — across three apps.',        xpReward:100, coinReward:40,  currentValue:0, targetValue:3,     completed:false, claimed:false, iconName:'Grid' },
  { id: 'd-apps-5',       type:'daily', title:'Type in 5 different apps', description:'Five apps. You type everywhere.',               xpReward:150, coinReward:60,  currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Grid' },
  { id: 'd-msg-10',       type:'daily', title:'Send 10 messages',         description:'Quick-fire typing across chats.',               xpReward:60,  coinReward:25,  currentValue:0, targetValue:10,    completed:false, claimed:false, iconName:'MessageCircle' },
  { id: 'd-msg-25',       type:'daily', title:'Send 25 messages',         description:'Active communicator today.',                    xpReward:80,  coinReward:35,  currentValue:0, targetValue:25,    completed:false, claimed:false, iconName:'MessageCircle' },
  { id: 'd-msg-50',       type:'daily', title:'Send 50 messages',         description:'Fifty messages. You\'re busy today.',           xpReward:100, coinReward:40,  currentValue:0, targetValue:50,    completed:false, claimed:false, iconName:'MessageCircle' },

  // ── XP Earned Daily ──
  { id: 'd-xp-100',       type:'daily', title:'Earn 100 XP today',        description:'A small but meaningful daily gain.',            xpReward:50,  coinReward:20,  currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'Star' },
  { id: 'd-xp-250',       type:'daily', title:'Earn 250 XP today',        description:'Good daily XP output.',                        xpReward:75,  coinReward:30,  currentValue:0, targetValue:250,   completed:false, claimed:false, iconName:'Star' },
  { id: 'd-xp-500',       type:'daily', title:'Earn 500 XP today',        description:'Half a thousand XP. Productive day.',          xpReward:100, coinReward:40,  currentValue:0, targetValue:500,   completed:false, claimed:false, iconName:'Star' },
  { id: 'd-xp-1000',      type:'daily', title:'Earn 1,000 XP today',      description:'A thousand XP in a single day. Elite.',        xpReward:150, coinReward:60,  currentValue:0, targetValue:1000,  completed:false, claimed:false, iconName:'Star' },

  // ── Special Daily ──
  { id: 'd-no-error-50',  type:'daily', title:'50 words zero mistakes',   description:'Type 50 words with no backspaces.',             xpReward:100, coinReward:40,  currentValue:0, targetValue:50,    completed:false, claimed:false, iconName:'Shield' },
  { id: 'd-no-error-100', type:'daily', title:'100 words zero mistakes',  description:'A hundred clean words. No errors allowed.',     xpReward:150, coinReward:60,  currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'Shield' },
  { id: 'd-long-word-10', type:'daily', title:'Type 10 long words (7+ chars)', description:'Big words require big skill.',             xpReward:75,  coinReward:30,  currentValue:0, targetValue:10,    completed:false, claimed:false, iconName:'AlignLeft' },
  { id: 'd-long-word-25', type:'daily', title:'Type 25 long words',       description:'Twenty-five seven-plus-char words typed.',      xpReward:100, coinReward:40,  currentValue:0, targetValue:25,    completed:false, claimed:false, iconName:'AlignLeft' },
  { id: 'd-capital-20',   type:'daily', title:'Use 20 capitalized words', description:'Shift those fingers — proper nouns and names.', xpReward:60,  coinReward:25,  currentValue:0, targetValue:20,    completed:false, claimed:false, iconName:'Type' },
  { id: 'd-emoji-5',      type:'daily', title:'Use 5 emojis while typing', description:'Emojis count as expression keystrokes.',       xpReward:50,  coinReward:20,  currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Smile' },
  { id: 'd-copy-paste-0', type:'daily', title:'No copy-paste today',      description:'Every word typed manually. No cheating.',       xpReward:100, coinReward:40,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'ClipboardX' },
  { id: 'd-night-type',   type:'daily', title:'Type after 9 PM',          description:'Night owl session. Keyboard never sleeps.',     xpReward:75,  coinReward:30,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Moon' },
  { id: 'd-morning-type', type:'daily', title:'Type before 9 AM',         description:'Early bird gets the XP.',                      xpReward:75,  coinReward:30,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Sun' },
  { id: 'd-lunch-type',   type:'daily', title:'Type during lunch hour',   description:'12PM–2PM session. Productive lunch break.',     xpReward:60,  coinReward:25,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Coffee' },

  // ── Bonus / Missions ──
  { id: 'd-daily-bonus',  type:'daily', title:'Complete all daily missions', description:'Claim the daily bonus by finishing everything.', xpReward:300, coinReward:120, currentValue:0, targetValue:4,   completed:false, claimed:false, iconName:'Gift' },
  { id: 'd-comeback',     type:'daily', title:'Return after a 1-day break', description:'Back in the saddle after missing one day.',    xpReward:75,  coinReward:30,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'RefreshCw' },
  { id: 'd-improve-wpm',  type:'daily', title:'Beat your WPM record',     description:'Type faster than yesterday\'s average.',         xpReward:100, coinReward:40,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'TrendingUp' },
  { id: 'd-improve-acc',  type:'daily', title:'Beat your accuracy record', description:'Higher accuracy than yesterday\'s session.',    xpReward:100, coinReward:40,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'TrendingUp' },
  { id: 'd-social-share', type:'daily', title:'Share your stats',         description:'Share your daily stats with the world.',         xpReward:50,  coinReward:20,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Share2' },
  { id: 'd-visit-app',    type:'daily', title:'Open Typer X today',       description:'Just showing up counts. Keep the habit.',        xpReward:30,  coinReward:10,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'LogIn' },
  { id: 'd-claim-reward', type:'daily', title:'Claim a daily reward',     description:'Don\'t let that chest expire!',                  xpReward:50,  coinReward:20,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Gift' },
  { id: 'd-view-lb',      type:'daily', title:'Check the leaderboard',    description:'Know your standing. Check rankings today.',      xpReward:30,  coinReward:10,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Trophy' },
  { id: 'd-update-prof',  type:'daily', title:'Update your profile',      description:'Add or update your username/avatar.',            xpReward:50,  coinReward:20,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'User' },

  // ── Sentences & Paragraphs ──
  { id: 'd-sent-5',       type:'daily', title:'Complete 5 full sentences', description:'Punctuation included. Full thoughts only.',      xpReward:60,  coinReward:25,  currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'AlignLeft' },
  { id: 'd-sent-20',      type:'daily', title:'Complete 20 full sentences', description:'Twenty complete thoughts typed today.',         xpReward:100, coinReward:40,  currentValue:0, targetValue:20,    completed:false, claimed:false, iconName:'AlignLeft' },
  { id: 'd-sent-50',      type:'daily', title:'Complete 50 sentences',    description:'Fifty sentences. Heavy session.',                xpReward:150, coinReward:60,  currentValue:0, targetValue:50,    completed:false, claimed:false, iconName:'AlignLeft' },
  { id: 'd-para-1',       type:'daily', title:'Type 1 full paragraph',    description:'150+ words, punctuated properly.',               xpReward:75,  coinReward:30,  currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-para-5',       type:'daily', title:'Type 5 full paragraphs',   description:'Five meaty blocks of text.',                     xpReward:125, coinReward:50,  currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'FileText' },
  { id: 'd-backspace-0',  type:'daily', title:'Under 10 backspaces',      description:'Clean typing — minimal corrections in 100 words.', xpReward:100, coinReward:40, currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Delete' },
  { id: 'd-numbers-10',   type:'daily', title:'Type 10 numbers',          description:'Digits count! Use the number row.',              xpReward:50,  coinReward:20,  currentValue:0, targetValue:10,    completed:false, claimed:false, iconName:'Hash' },
  { id: 'd-punct-20',     type:'daily', title:'Use 20 punctuation marks', description:'Commas, periods, exclamation points — use them.', xpReward:60, coinReward:25,  currentValue:0, targetValue:20,    completed:false, claimed:false, iconName:'Minus' },
];

/* ─────────────────────────────────────────
   WEEKLY MISSIONS  (40 total — 4 active/week)
───────────────────────────────────────── */
export const WEEKLY_MISSIONS: Mission[] = [
  // ── Word Count ──
  { id: 'w-words-1k',     type:'weekly', title:'Type 1,000 words this week',  description:'A manageable weekly word target.',              xpReward:300,  coinReward:120, currentValue:0, targetValue:1000,  completed:false, claimed:false, iconName:'FileText' },
  { id: 'w-words-2500',   type:'weekly', title:'Type 2,500 words this week',  description:'Two and a half thousand. Active week.',         xpReward:400,  coinReward:160, currentValue:0, targetValue:2500,  completed:false, claimed:false, iconName:'FileText' },
  { id: 'w-words-5k',     type:'weekly', title:'Type 5,000 words this week',  description:'Five thousand. Consistent and strong.',         xpReward:500,  coinReward:200, currentValue:0, targetValue:5000,  completed:false, claimed:false, iconName:'FileText' },
  { id: 'w-words-10k',    type:'weekly', title:'Type 10,000 words this week', description:'Ten thousand words. Professional output.',      xpReward:700,  coinReward:280, currentValue:0, targetValue:10000, completed:false, claimed:false, iconName:'FileText' },
  { id: 'w-words-25k',    type:'weekly', title:'Type 25,000 words this week', description:'Twenty-five thousand. Power user.',             xpReward:1000, coinReward:400, currentValue:0, targetValue:25000, completed:false, claimed:false, iconName:'FileText' },
  { id: 'w-words-50k',    type:'weekly', title:'Type 50,000 words this week', description:'Fifty thousand. You basically live here.',      xpReward:1500, coinReward:600, currentValue:0, targetValue:50000, completed:false, claimed:false, iconName:'FileText' },

  // ── Keys ──
  { id: 'w-keys-5k',      type:'weekly', title:'Press 5,000 keys this week',  description:'Five thousand keystrokes. Warm those hands.',   xpReward:300,  coinReward:120, currentValue:0, targetValue:5000,  completed:false, claimed:false, iconName:'Keyboard' },
  { id: 'w-keys-25k',     type:'weekly', title:'Press 25,000 keys this week', description:'Quarter million keystroke journey starts.',     xpReward:500,  coinReward:200, currentValue:0, targetValue:25000, completed:false, claimed:false, iconName:'Keyboard' },
  { id: 'w-keys-50k',     type:'weekly', title:'Press 50,000 keys this week', description:'Fifty thousand. Legendary commitment.',         xpReward:800,  coinReward:320, currentValue:0, targetValue:50000, completed:false, claimed:false, iconName:'Keyboard' },
  { id: 'w-keys-100k',    type:'weekly', title:'Press 100,000 keys this week',description:'Six figures. You are the keyboard.',            xpReward:1200, coinReward:480, currentValue:0, targetValue:100000,completed:false, claimed:false, iconName:'Keyboard' },

  // ── XP Earned ──
  { id: 'w-xp-500',       type:'weekly', title:'Earn 500 XP this week',       description:'A steady week of grinding.',                    xpReward:300,  coinReward:120, currentValue:0, targetValue:500,   completed:false, claimed:false, iconName:'Star' },
  { id: 'w-xp-1000',      type:'weekly', title:'Earn 1,000 XP this week',     description:'A thousand XP in seven days.',                  xpReward:400,  coinReward:160, currentValue:0, targetValue:1000,  completed:false, claimed:false, iconName:'Star' },
  { id: 'w-xp-2500',      type:'weekly', title:'Earn 2,500 XP this week',     description:'Two and a half thousand. Dedicated.',           xpReward:500,  coinReward:200, currentValue:0, targetValue:2500,  completed:false, claimed:false, iconName:'Star' },
  { id: 'w-xp-5000',      type:'weekly', title:'Earn 5,000 XP this week',     description:'Five thousand XP. Top performer.',              xpReward:700,  coinReward:280, currentValue:0, targetValue:5000,  completed:false, claimed:false, iconName:'Star' },
  { id: 'w-xp-10000',     type:'weekly', title:'Earn 10,000 XP this week',    description:'Ten thousand. Ranked typist territory.',        xpReward:1000, coinReward:400, currentValue:0, targetValue:10000, completed:false, claimed:false, iconName:'Star' },

  // ── Consistency ──
  { id: 'w-every-day',    type:'weekly', title:'Type every day this week',     description:'Seven consecutive days of typing.',             xpReward:800,  coinReward:320, currentValue:0, targetValue:7,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'w-5-of-7',       type:'weekly', title:'Type 5 out of 7 days',        description:'Five active days this week.',                   xpReward:500,  coinReward:200, currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'w-3-of-7',       type:'weekly', title:'Type 3 out of 7 days',        description:'Three days minimum. Casual goal.',              xpReward:300,  coinReward:120, currentValue:0, targetValue:3,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'w-daily-miss-5', type:'weekly', title:'Complete 5 daily missions',   description:'Knock out five daily missions this week.',      xpReward:400,  coinReward:160, currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Trophy' },
  { id: 'w-daily-miss-10',type:'weekly', title:'Complete 10 daily missions',  description:'Ten daily missions. Relentless.',               xpReward:600,  coinReward:240, currentValue:0, targetValue:10,    completed:false, claimed:false, iconName:'Trophy' },
  { id: 'w-daily-miss-20',type:'weekly', title:'Complete 20 daily missions',  description:'Twenty daily completions this week.',           xpReward:900,  coinReward:360, currentValue:0, targetValue:20,    completed:false, claimed:false, iconName:'Trophy' },

  // ── Speed & Accuracy ──
  { id: 'w-wpm-avg-40',   type:'weekly', title:'Average 40 WPM this week',    description:'Maintain 40 WPM average across all sessions.', xpReward:400,  coinReward:160, currentValue:0, targetValue:40,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'w-wpm-avg-60',   type:'weekly', title:'Average 60 WPM this week',    description:'Sixty WPM average. Expert level.',              xpReward:600,  coinReward:240, currentValue:0, targetValue:60,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'w-wpm-avg-80',   type:'weekly', title:'Average 80 WPM this week',    description:'Eighty WPM sustained. Rare.',                   xpReward:900,  coinReward:360, currentValue:0, targetValue:80,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'w-acc-90',       type:'weekly', title:'90% accuracy all week',       description:'Ninety percent across the whole week.',         xpReward:500,  coinReward:200, currentValue:0, targetValue:90,    completed:false, claimed:false, iconName:'Target' },
  { id: 'w-acc-95',       type:'weekly', title:'95% accuracy all week',       description:'Near-perfect week. Surgical typist.',           xpReward:700,  coinReward:280, currentValue:0, targetValue:95,    completed:false, claimed:false, iconName:'Target' },

  // ── App Coverage ──
  { id: 'w-apps-3',       type:'weekly', title:'Type in 3+ apps this week',   description:'Keyboard versatility across apps.',             xpReward:300,  coinReward:120, currentValue:0, targetValue:3,     completed:false, claimed:false, iconName:'Grid' },
  { id: 'w-apps-5',       type:'weekly', title:'Type in 5+ apps this week',   description:'Five different apps typed in this week.',       xpReward:400,  coinReward:160, currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Grid' },
  { id: 'w-apps-10',      type:'weekly', title:'Type in 10+ apps this week',  description:'Ten apps. You use your phone for everything.',  xpReward:600,  coinReward:240, currentValue:0, targetValue:10,    completed:false, claimed:false, iconName:'Grid' },
  { id: 'w-msg-100',      type:'weekly', title:'Send 100 messages this week', description:'Hundred messages. Active communicator.',        xpReward:400,  coinReward:160, currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'MessageCircle' },
  { id: 'w-msg-500',      type:'weekly', title:'Send 500 messages this week', description:'Five hundred messages. You never stop.',        xpReward:700,  coinReward:280, currentValue:0, targetValue:500,   completed:false, claimed:false, iconName:'MessageCircle' },

  // ── Level & Progress ──
  { id: 'w-level-up',     type:'weekly', title:'Level up this week',          description:'Earn enough XP to advance your level.',         xpReward:500,  coinReward:200, currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'TrendingUp' },
  { id: 'w-level-2up',    type:'weekly', title:'Level up twice this week',    description:'Two levels in a single week. Beast.',           xpReward:800,  coinReward:320, currentValue:0, targetValue:2,     completed:false, claimed:false, iconName:'TrendingUp' },
  { id: 'w-buy-theme',    type:'weekly', title:'Purchase a shop item',        description:'Invest your coins in a new theme or sound.',    xpReward:300,  coinReward:0,   currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'ShoppingBag' },
  { id: 'w-visit-7',      type:'weekly', title:'Open Typer X 7 days in a row',description:'Daily check-in. Habit formation.',              xpReward:400,  coinReward:160, currentValue:0, targetValue:7,     completed:false, claimed:false, iconName:'LogIn' },
  { id: 'w-rank-top50',   type:'weekly', title:'Reach top 50 on leaderboard', description:'Climb into the global top 50.',                 xpReward:1000, coinReward:400, currentValue:0, targetValue:50,    completed:false, claimed:false, iconName:'Crown' },
  { id: 'w-rank-top10',   type:'weekly', title:'Reach top 10 on leaderboard', description:'Top ten. Your name is known.',                  xpReward:1500, coinReward:600, currentValue:0, targetValue:10,    completed:false, claimed:false, iconName:'Crown' },
  { id: 'w-perfect-day',  type:'weekly', title:'Perfect day — 100% missions', description:'Complete every active daily mission one day.',  xpReward:600,  coinReward:240, currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Award' },
];

/* ─────────────────────────────────────────
   ACHIEVEMENT MISSIONS  (20 total — permanent)
───────────────────────────────────────── */
export const ACHIEVEMENT_MISSIONS: Mission[] = [
  { id: 'ach-first-type',   type:'achievement', title:'First Keystroke',         description:'Type your very first word with Typer X.',       xpReward:200,  coinReward:100, currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Key' },
  { id: 'ach-1k-words',     type:'achievement', title:'Wordsmith I',             description:'Type 1,000 total words across your lifetime.',   xpReward:300,  coinReward:150, currentValue:0, targetValue:1000,  completed:false, claimed:false, iconName:'FileText' },
  { id: 'ach-10k-words',    type:'achievement', title:'Wordsmith II',            description:'Ten thousand total words typed.',                xpReward:500,  coinReward:250, currentValue:0, targetValue:10000, completed:false, claimed:false, iconName:'FileText' },
  { id: 'ach-100k-words',   type:'achievement', title:'Wordsmith III',           description:'One hundred thousand words. Elite scribe.',      xpReward:1000, coinReward:500, currentValue:0, targetValue:100000,completed:false, claimed:false, iconName:'FileText' },
  { id: 'ach-wpm-50',       type:'achievement', title:'Speedster I',             description:'Reach 50 WPM in any session.',                  xpReward:300,  coinReward:150, currentValue:0, targetValue:50,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'ach-wpm-80',       type:'achievement', title:'Speedster II',            description:'Reach 80 WPM. Serious speed.',                  xpReward:500,  coinReward:250, currentValue:0, targetValue:80,    completed:false, claimed:false, iconName:'Zap' },
  { id: 'ach-wpm-100',      type:'achievement', title:'Speedster III',           description:'100 WPM. You\'ve entered elite territory.',      xpReward:1000, coinReward:500, currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'Zap' },
  { id: 'ach-acc-100',      type:'achievement', title:'Perfectionist',           description:'Achieve 100% accuracy in any session.',          xpReward:500,  coinReward:250, currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'Target' },
  { id: 'ach-streak-7',     type:'achievement', title:'Consistency King',        description:'Maintain a 7-day typing streak.',                xpReward:400,  coinReward:200, currentValue:0, targetValue:7,     completed:false, claimed:false, iconName:'Flame' },
  { id: 'ach-streak-30',    type:'achievement', title:'Iron Habit',              description:'Thirty consecutive days. True dedication.',      xpReward:1000, coinReward:500, currentValue:0, targetValue:30,    completed:false, claimed:false, iconName:'Flame' },
  { id: 'ach-streak-100',   type:'achievement', title:'Eternal Flame',           description:'One hundred days straight. You are unstoppable.', xpReward:3000, coinReward:1000,currentValue:0, targetValue:100,   completed:false, claimed:false, iconName:'Flame' },
  { id: 'ach-level-5',      type:'achievement', title:'Rising Typist',           description:'Reach Level 5.',                                xpReward:300,  coinReward:150, currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'TrendingUp' },
  { id: 'ach-level-10',     type:'achievement', title:'Seasoned Typist',         description:'Reach Level 10.',                               xpReward:500,  coinReward:250, currentValue:0, targetValue:10,    completed:false, claimed:false, iconName:'TrendingUp' },
  { id: 'ach-level-25',     type:'achievement', title:'Expert Typist',           description:'Reach Level 25.',                               xpReward:1000, coinReward:500, currentValue:0, targetValue:25,    completed:false, claimed:false, iconName:'TrendingUp' },
  { id: 'ach-level-50',     type:'achievement', title:'Eternal Scribe',          description:'Reach Level 50. Full mastery unlocked.',         xpReward:5000, coinReward:2000,currentValue:0, targetValue:50,    completed:false, claimed:false, iconName:'Crown' },
  { id: 'ach-first-theme',  type:'achievement', title:'Collector',               description:'Purchase your first keyboard theme.',            xpReward:200,  coinReward:100, currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'ShoppingBag' },
  { id: 'ach-1m-keys',      type:'achievement', title:'Million Keystrokes',      description:'One million total keypresses. Machine.',         xpReward:2000, coinReward:800, currentValue:0, targetValue:1000000,completed:false,claimed:false, iconName:'Keyboard' },
  { id: 'ach-rank-1',       type:'achievement', title:'#1 — The Typer X',        description:'Reach rank #1 on the global leaderboard.',       xpReward:5000, coinReward:2000,currentValue:0, targetValue:1,     completed:false, claimed:false, iconName:'Crown' },
  { id: 'ach-night-owl',    type:'achievement', title:'Night Owl',               description:'Type after midnight 5 times.',                  xpReward:300,  coinReward:150, currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Moon' },
  { id: 'ach-early-bird',   type:'achievement', title:'Early Bird',              description:'Type before 7 AM five times.',                  xpReward:300,  coinReward:150, currentValue:0, targetValue:5,     completed:false, claimed:false, iconName:'Sun' },
];

/* ── Combined export ── */
export const ALL_MISSIONS: Mission[] = [
  ...DAILY_MISSIONS,
  ...WEEKLY_MISSIONS,
  ...ACHIEVEMENT_MISSIONS,
];

/** Pick N random daily + weekly missions to show as "active" today/this week */
export function getActiveMissions(daily = 5, weekly = 4): Mission[] {
  const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
  return [
    ...shuffle(DAILY_MISSIONS).slice(0, daily),
    ...shuffle(WEEKLY_MISSIONS).slice(0, weekly),
  ];
}

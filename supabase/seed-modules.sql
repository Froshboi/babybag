-- Babybags Complete Module Seed Data
-- Run this in your Supabase SQL Editor AFTER the schema is created

-- =====================================================
-- PHASE 1: MARKET FUNDAMENTALS (Modules 1-6 - The Field Guide)
-- =====================================================

-- MODULE 1: What is Forex?
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'What is Forex?',
  'what-is-forex',
  'Learn the basics of the foreign exchange market and how it works.',
  'Market Fundamentals', 1, 1, 5, true, 0,
  'Forex is the global market where currencies are traded. It operates 24/5 with trading sessions in Tokyo, London, and New York. The major currency pairs (EUR/USD, GBP/USD, USD/JPY) account for most volume. Unlike stocks, forex is decentralized - there is no central exchange. Trillions of dollars trade daily, making it the most liquid market on Earth.',
  ARRAY['Forex trades 24/5 across major sessions','The most traded pair is EUR/USD','Forex is decentralized with no central exchange','Trillions trade daily making it highly liquid'],
  true
);

-- MODULE 2: Reading the Price Action
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Reading the Price Action',
  'reading-price-action',
  'Understand how to interpret price movement and market structure.',
  'Market Fundamentals', 1, 2, 5, true, 0,
  'Price action is the movement of price over time. Every candle tells a story: bulls pushing up, bears pushing down, and the battle for control. Support and resistance are price levels where buyers and sellers congregate. Trends are sustained directional moves. Breakouts occur when price breaks through key levels. Volume confirms or contradicts price moves - high volume breakouts are stronger than low volume ones.',
  ARRAY['Support and resistance are battle zones','Trends are sustained directional moves','Volume confirms price movement strength','Breakouts need volume confirmation'],
  true
);

-- MODULE 3: Chart Types & Timeframes
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Chart Types & Timeframes',
  'chart-types',
  'Master candle patterns and choose the right timeframe for your strategy.',
  'Market Fundamentals', 1, 3, 5, false, 350,
  'Candlesticks show open, high, low, close (OHLC) for each period. The body shows open-close range; wicks show the full range. Bullish candles close above open; bearish candles close below. Different timeframes show different trends: M5 for scalping, H1 for day trading, D1 for swing trading. Higher timeframes filter noise and reveal true trends. Lower timeframes show more trading opportunities but higher false signals.',
  ARRAY['Candlesticks are the trading standard','Higher timeframes are more reliable','Wicks show rejection of price levels','Each timeframe tells a different story'],
  true
);

-- MODULE 4: Fundamental Factors
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Fundamental Factors',
  'fundamental-factors',
  'Learn how economic news and central banks move currency markets.',
  'Market Fundamentals', 1, 4, 6, false, 350,
  'Interest rates are the primary driver of forex - higher rates attract capital. Inflation erodes purchasing power, affecting currency strength. Employment data, GDP, and trade balances matter. Central bank decisions (ECB, Fed, BOE) create volatility. Economic calendars show when key data releases occur. Risk-on sentiment favors high-yielding currencies; risk-off favors safe havens like USD and CHF. Geopolitical events can shock markets.',
  ARRAY['Interest rates are the primary driver','Central bank decisions create big moves','Risk-on and risk-off sentiment drives flows','Always check the economic calendar'],
  true
);

-- MODULE 5: Trading Psychology
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Trading Psychology',
  'trading-psychology',
  'Develop the mindset needed to trade consistently and handle losses.',
  'Market Fundamentals', 1, 5, 6, false, 350,
  'Emotion is the trader''s worst enemy. Fear causes premature exits; greed causes over-leverage. Discipline means following your plan regardless of emotion. Consistency requires accepting losses as part of the business. The best traders have a process and stick to it. Journaling your trades reveals patterns in your decision-making. Risk management reduces the sting of losses and preserves capital for the next opportunity. Winning traders think in probabilities, not certainties.',
  ARRAY['Emotion causes 90% of trading losses','Discipline is following your plan','Journaling reveals your patterns','Think in probabilities not certainties'],
  true
);

-- MODULE 6: Building Your First Strategy
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Building Your First Strategy',
  'building-first-strategy',
  'Create a simple, testable trading strategy from scratch.',
  'Market Fundamentals', 1, 6, 7, false, 350,
  'A strategy has five components: entry rules, exit rules, position sizing, risk management, and daily goals. Start with one pair, one timeframe, one pattern. Write it down exactly. Test it on past data (backtesting). Paper trade it first. Track every trade in a journal. Measure your win rate and risk-to-reward ratio. Refine based on results. Avoid over-complication - simple strategies often outperform complex ones. The best strategy is one you''ll actually follow.',
  ARRAY['A strategy needs clear entry and exit rules','Start simple with one pair and timeframe','Backtest before risking real money','Paper trading reveals execution issues','Track everything in a journal'],
  true
);

-- =====================================================
-- PHASE 2: TECHNICAL ANALYSIS (Modules 7-12)
-- =====================================================

-- MODULE 7: Trend Analysis
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Trend Analysis',
  'trend-analysis',
  'Identify and trade with the prevailing trend.',
  'Technical Analysis', 2, 7, 6, false, 350,
  'An uptrend has higher highs and higher lows. A downtrend has lower highs and lower lows. Sideways markets have roughly equal highs and lows. The trend is your friend - most money is made trading with the trend. Trendlines connect the lows in an uptrend or highs in a downtrend. Channel trading uses parallel trendlines. Breakouts of trendlines signal trend changes. Always know: are we in an uptrend, downtrend, or ranging market?',
  ARRAY['Uptrend: higher highs and higher lows','Downtrend: lower highs and lower lows','Trade with the trend for highest probability','Trendlines identify support and resistance'],
  true
);

-- MODULE 8: Support and Resistance
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Support and Resistance',
  'support-resistance',
  'Find the price levels where markets turn around.',
  'Technical Analysis', 2, 8, 6, false, 350,
  'Support is a price level where buyers step in, stopping downward movement. Resistance is where sellers step in, stopping upward movement. These levels are tested multiple times - each test either breaks the level or bounces. Psychological levels (round numbers like 1.1000) attract traders. Daily, weekly, and monthly S/R are stronger than hourly. A break of strong resistance becomes new support. Supply and demand zones matter more than exact lines.',
  ARRAY['Support and resistance are zones not lines','Multiple tests strengthen S/R levels','Psychological levels matter','Broken resistance becomes new support'],
  true
);

-- MODULE 9: Candlestick Patterns
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Candlestick Patterns',
  'candlestick-patterns',
  'Recognize reversal and continuation patterns in price action.',
  'Technical Analysis', 2, 9, 6, false, 350,
  'Pin bars have small bodies with long wicks - they show rejection of price. Engulfing candles have a large body engulfing the previous body - they show trend reversal. Dojis have equal opens and closes - indecision. Hammer patterns (small body, long lower wick) suggest bounces from support. Shooting stars (long upper wick) suggest rejection at resistance. Multiple patterns together are more reliable than single candles. Context matters - patterns at S/R levels are stronger.',
  ARRAY['Pin bars show price rejection','Engulfing candles signal reversals','Doji candles show indecision','Patterns at S/R are most reliable'],
  true
);

-- MODULE 10: Moving Averages
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Moving Averages',
  'moving-averages',
  'Use moving averages to identify trends and entry points.',
  'Technical Analysis', 2, 10, 5, false, 350,
  'A moving average smooths price by averaging the last N periods. Shorter MAs (20, 50) respond quickly to price changes. Longer MAs (200) show the primary trend. Price above MA = uptrend; price below MA = downtrend. MA crossovers generate signals: 50 crossing above 200 is bullish; 50 crossing below 200 is bearish. Double-top and double-bottom patterns often occur at key moving averages. EMA (exponential) reacts faster than SMA (simple).',
  ARRAY['Price above MA indicates uptrend','MA crossovers generate entry signals','200-MA shows primary trend','Shorter MAs react faster than longer MAs'],
  true
);

-- MODULE 11: Oscillators
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Oscillators',
  'oscillators',
  'Use RSI, MACD, and Stochastic to confirm signals.',
  'Technical Analysis', 2, 11, 6, false, 350,
  'RSI measures momentum on a 0-100 scale. Above 70 is overbought; below 30 is oversold. MACD shows momentum and trend changes through moving average convergence/divergence. Stochastic shows relative position of close within the period range. Divergence occurs when price makes a new high but the oscillator doesn''t - a reversal signal. These confirm trends but don''t trade alone. Use oscillators with price action, not instead of it.',
  ARRAY['RSI > 70 is overbought; < 30 is oversold','MACD crossovers signal momentum shifts','Divergence signals potential reversals','Never trade oscillators in isolation'],
  true
);

-- MODULE 12: Trading Volume
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Trading Volume',
  'trading-volume',
  'Confirm price moves with volume analysis.',
  'Technical Analysis', 2, 12, 5, false, 350,
  'Volume shows how many contracts were traded in each period. Rising volume confirms trends - breakouts with high volume are stronger. Falling volume warns of weak moves that may reverse. On-balance volume accumulates volume by direction. Climax volume (sudden spike) often precedes reversals. In trending markets, volume should increase in the direction of the trend and decrease during pullbacks. Divergence between price and volume warns of weakness.',
  ARRAY['High volume confirms breakouts','Falling volume warns of weak moves','Volume spikes often precede reversals','Divergence between price and volume is bearish'],
  true
);

-- =====================================================
-- ADD QUIZ QUESTIONS FOR MODULES 1-6
-- =====================================================

INSERT INTO quiz_questions (module_id, question_text, options, correct_answer_index, explanation, question_order)
VALUES
((SELECT id FROM modules WHERE slug = 'what-is-forex'), 'When does the Forex market trade?', '["9 AM - 5 PM EST","24/5 across Tokyo, London, and New York sessions","Only at night","Only on weekdays"]'::jsonb, 1, 'Forex trades 24/5 across three major sessions: Tokyo, London, and New York.', 1),
((SELECT id FROM modules WHERE slug = 'what-is-forex'), 'What is the most traded currency pair?', '["GBP/USD","EUR/USD","USD/JPY","AUD/USD"]'::jsonb, 1, 'EUR/USD is the most traded pair, accounting for the majority of forex volume.', 2),
((SELECT id FROM modules WHERE slug = 'reading-price-action'), 'What does support represent?', '["Where sellers congregate","Where buyers step in to stop downward movement","A technical indicator","A news event"]'::jsonb, 1, 'Support is a price level where buyers step in, stopping or bouncing from downward movement.', 1),
((SELECT id FROM modules WHERE slug = 'reading-price-action'), 'What does high volume on a breakout indicate?', '["Weakness","Strength and confirmation of the move","Indecision","That we should exit"]'::jsonb, 1, 'High volume on breakouts confirms the move is strong and likely to continue.', 2),
((SELECT id FROM modules WHERE slug = 'chart-types'), 'What do candlestick wicks represent?', '["Opening price","Closing price","The full high-low range for the period","Only failed moves"]'::jsonb, 2, 'Candlestick wicks show the full range of price (high and low) for the period.', 1),
((SELECT id FROM modules WHERE slug = 'chart-types'), 'Which timeframe is best for swing trading?', '["M5","H1","H4 or D1","M1"]'::jsonb, 2, 'H4 (4-hour) or D1 (daily) timeframes are best for swing trading.', 2),
((SELECT id FROM modules WHERE slug = 'fundamental-factors'), 'What is the primary driver of forex prices?', '["News headlines","Interest rates","Trading volume","Candlestick patterns"]'::jsonb, 1, 'Interest rates are the primary driver of forex - higher rates attract capital to a currency.', 1),
((SELECT id FROM modules WHERE slug = 'fundamental-factors'), 'What does "risk-on" sentiment favor?', '["Safe-haven currencies like USD","High-yielding, emerging market currencies","Central banks","Economic reports"]'::jsonb, 1, 'Risk-on sentiment favors higher-yielding currencies and emerging markets.', 2),
((SELECT id FROM modules WHERE slug = 'trading-psychology'), 'What is the biggest enemy in trading?', '["Lack of analysis","Emotion","The market","Bad luck"]'::jsonb, 1, 'Emotion (fear and greed) causes most trading losses and prevents consistent results.', 1),
((SELECT id FROM modules WHERE slug = 'trading-psychology'), 'Why is journaling important?', '["It makes you feel productive","It reveals patterns in your decision-making","It impresses other traders","To track news"]'::jsonb, 1, 'Journaling reveals patterns in your decision-making and helps identify what works and what doesn''t.', 2),
((SELECT id FROM modules WHERE slug = 'building-first-strategy'), 'How should you test a new strategy?', '["Trade it immediately with large size","Backtest on past data, then paper trade","Ask friends for advice","Use the most complex indicators"]'::jsonb, 1, 'Backtest on historical data first, then paper trade with real chart data before risking real money.', 1),
((SELECT id FROM modules WHERE slug = 'building-first-strategy'), 'What makes a strategy worth following?', '["Complex indicators","High win rate above 80%","Simplicity and consistency with your plan","High leverage"]'::jsonb, 2, 'A strategy worth following is one you''ll actually follow - simplicity beats complexity.', 2);

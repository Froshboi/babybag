-- Babybags seed: modules 10-12
-- Run this in the Supabase SQL Editor after the schema and modules 1-9.

-- MODULE 10: Chart Types & When to Use Them
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Chart Types & When to Use Them',
  'chart-types',
  'Compare line, bar, and candlestick charts, plus advanced types like Heikin-Ashi and Renko.',
  'Price & Charts', 2, 10, 5, false, 350,
  $module10$
## Choosing Your Visual Tool

Not all charts are created equal. Each type filters and presents price data differently. Knowing when to use each one gives you an edge in different market conditions.

### Line Charts
- **How it works**: Connects closing prices only.
- **Strengths**: Clean, simple, excellent for seeing the overall trend. Removes noise.
- **Weaknesses**: Hides volatility, open/high/low data, and intraperiod structure.
- **Best for**: Identifying macro trends, higher-timeframe direction, presentations.

### Bar Charts
- **How it works**: Each bar shows OHLC as vertical lines with horizontal ticks.
- **Strengths**: Shows full range and open/close relationships. Good for comparing period ranges.
- **Weaknesses**: Less intuitive than candlesticks for pattern recognition.
- **Best for**: Detailed range analysis, comparing volatility across sessions.

### Candlestick Charts
- **How it works**: OHLC represented as coloured bodies with wicks.
- **Strengths**: Most information at a glance. Excellent for pattern and sentiment analysis.
- **Weaknesses**: Can be visually overwhelming with many indicators.
- **Best for**: Entry/exit timing, reversal patterns, day-to-day trading.

### Heikin-Ashi
- **How it works**: Modified candlesticks that smooth price action using averaged open/close/high/low values.
- **Strengths**: Filters noise, makes trends easier to spot, reduces false signals.
- **Weaknesses**: Lags behind actual price. Not suitable for precise entries.
- **Best for**: Trend identification, staying in winning trades longer, filtering choppy markets.

### Renko
- **How it works**: Bricks of fixed size. A new brick only forms when price moves a set number of pips.
- **Strengths**: Completely filters time and noise. Only shows significant moves.
- **Weaknesses**: No time component. Can miss important intraday context.
- **Best for**: Long-term trend following, removing whipsaws, identifying strong support/resistance.

### Which Should You Master First?

**Candlesticks**. They are the universal language of trading. Every other chart type is a derivative or filter of candlestick data. Once you can read candles fluently, experiment with Heikin-Ashi for trend clarity and Renko for long-term positioning.

### Pro Tip: Multi-Chart Setup

Many professional traders use multiple chart types simultaneously:
- **Line chart on D1** for trend direction
- **Candlesticks on H1** for entries
- **Heikin-Ashi on H4** for holding decisions

This layered approach ensures you never lose sight of the bigger picture while executing with precision.
$module10$,
  ARRAY['Line charts are best for macro trend overview','Candlesticks are the universal standard for trading','Heikin-Ashi smooths noise but lags price','Renko filters time and shows only significant moves'],
  true
);

INSERT INTO quiz_questions (module_id, question_text, options, correct_answer_index, explanation, question_order)
VALUES
((SELECT id FROM modules WHERE slug = 'chart-types'), 'What is the main weakness of line charts?', '["They are too colourful","They hide volatility and OHLC data","They only work on daily timeframes","They are too complex"]'::jsonb, 1, 'Line charts only show closing prices, hiding the open, high, low, and intraperiod volatility.', 1),
((SELECT id FROM modules WHERE slug = 'chart-types'), 'What does Heikin-Ashi do differently from standard candles?', '["Shows more colours","Smooths price using averaged values","Only shows daily data","Removes all wicks"]'::jsonb, 1, 'Heikin-Ashi uses averaged OHLC values to create smoother, more readable trend candles.', 2),
((SELECT id FROM modules WHERE slug = 'chart-types'), 'When is a Renko chart most useful?', '["For scalping M1","For filtering noise and showing significant moves","For reading exact open/close prices","For news trading"]'::jsonb, 1, 'Renko charts only form new bricks after a set price move, filtering out minor fluctuations and time.', 3),
((SELECT id FROM modules WHERE slug = 'chart-types'), 'Which chart type should beginners master first?', '["Renko","Heikin-Ashi","Candlestick","Line"]'::jsonb, 2, 'Candlestick charts are the industry standard and provide the best balance of information and usability for beginners.', 4);

-- MODULE 11: What is Risk Management?
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'What is Risk Management?',
  'what-is-risk-management',
  'Understand why risk management is the #1 skill in trading and how to protect your capital.',
  'Risk & Position Sizing', 3, 11, 6, false, 350,
  $module11$
## The Only Thing That Matters

Risk management is not a chapter in your trading education -- it **is** your trading education. Every other skill is useless if you blow up your account. A trader with average analysis but excellent risk management will outperform a genius analyst with poor risk control every single time.

### The Mathematics of Survival

Consider two traders starting with $10,000:

**Trader A** risks 10% per trade. After 10 consecutive losses (which happens), their account is $3,486 -- a **65% drawdown**. To recover to $10,000, they need a **187% gain**.

**Trader B** risks 1% per trade. After 10 consecutive losses, their account is $9,044 -- a **9.6% drawdown**. To recover, they need just a **10.6% gain**.

The math is brutal and unforgiving. Large drawdowns create psychological damage, force revenge trading, and often lead to account destruction.

### What Risk Management Actually Means

1. **Position Sizing**: How much you risk per trade.
2. **Stop Loss**: The maximum loss you accept before exiting.
3. **Risk-to-Reward Ratio**: Ensuring your potential profit justifies your risk.
4. **Portfolio Heat**: Total risk across all open positions.
5. **Correlation Risk**: Avoiding multiple correlated pairs (e.g., EUR/USD and GBP/USD moving together).

### The Cardinal Rules

- **Never risk more than 1-2% per trade**.
- **Always use a stop loss** -- no exceptions.
- **Never move your stop loss further away** once set.
- **Risk less during high-volatility events** (NFP, CPI, central bank meetings).
- **Reduce size after a losing streak** -- not increase it.

### Risk is Not Just About Money

Risk management also includes:
- **Emotional risk**: Trading when angry, fearful, or euphoric.
- **Operational risk**: Platform failures, internet outages, broker issues.
- **Concentration risk**: Having all your capital with one broker or in one strategy.

Professional traders think about what can go wrong **before** they think about what can go right. This inversion of thinking separates survivors from casualties.
$module11$,
  ARRAY['Risk management is more important than analysis','A 50% drawdown requires a 100% gain to recover','Never risk more than 1-2% per trade','Always use a stop loss -- no exceptions'],
  true
);

INSERT INTO quiz_questions (module_id, question_text, options, correct_answer_index, explanation, question_order)
VALUES
((SELECT id FROM modules WHERE slug = 'what-is-risk-management'), 'Why is risk management considered the #1 trading skill?', '["It guarantees profits","It prevents account destruction and preserves capital","It is required by law","It makes charts easier to read"]'::jsonb, 1, 'Without risk management, even the best analysis leads to account blow-ups. Preservation of capital is priority one.', 1),
((SELECT id FROM modules WHERE slug = 'what-is-risk-management'), 'If you lose 50% of your account, what return do you need to break even?', '["50%","75%","100%","25%"]'::jsonb, 2, 'A 50% loss on $10,000 leaves $5,000. You need to double it (100% gain) to return to $10,000.', 2),
((SELECT id FROM modules WHERE slug = 'what-is-risk-management'), 'What is the maximum recommended risk per trade?', '["5%","10%","1-2%","25%"]'::jsonb, 2, 'Professional traders risk 1-2% per trade to survive losing streaks and maintain psychological stability.', 3),
((SELECT id FROM modules WHERE slug = 'what-is-risk-management'), 'What should you do after a losing streak?', '["Increase position size to recover faster","Reduce position size and review your strategy","Stop trading forever","Blame the broker"]'::jsonb, 1, 'Increasing size after losses (revenge trading) is the fastest path to account destruction. Reduce size and analyse.', 4);

-- MODULE 12: Position Sizing Fundamentals
INSERT INTO modules (title, slug, description, phase, phase_order, module_order, duration_minutes, is_free, cost_bb, content, key_takeaways, has_quiz)
VALUES (
  'Position Sizing Fundamentals',
  'position-sizing',
  'Learn how to calculate the exact lot size for every trade based on your account balance and stop loss distance.',
  'Risk & Position Sizing', 3, 12, 7, false, 350,
  $module12$
## The Math Behind Every Trade

Position sizing is the process of determining **how many units** of a currency pair to buy or sell. Get this wrong, and even a winning strategy becomes a losing one. Get it right, and you can survive the inevitable losing streaks.

### The Formula

**Position Size = Account Risk Amount / (Stop Loss in Pips x Pip Value)**

Where:
- **Account Risk Amount** = Account Balance x Risk % (e.g., $10,000 x 1% = $100)
- **Pip Value** depends on the pair and your account currency

### Pip Values Simplified

For a **standard lot (1.00)**:
- EUR/USD, GBP/USD: $10 per pip
- USD/JPY: ~$6.70 per pip (varies with exchange rate)
- USD/CHF: ~$11.30 per pip

For a **micro lot (0.01)**, divide by 100: $0.10 per pip on EUR/USD.

### Worked Example

Account: **$5,000**
Risk per trade: **1% = $50**
Pair: **EUR/USD**
Stop loss: **25 pips**
Pip value (micro lot): **$0.10**

Position size = $50 / (25 x $0.10) = $50 / $2.50 = **20 micro lots = 0.20**

You would trade **0.20 lots** on EUR/USD with a 25-pip stop to risk exactly 1%.

### Using a Position Size Calculator

Manual calculation is educational, but in live trading, use a calculator:
1. Input your account balance
2. Input your risk percentage
3. Input your stop loss in pips
4. The calculator outputs the exact lot size

Most brokers provide this tool, or you can use free online calculators. Never guess your position size.

### Common Mistakes

1. **Fixed Lot Size**: Trading 0.10 lots on every trade regardless of stop distance or account size. This means your risk varies wildly.
2. **Rounding Up**: Calculating 0.23 lots and rounding to 0.30 "to make it worthwhile." This increases risk by 30%.
3. **Ignoring Account Currency**: If your account is in NGN but you calculate in USD, your risk is wrong. Always use your account currency.

### The 1% Rule in Practice

With $1,000 and 1% risk:
- 20-pip stop -> 0.05 lots (5 micro lots)
- 50-pip stop -> 0.02 lots (2 micro lots)

Notice how a wider stop requires a smaller position. This is why tight stops (with valid technical reasons) allow larger positions -- but only if the stop is placed correctly, not arbitrarily tight.
$module12$,
  ARRAY['Position size = Risk Amount / (Stop Loss x Pip Value)','Always calculate size before entering a trade','Wider stops require smaller positions','Use a position size calculator -- never guess'],
  true
);

INSERT INTO quiz_questions (module_id, question_text, options, correct_answer_index, explanation, question_order)
VALUES
((SELECT id FROM modules WHERE slug = 'position-sizing'), 'What is the formula for position sizing?', '["Account balance / leverage","Risk amount / (stop loss x pip value)","Random lot selection","Maximum leverage available"]'::jsonb, 1, 'Position size is calculated by dividing your dollar risk amount by the dollar value of your stop loss distance.', 1),
((SELECT id FROM modules WHERE slug = 'position-sizing'), 'How much is 1 pip worth on 1 standard lot of EUR/USD?', '["$1","$10","$100","$0.10"]'::jsonb, 1, 'One standard lot (1.00) on EUR/USD is worth approximately $10 per pip.', 2),
((SELECT id FROM modules WHERE slug = 'position-sizing'), 'If your stop loss widens from 20 to 40 pips, what happens to position size?', '["It doubles","It halves","It stays the same","It quadruples"]'::jsonb, 1, 'Wider stops mean more risk per pip, so you must reduce position size to maintain the same percentage risk.', 3),
((SELECT id FROM modules WHERE slug = 'position-sizing'), 'Why should you not use a fixed lot size for every trade?', '["It is easier","It makes risk inconsistent","Brokers require it","It guarantees profits"]'::jsonb, 1, 'Fixed lot sizes mean your percentage risk changes with every trade depending on stop distance and account fluctuations.', 4);

-- Verify the three inserted modules and their quiz counts.
SELECT m.module_order, m.slug, COUNT(q.id) AS quiz_questions
FROM modules m
LEFT JOIN quiz_questions q ON q.module_id = m.id
WHERE m.slug IN ('chart-types', 'what-is-risk-management', 'position-sizing')
GROUP BY m.module_order, m.slug
ORDER BY m.module_order;

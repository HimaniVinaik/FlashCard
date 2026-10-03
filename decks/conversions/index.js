/* Common unit conversions deck.
 * Each line: front | front hint | back | back note   ("# " lines start a topic)
 * US / imperial units are on the front, metric (or the smaller unit) on the back.
 */
(function () {
  'use strict';
  const DATA = `
# Length & Distance
1 inch | in centimeters | 2.54 cm | Exact, by definition.
1 foot | in centimeters | 30.48 cm | About 0.3 m. 1 foot = 12 inches.
1 yard | in meters | ≈ 0.91 m | Exactly 0.9144 m. 1 yard = 3 feet.
1 mile | in kilometers | ≈ 1.6 km | More exactly 1.609 km. 1 km ≈ 0.62 miles.
1 mile | in feet | 5,280 feet | Also 1,760 yards.
1 foot | in inches | 12 inches |
1 yard | in feet | 3 feet | Also 36 inches.
1 nautical mile | in kilometers | 1.852 km | About 1.15 miles. Used at sea and in the air.
3.1 miles | in kilometers | ≈ 5 km | A 5K race.
6.2 miles | in kilometers | ≈ 10 km | A 10K race.
26.2 miles | in kilometers | ≈ 42.2 km | A marathon (42.195 km).
6 feet | in meters | ≈ 1.83 m |
5 feet 6 inches | in centimeters | ≈ 168 cm | 66 inches × 2.54.

# Weight
1 pound (lb) | in kilograms | ≈ 0.45 kg | 1 kg ≈ 2.2 lb.
1 ounce (oz) | in grams | ≈ 28 g | More exactly 28.35 g.
1 pound | in ounces | 16 oz |
1 stone | in pounds and kilograms | 14 lb ≈ 6.35 kg | Used in the UK for body weight.
1 US ton | in pounds and kilograms | 2,000 lb ≈ 907 kg | A metric tonne is 1,000 kg ≈ 2,205 lb.
100 lb | in kilograms | ≈ 45 kg |
150 lb | in kilograms | ≈ 68 kg |
1 gallon of water | weight | ≈ 8.34 lb ≈ 3.79 kg | 1 liter of water weighs 1 kg.

# Volume & Cooking
1 cup | in fluid ounces | 8 fl oz |
1 pint | in cups | 2 cups | 16 fl oz.
1 quart | in pints | 2 pints | Also 4 cups.
1 gallon | in quarts | 4 quarts | Also 8 pints, 16 cups or 128 fl oz.
1 gallon | in liters | ≈ 3.79 L | US gallon. A UK gallon is ≈ 4.55 L.
1 quart | in liters | ≈ 0.95 L | Just under a liter.
1 cup | in milliliters | ≈ 237 mL | Often rounded to 240 mL.
1 fluid ounce | in milliliters | ≈ 30 mL | More exactly 29.6 mL.
1 tablespoon | in teaspoons | 3 teaspoons | 1 tablespoon ≈ 15 mL.
1 teaspoon | in milliliters | ≈ 5 mL |
1 cup | in tablespoons | 16 tablespoons | ¼ cup = 4 tablespoons.
1 stick of butter | in cups and grams | ½ cup ≈ 113 g | Also 8 tablespoons.
1 cubic foot | in liters | ≈ 28.3 L |

# Temperature
32 °F | in Celsius | 0 °C | Water freezes.
212 °F | in Celsius | 100 °C | Water boils (at sea level).
98.6 °F | in Celsius | 37 °C | Normal body temperature.
100 °F | in Celsius | ≈ 38 °C | A fever.
68 °F | in Celsius | 20 °C | Comfortable room temperature.
350 °F | in Celsius | ≈ 175 °C | A common oven temperature (176.7 °C).
−40 °F | in Celsius | −40 °C | The one temperature that is the same on both scales.
°F to °C | formula | (°F − 32) × 5/9 | Quick estimate: subtract 30, then halve.
°C to °F | formula | °C × 9/5 + 32 | Quick estimate: double, then add 30.

# Area, Speed & Energy
1 acre | in square meters | ≈ 4,047 m² | About 0.4 hectares, or 43,560 square feet.
1 square mile | in square kilometers | ≈ 2.59 km² | Also 640 acres.
1 square foot | in square meters | ≈ 0.093 m² | 1 m² ≈ 10.8 square feet.
1 mph | in km/h | ≈ 1.6 km/h |
60 mph | in km/h | ≈ 97 km/h | 100 km/h ≈ 62 mph.
1 knot | in mph and km/h | ≈ 1.15 mph ≈ 1.85 km/h | One nautical mile per hour.
30 mpg | in metric | ≈ 12.8 km/L ≈ 7.8 L/100 km | 1 mpg ≈ 0.43 km/L.
1 horsepower | in watts | ≈ 746 W |
1 food Calorie (kcal) | in kilojoules | ≈ 4.2 kJ | Exactly 4.184 kJ.
`;

  const topics = [];
  const problems = [];
  DATA.split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith('# ')) { topics.push(line.slice(2).trim()); return; }
    const [front, hint, back, note] = line.split('|').map((x) => (x || '').trim());
    problems.push({ k: topics.length - 1, front, hint, back, note });
  });
  const side = (main, sub) => `**${main}**` + (sub ? `\n\n${sub}` : '');

  window.CONVERSIONS = {
    id: 'conversions',
    name: 'Conversions',
    topics,
    parts: [],
    problems,
    build: (p) => ({ front: side(p.front, p.hint), back: side(p.back, p.note) }),
  };
})();

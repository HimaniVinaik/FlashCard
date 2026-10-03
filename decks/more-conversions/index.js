/* More conversions deck: metric → US (the reverse of the Conversions deck),
 * metric basics, kitchen weights, everyday math, and paper & screen sizes.
 * Each line: front | front hint | back | back note   ("# " lines start a topic)
 */
(function () {
  'use strict';
  const DATA = `
# Length (Metric → US)
1 km | in miles | ≈ 0.62 miles | More exactly 0.621 miles. 1 mile ≈ 1.6 km.
5 km | in miles | ≈ 3.1 miles | A 5K race.
10 km | in miles | ≈ 6.2 miles | A 10K race.
100 km | in miles | ≈ 62 miles |
1 meter | in feet | ≈ 3.28 feet | Just over a yard.
1 meter | in inches | ≈ 39.4 inches |
1 cm | in inches | ≈ 0.39 inches | 1 inch = 2.54 cm.
1 mm | in inches | ≈ 0.04 inches | About 1/25 of an inch.
30 cm | in inches | ≈ 11.8 inches | Just under 1 foot.
170 cm | in feet and inches | ≈ 5 ft 7 in |
180 cm | in feet and inches | ≈ 5 ft 11 in |
400 m | in miles | ≈ 0.25 miles | One lap of a running track. A true quarter mile is 402 m.
1,500 m | in miles | ≈ 0.93 miles | Called "the metric mile".

# Weight (Metric → US)
1 kg | in pounds | ≈ 2.2 lb | More exactly 2.205 lb.
1 g | in ounces | ≈ 0.035 oz | 1 oz ≈ 28 g.
100 g | in ounces | ≈ 3.5 oz |
500 g | in pounds | ≈ 1.1 lb |
50 kg | in pounds | ≈ 110 lb |
70 kg | in pounds | ≈ 154 lb |
1 metric tonne | in pounds | ≈ 2,205 lb | About 1.1 US tons.

# Volume (Metric → US)
1 liter | in US gallons | ≈ 0.26 gallons | 1 gallon ≈ 3.79 liters.
1 liter | in US quarts | ≈ 1.06 quarts | Just over a quart.
1 liter | in fluid ounces | ≈ 33.8 fl oz |
1 liter | in cups | ≈ 4.2 cups |
2 liters | in fluid ounces | ≈ 67.6 fl oz | A big soda bottle.
750 mL | in fluid ounces | ≈ 25.4 fl oz | A standard wine bottle.
500 mL | in fluid ounces | ≈ 16.9 fl oz | A standard water bottle.
330 mL | in fluid ounces | ≈ 11.2 fl oz | A European soda can. A US can is 12 fl oz ≈ 355 mL.
250 mL | in cups | ≈ 1.06 cups | A metric cup.
100 mL | in fluid ounces | ≈ 3.4 fl oz | The airline carry-on limit for liquids.
15 mL | in tablespoons | ≈ 1 tablespoon |
5 mL | in teaspoons | ≈ 1 teaspoon |

# Temperature (°C → °F)
0 °C | in Fahrenheit | 32 °F | Water freezes.
10 °C | in Fahrenheit | 50 °F | Cool. Jacket weather.
20 °C | in Fahrenheit | 68 °F | Room temperature.
25 °C | in Fahrenheit | 77 °F | Warm.
30 °C | in Fahrenheit | 86 °F | A hot day.
37 °C | in Fahrenheit | 98.6 °F | Normal body temperature.
38 °C | in Fahrenheit | 100.4 °F | A fever.
100 °C | in Fahrenheit | 212 °F | Water boils (at sea level).
180 °C | in Fahrenheit | ≈ 356 °F | A common oven setting, usually treated as 350 °F.
200 °C | in Fahrenheit | ≈ 392 °F | Usually treated as 400 °F.
220 °C | in Fahrenheit | ≈ 428 °F | Usually treated as 425 °F.
−18 °C | in Fahrenheit | ≈ 0 °F | Freezer temperature.

# Speed, Area & Fuel
1 km/h | in mph | ≈ 0.62 mph |
50 km/h | in mph | ≈ 31 mph | A common city speed limit outside the US.
100 km/h | in mph | ≈ 62 mph |
120 km/h | in mph | ≈ 75 mph | A common highway speed limit in Europe.
1 m/s | in mph and km/h | ≈ 2.24 mph = 3.6 km/h |
1 hectare | in acres | ≈ 2.47 acres | 10,000 m².
1 m² | in square feet | ≈ 10.8 sq ft |
1 km² | in square miles | ≈ 0.39 sq mi | 100 hectares.
5 L/100 km | in mpg | ≈ 47 mpg | mpg ≈ 235 ÷ (L/100 km).
8 L/100 km | in mpg | ≈ 29 mpg | mpg ≈ 235 ÷ (L/100 km).

# Metric Basics
kilo- (k) | metric prefix | × 1,000 | 1 kilometer = 1,000 meters.
centi- (c) | metric prefix | × 1/100 | 1 meter = 100 centimeters.
milli- (m) | metric prefix | × 1/1,000 | 1 liter = 1,000 milliliters.
micro- (µ) | metric prefix | × 1/1,000,000 | One millionth.
mega- (M) | metric prefix | × 1,000,000 | One million.
giga- (G) | metric prefix | × 1,000,000,000 | One billion.
1 liter | in milliliters | 1,000 mL |
1 mL | in cubic centimeters | 1 cm³ | The same amount. Doctors often write "cc".
1 liter of water | weight | 1 kg | So 1 mL of water weighs 1 g.
1 kilogram | in grams | 1,000 g |
1 gram | in milligrams | 1,000 mg |
1 km | in meters | 1,000 m |
1 meter | in centimeters | 100 cm | Also 1,000 mm.
1 cm | in millimeters | 10 mm |
1 hectare | in square meters | 10,000 m² | A square 100 m on each side.

# Kitchen Weights
1 cup all-purpose flour | in grams | ≈ 120–125 g | Spooned and leveled.
1 cup granulated sugar | in grams | ≈ 200 g |
1 cup brown sugar | packed, in grams | ≈ 220 g |
1 cup butter | in grams | ≈ 227 g | Two sticks.
1 tablespoon butter | in grams | ≈ 14 g |
1 cup water | in grams | ≈ 237 g | 1 mL of water weighs 1 g.
1 cup milk | in grams | ≈ 245 g |
1 cup uncooked rice | in grams | ≈ 185 g | Long-grain white rice.
1 cup honey | in grams | ≈ 340 g |
1 large egg | without the shell | ≈ 50 g |

# Everyday Math
Hourly wage to yearly salary | full time | × 2,080 | 40 hours × 52 weeks. $20 an hour ≈ $41,600 a year.
Yearly salary to hourly wage | full time | ÷ 2,080 | Quick estimate: halve it and drop three zeros. $60,000 ≈ $30 an hour.
Monthly to yearly | | × 12 | $1,500 a month = $18,000 a year.
Percent to decimal | | ÷ 100 | 7.5% = 0.075.
1/8 | as a decimal | 0.125 |
3/8 | as a decimal | 0.375 |
5/8 | as a decimal | 0.625 |
7/8 | as a decimal | 0.875 |
1/3 | as a decimal | ≈ 0.333 |
2/3 | as a decimal | ≈ 0.667 |
1/6 | as a decimal | ≈ 0.167 |
15 minutes | in hours | 0.25 hours | Handy for timesheets.
20 minutes | in hours | ≈ 0.33 hours |
45 minutes | in hours | 0.75 hours |
90 minutes | in hours | 1.5 hours |
100 Mbps | internet speed, in MB/s | ≈ 12.5 MB/s | Divide by 8, because 1 byte = 8 bits.
1 TB | in GB | 1,000 GB |

# Paper & Screens
US Letter paper | size | 8.5 × 11 in (216 × 279 mm) |
US Legal paper | size | 8.5 × 14 in (216 × 356 mm) |
A4 paper | size | 210 × 297 mm (8.3 × 11.7 in) | The standard almost everywhere outside North America.
A 55-inch TV | in centimeters | ≈ 140 cm | Screen sizes are measured diagonally.
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

  window.MORE_CONVERSIONS = {
    id: 'more-conversions',
    name: 'More Conversions',
    topics,
    parts: [],
    problems,
    build: (p) => ({ front: side(p.front, p.hint), back: side(p.back, p.note) }),
  };
})();

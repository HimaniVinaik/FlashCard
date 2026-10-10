/* Geography deck: world capitals by continent (UN members + Vatican City),
 * US state capitals, landmarks, oceans/rivers/lakes, mountains/deserts, world facts.
 * Each line: front | front hint | back | back note   ("# " lines start a topic)
 */
(function () {
  'use strict';
  const DATA = `
# Capitals: Africa
Algeria | capital | Algiers |
Angola | capital | Luanda |
Benin | capital | Porto-Novo | Cotonou is the seat of government and largest city.
Botswana | capital | Gaborone |
Burkina Faso | capital | Ouagadougou |
Burundi | capital | Gitega | Capital since 2019. Bujumbura is the largest city.
Cabo Verde | capital | Praia |
Cameroon | capital | Yaoundé | Douala is the largest city.
Central African Republic | capital | Bangui |
Chad | capital | N'Djamena |
Comoros | capital | Moroni |
Republic of the Congo | capital | Brazzaville | Across the Congo River from Kinshasa.
Democratic Republic of the Congo | capital | Kinshasa |
Côte d'Ivoire (Ivory Coast) | capital | Yamoussoukro | Abidjan is the largest city and economic center.
Djibouti | capital | Djibouti |
Egypt | capital | Cairo | A New Administrative Capital is being built east of Cairo.
Equatorial Guinea | capital | Malabo | On Bioko Island.
Eritrea | capital | Asmara |
Eswatini | capital | Mbabane | Lobamba is the royal and legislative capital.
Ethiopia | capital | Addis Ababa | Headquarters of the African Union.
Gabon | capital | Libreville |
Gambia | capital | Banjul |
Ghana | capital | Accra |
Guinea | capital | Conakry |
Guinea-Bissau | capital | Bissau |
Kenya | capital | Nairobi |
Lesotho | capital | Maseru | Lesotho is completely surrounded by South Africa.
Liberia | capital | Monrovia | Named after US President James Monroe.
Libya | capital | Tripoli |
Madagascar | capital | Antananarivo |
Malawi | capital | Lilongwe |
Mali | capital | Bamako |
Mauritania | capital | Nouakchott |
Mauritius | capital | Port Louis |
Morocco | capital | Rabat | Casablanca is the largest city.
Mozambique | capital | Maputo |
Namibia | capital | Windhoek |
Niger | capital | Niamey |
Nigeria | capital | Abuja | Lagos is the largest city.
Rwanda | capital | Kigali |
São Tomé and Príncipe | capital | São Tomé |
Senegal | capital | Dakar |
Seychelles | capital | Victoria |
Sierra Leone | capital | Freetown |
Somalia | capital | Mogadishu |
South Africa | capitals (3) | Pretoria, Cape Town and Bloemfontein | Pretoria is executive, Cape Town legislative, Bloemfontein judicial.
South Sudan | capital | Juba | The world's newest country (2011).
Sudan | capital | Khartoum |
Tanzania | capital | Dodoma | Dar es Salaam is the largest city.
Togo | capital | Lomé |
Tunisia | capital | Tunis |
Uganda | capital | Kampala |
Zambia | capital | Lusaka |
Zimbabwe | capital | Harare |

# Capitals: Asia
Afghanistan | capital | Kabul |
Armenia | capital | Yerevan |
Azerbaijan | capital | Baku |
Bahrain | capital | Manama |
Bangladesh | capital | Dhaka |
Bhutan | capital | Thimphu |
Brunei | capital | Bandar Seri Begawan |
Cambodia | capital | Phnom Penh |
China | capital | Beijing | Shanghai is the largest city.
Cyprus | capital | Nicosia | An EU member, geographically in Asia.
Georgia (the country) | capital | Tbilisi |
India | capital | New Delhi |
Indonesia | capital | Jakarta | A new capital, Nusantara, is being built on Borneo.
Iran | capital | Tehran |
Iraq | capital | Baghdad |
Israel | capital | Jerusalem | Israel's proclaimed capital. Many countries keep their embassies in Tel Aviv.
Japan | capital | Tokyo |
Jordan | capital | Amman |
Kazakhstan | capital | Astana | Almaty is the largest city.
Kuwait | capital | Kuwait City |
Kyrgyzstan | capital | Bishkek |
Laos | capital | Vientiane |
Lebanon | capital | Beirut |
Malaysia | capital | Kuala Lumpur | The government is based in nearby Putrajaya.
Maldives | capital | Malé |
Mongolia | capital | Ulaanbaatar | The coldest national capital in the world.
Myanmar | capital | Naypyidaw | Yangon is the largest city and former capital.
Nepal | capital | Kathmandu |
North Korea | capital | Pyongyang |
Oman | capital | Muscat |
Pakistan | capital | Islamabad | Karachi is the largest city.
Philippines | capital | Manila |
Qatar | capital | Doha |
Saudi Arabia | capital | Riyadh |
Singapore | capital | Singapore | A city-state.
South Korea | capital | Seoul |
Sri Lanka | capital | Sri Jayawardenepura Kotte | Colombo is the largest city and commercial capital.
Syria | capital | Damascus | One of the oldest continuously inhabited cities.
Tajikistan | capital | Dushanbe |
Thailand | capital | Bangkok |
Timor-Leste (East Timor) | capital | Dili |
Turkey | capital | Ankara | Istanbul is the largest city.
Turkmenistan | capital | Ashgabat |
United Arab Emirates | capital | Abu Dhabi | Dubai is the largest city.
Uzbekistan | capital | Tashkent |
Vietnam | capital | Hanoi | Ho Chi Minh City is the largest city.
Yemen | capital | Sanaa |

# Capitals: Europe
Albania | capital | Tirana |
Andorra | capital | Andorra la Vella | The highest capital city in Europe.
Austria | capital | Vienna |
Belarus | capital | Minsk |
Belgium | capital | Brussels | Also home to the main EU institutions.
Bosnia and Herzegovina | capital | Sarajevo |
Bulgaria | capital | Sofia |
Croatia | capital | Zagreb |
Czechia (Czech Republic) | capital | Prague |
Denmark | capital | Copenhagen |
Estonia | capital | Tallinn |
Finland | capital | Helsinki |
France | capital | Paris |
Germany | capital | Berlin |
Greece | capital | Athens |
Hungary | capital | Budapest |
Iceland | capital | Reykjavík | The northernmost capital of a sovereign country.
Ireland | capital | Dublin |
Italy | capital | Rome |
Latvia | capital | Riga |
Liechtenstein | capital | Vaduz |
Lithuania | capital | Vilnius |
Luxembourg | capital | Luxembourg City |
Malta | capital | Valletta |
Moldova | capital | Chișinău |
Monaco | capital | Monaco | A city-state.
Montenegro | capital | Podgorica |
Netherlands | capital | Amsterdam | The government and parliament sit in The Hague.
North Macedonia | capital | Skopje |
Norway | capital | Oslo |
Poland | capital | Warsaw |
Portugal | capital | Lisbon |
Romania | capital | Bucharest |
Russia | capital | Moscow |
San Marino | capital | City of San Marino |
Serbia | capital | Belgrade |
Slovakia | capital | Bratislava |
Slovenia | capital | Ljubljana |
Spain | capital | Madrid |
Sweden | capital | Stockholm |
Switzerland | capital | Bern | Officially the "federal city". Zurich is the largest city.
Ukraine | capital | Kyiv |
United Kingdom | capital | London |
Vatican City | capital | Vatican City | The smallest country in the world.

# Capitals: North America
Antigua and Barbuda | capital | St. John's |
Bahamas | capital | Nassau |
Barbados | capital | Bridgetown |
Belize | capital | Belmopan |
Canada | capital | Ottawa | Toronto is the largest city.
Costa Rica | capital | San José |
Cuba | capital | Havana |
Dominica | capital | Roseau |
Dominican Republic | capital | Santo Domingo |
El Salvador | capital | San Salvador |
Grenada | capital | St. George's |
Guatemala | capital | Guatemala City |
Haiti | capital | Port-au-Prince |
Honduras | capital | Tegucigalpa |
Jamaica | capital | Kingston |
Mexico | capital | Mexico City |
Nicaragua | capital | Managua |
Panama | capital | Panama City |
Saint Kitts and Nevis | capital | Basseterre |
Saint Lucia | capital | Castries |
Saint Vincent and the Grenadines | capital | Kingstown |
Trinidad and Tobago | capital | Port of Spain |
United States | capital | Washington, D.C. | New York City is the largest city.

# Capitals: South America
Argentina | capital | Buenos Aires |
Bolivia | capitals (2) | Sucre and La Paz | Sucre is the constitutional capital. La Paz is the seat of government.
Brazil | capital | Brasília | A planned city, capital since 1960. São Paulo is the largest city.
Chile | capital | Santiago |
Colombia | capital | Bogotá |
Ecuador | capital | Quito |
Guyana | capital | Georgetown |
Paraguay | capital | Asunción |
Peru | capital | Lima |
Suriname | capital | Paramaribo |
Uruguay | capital | Montevideo |
Venezuela | capital | Caracas |

# Capitals: Oceania
Australia | capital | Canberra | Sydney is the largest city.
Fiji | capital | Suva |
Kiribati | capital | South Tarawa |
Marshall Islands | capital | Majuro |
Micronesia (Federated States) | capital | Palikir |
Nauru | capital | Yaren (no official capital) | The government offices are in Yaren District.
New Zealand | capital | Wellington | Auckland is the largest city.
Palau | capital | Ngerulmud |
Papua New Guinea | capital | Port Moresby |
Samoa | capital | Apia |
Solomon Islands | capital | Honiara |
Tonga | capital | Nukuʻalofa |
Tuvalu | capital | Funafuti |
Vanuatu | capital | Port Vila |

# US State Capitals
Alabama | state capital | Montgomery |
Alaska | state capital | Juneau | Reachable only by air or sea.
Arizona | state capital | Phoenix |
Arkansas | state capital | Little Rock |
California | state capital | Sacramento |
Colorado | state capital | Denver |
Connecticut | state capital | Hartford |
Delaware | state capital | Dover |
Florida | state capital | Tallahassee |
Georgia (US state) | state capital | Atlanta |
Hawaii | state capital | Honolulu |
Idaho | state capital | Boise |
Illinois | state capital | Springfield | Not Chicago.
Indiana | state capital | Indianapolis |
Iowa | state capital | Des Moines |
Kansas | state capital | Topeka |
Kentucky | state capital | Frankfort |
Louisiana | state capital | Baton Rouge |
Maine | state capital | Augusta |
Maryland | state capital | Annapolis |
Massachusetts | state capital | Boston |
Michigan | state capital | Lansing | Not Detroit.
Minnesota | state capital | Saint Paul |
Mississippi | state capital | Jackson |
Missouri | state capital | Jefferson City |
Montana | state capital | Helena |
Nebraska | state capital | Lincoln |
Nevada | state capital | Carson City | Not Las Vegas.
New Hampshire | state capital | Concord |
New Jersey | state capital | Trenton |
New Mexico | state capital | Santa Fe | The oldest state capital city, founded around 1610.
New York | state capital | Albany | Not New York City.
North Carolina | state capital | Raleigh |
North Dakota | state capital | Bismarck |
Ohio | state capital | Columbus |
Oklahoma | state capital | Oklahoma City |
Oregon | state capital | Salem |
Pennsylvania | state capital | Harrisburg | Not Philadelphia.
Rhode Island | state capital | Providence |
South Carolina | state capital | Columbia |
South Dakota | state capital | Pierre |
Tennessee | state capital | Nashville |
Texas | state capital | Austin |
Utah | state capital | Salt Lake City |
Vermont | state capital | Montpelier | The least populous state capital.
Virginia | state capital | Richmond |
Washington | state capital | Olympia | Not Seattle.
West Virginia | state capital | Charleston |
Wisconsin | state capital | Madison |
Wyoming | state capital | Cheyenne |

# Landmarks
Eiffel Tower | where? | Paris, France | Built for the 1889 World's Fair.
Statue of Liberty | where? | New York City, USA | A gift from France, dedicated in 1886.
Great Wall of China | where? | Northern China | Built and rebuilt over about 2,000 years.
Taj Mahal | where? | Agra, India | A marble tomb built by Shah Jahan for his wife Mumtaz Mahal.
Colosseum | where? | Rome, Italy | A Roman amphitheater completed in 80 AD.
Machu Picchu | where? | Andes Mountains, Peru | A 15th-century Inca citadel.
Christ the Redeemer | where? | Rio de Janeiro, Brazil | On Corcovado mountain, completed in 1931.
Petra | where? | Jordan | An ancient city carved into rose-red rock by the Nabataeans.
Chichén Itzá | where? | Yucatán Peninsula, Mexico | A Maya city famous for the El Castillo pyramid.
Great Pyramid of Giza | where? | Giza, Egypt (near Cairo) | The only one of the Seven Wonders of the Ancient World still standing.
Stonehenge | where? | Wiltshire, England | A prehistoric stone circle, about 5,000 years old.
Sydney Opera House | where? | Sydney, Australia | Opened in 1973, designed by Jørn Utzon.
Big Ben | where? | London, England | The great bell in the clock tower of the Houses of Parliament.
Leaning Tower of Pisa | where? | Pisa, Italy | A bell tower that began to tilt during construction.
Parthenon | where? | Athens, Greece | A temple to Athena on the Acropolis, 5th century BC.
Sagrada Família | where? | Barcelona, Spain | Antoni Gaudí's basilica, under construction since 1882.
Angkor Wat | where? | Siem Reap, Cambodia | The largest religious monument in the world.
Burj Khalifa | where? | Dubai, United Arab Emirates | The world's tallest building, 828 m.
Mount Rushmore | where? | South Dakota, USA | Faces of Washington, Jefferson, Theodore Roosevelt and Lincoln.
Golden Gate Bridge | where? | San Francisco, USA | Opened in 1937.
Red Square and the Kremlin | where? | Moscow, Russia |
Forbidden City | where? | Beijing, China | The imperial palace of the Ming and Qing dynasties.
Neuschwanstein Castle | where? | Bavaria, Germany | It inspired Disney's Sleeping Beauty Castle.
Brandenburg Gate | where? | Berlin, Germany |
Louvre Museum | where? | Paris, France | The world's most-visited art museum, home of the Mona Lisa.
Alhambra | where? | Granada, Spain | A Moorish palace and fortress.
Hagia Sophia | where? | Istanbul, Turkey | Built as a cathedral in 537 AD.
Mont-Saint-Michel | where? | Normandy, France | An abbey on a tidal island.
Moai statues | where? | Easter Island (Rapa Nui), Chile |
Borobudur | where? | Java, Indonesia | The world's largest Buddhist temple.
Mount Fuji | where? | Honshu, Japan | Japan's tallest mountain, 3,776 m.
Tower Bridge | where? | London, England | Often mistaken for London Bridge.
CN Tower | where? | Toronto, Canada |
Niagara Falls | where? | US–Canada border (New York and Ontario) |
Grand Canyon | where? | Arizona, USA | Carved by the Colorado River.
Victoria Falls | where? | Zambia–Zimbabwe border | On the Zambezi River.
Uluru (Ayers Rock) | where? | Northern Territory, Australia | A huge sandstone rock sacred to the Aṉangu people.
Great Barrier Reef | where? | Off Queensland, Australia | The world's largest coral reef system.
Mount Kilimanjaro | where? | Tanzania | Africa's tallest mountain, 5,895 m.
Table Mountain | where? | Cape Town, South Africa |
Sistine Chapel | where? | Vatican City | Its ceiling was painted by Michelangelo.
Notre-Dame Cathedral | where? | Paris, France | Reopened in December 2024 after the 2019 fire.
Golden Temple | where? | Amritsar, India | The holiest site of Sikhism.
Galápagos Islands | where? | Ecuador | Their wildlife inspired Charles Darwin.
Iguazu Falls | where? | Argentina–Brazil border |
Yellowstone National Park | where? | Mostly Wyoming, USA | The world's first national park (1872).
Banff National Park | where? | Alberta, Canada | In the Canadian Rockies.
Space Needle | where? | Seattle, USA | Built for the 1962 World's Fair.
Hollywood Sign | where? | Los Angeles, USA |
Santorini | where? | Greece | A volcanic island in the Aegean Sea.

# Oceans, Rivers & Lakes
Largest ocean | | Pacific Ocean | Bigger than all of Earth's land put together.
Second-largest ocean | | Atlantic Ocean |
Smallest ocean | | Arctic Ocean |
Ocean around Antarctica | | Southern Ocean |
Indian Ocean | borders which continents? | Africa, Asia and Australia |
Deepest point in the ocean | | Challenger Deep, Mariana Trench | About 10,900 m (35,800 ft) deep, in the western Pacific.
Longest river in the world | | Nile, ≈ 6,650 km | Some measurements make the Amazon slightly longer.
Largest river by volume | | Amazon | It carries about a fifth of all the river water that reaches the oceans.
Amazon River | flows mainly through | Brazil | It starts in the Andes of Peru.
Longest river in the US | | Missouri River | It joins the Mississippi near St. Louis.
Mississippi River | flows into | Gulf of Mexico | Called the Gulf of America by the US government since 2025.
Longest river in Asia | | Yangtze, ≈ 6,300 km | In China.
Longest river in Europe | | Volga | In Russia. It flows into the Caspian Sea.
Danube | flows through how many countries? | 10 | From Germany to the Black Sea, past Vienna, Bratislava, Budapest and Belgrade.
Thames | flows through which capital? | London |
Seine | flows through which capital? | Paris |
Ganges | flows through | India and Bangladesh | Sacred in Hinduism.
Mekong | flows through | China, Myanmar, Laos, Thailand, Cambodia and Vietnam |
Rhine | flows into | North Sea | Through the Netherlands.
Zambezi | famous waterfall | Victoria Falls |
Tallest waterfall | | Angel Falls, Venezuela | About 979 m.
Largest lake by area | | Caspian Sea | A lake despite its name, bordered by 5 countries.
Largest freshwater lake by area | | Lake Superior | The largest of the Great Lakes.
Deepest lake | | Lake Baikal, Russia | About 1,642 m deep. It holds about 20% of the world's unfrozen surface fresh water.
Great Lakes | names | Superior, Michigan, Huron, Erie, Ontario | Memory trick: HOMES.
Largest lake in Africa | | Lake Victoria | Shared by Uganda, Kenya and Tanzania. The White Nile starts here.
Lake Titicaca | where? | Peru–Bolivia border | One of the highest navigable lakes, at about 3,812 m.
Dead Sea | known for | The lowest point on land | About 430 m below sea level, and so salty you float.
Red Sea | lies between | Africa and the Arabian Peninsula |
Black Sea | bordered by | Turkey, Bulgaria, Romania, Ukraine, Russia and Georgia |
Suez Canal | connects | Mediterranean Sea and Red Sea | In Egypt, opened in 1869.
Panama Canal | connects | Atlantic and Pacific Oceans | Opened in 1914.
Strait of Gibraltar | separates | Spain (Europe) and Morocco (Africa) | It links the Mediterranean to the Atlantic.
Bosphorus | divides | Istanbul, between Europe and Asia | It connects the Black Sea to the Sea of Marmara.
English Channel | separates | England and France | The Channel Tunnel runs under it.
Strait of Hormuz | connects | Persian Gulf and Gulf of Oman | A key route for oil tankers.
Bering Strait | separates | Russia and Alaska |
Strait of Malacca | lies between | Malaysia and Sumatra (Indonesia) | One of the world's busiest shipping lanes.
Drake Passage | lies between | South America and Antarctica | Known for some of the roughest seas on Earth.
Gulf Stream | what is it? | A warm Atlantic current | It flows from the Gulf of Mexico toward Europe and keeps Western Europe milder.

# Mountains & Deserts
Tallest mountain | above sea level | Mount Everest, 8,849 m | On the Nepal–China (Tibet) border.
Second-tallest mountain | | K2, 8,611 m | On the Pakistan–China border.
Tallest mountain in North America | | Denali, 6,190 m | In Alaska.
Tallest mountain in South America | | Aconcagua, 6,961 m | In Argentina. The tallest outside Asia.
Tallest mountain in Africa | | Kilimanjaro, 5,895 m | In Tanzania.
Tallest mountain in Europe | | Mount Elbrus, 5,642 m | In Russia's Caucasus. Mont Blanc (4,806 m) is the tallest in the Alps.
Tallest mountain in Antarctica | | Vinson Massif, 4,892 m |
Tallest mountain in Oceania | | Puncak Jaya, 4,884 m | In Indonesia's Papua province. Mainland Australia's tallest is Mount Kosciuszko (2,228 m).
Tallest mountain from base to peak | | Mauna Kea, Hawaii | About 10,200 m from its base on the sea floor.
Longest mountain range on land | | Andes | About 7,000 km along western South America.
Himalayas | countries | Nepal, India, Bhutan, China and Pakistan |
Alps | countries | France, Switzerland, Italy, Austria, Germany, Slovenia, Liechtenstein and Monaco |
Rocky Mountains | run from | British Columbia (Canada) to New Mexico (US) |
Ural Mountains | divide | Europe and Asia | In Russia.
Mount Vesuvius | where? | Near Naples, Italy | Its eruption in 79 AD buried Pompeii.
Ring of Fire | what is it? | A belt of volcanoes and earthquakes around the Pacific | Home to about 75% of the world's active volcanoes.
Largest desert | | Antarctica | A cold desert. The largest hot desert is the Sahara.
Largest hot desert | | Sahara | About the size of the United States, across North Africa.
Gobi Desert | where? | Mongolia and northern China |
Atacama Desert | where? | Chile | One of the driest places on Earth.
Kalahari Desert | where? | Botswana, Namibia and South Africa |
Arabian Desert | where? | The Arabian Peninsula | Includes the Rub' al Khali (Empty Quarter).
Mojave Desert | where? | Southwestern US | Includes Death Valley and Las Vegas.
Death Valley | known for | Hottest temperature ever recorded: 56.7 °C (134 °F) | Measured in 1913. Also the lowest point in North America (−86 m).

# Countries & World Facts
Largest country by area | | Russia | About 17.1 million km², spanning 11 time zones.
Second-largest country by area | | Canada |
Smallest country | | Vatican City | About 0.44 km².
Most populous country | | India | It passed China in 2023.
Largest island | | Greenland | An autonomous territory of Denmark.
Largest country in Africa | | Algeria |
Largest country in South America | | Brazil |
Landlocked countries in South America | | Bolivia and Paraguay |
Countries bordering the most others | | China and Russia, 14 each |
Country with the most time zones | | France, 12 | Thanks to its overseas territories.
Largest continent | | Asia | By both area and population.
Smallest continent | | Australia | Also a country.
Continents by size | largest to smallest | Asia, Africa, North America, South America, Antarctica, Europe, Australia |
Countries of the United Kingdom | | England, Scotland, Wales and Northern Ireland |
Scandinavia | countries | Denmark, Norway and Sweden | The Nordic countries also include Finland and Iceland.
Benelux | countries | Belgium, Netherlands and Luxembourg |
Number of countries in the world | | 195 | 193 UN members, plus the two observer states, Vatican City and Palestine.
Prime Meridian | passes through | Greenwich, London | 0° longitude.
International Date Line | where? | Roughly 180° longitude, in the Pacific |
Tropic of Cancer | latitude | ≈ 23.4° N | The Tropic of Capricorn is ≈ 23.4° S.
Equator | latitude | 0° | It divides Earth into the Northern and Southern Hemispheres.
Largest US state by area | | Alaska | More than twice the size of Texas.
Smallest US state by area | | Rhode Island |
Most populous US state | | California |
Washington, D.C. | is it a state? | No | A federal district. "D.C." stands for District of Columbia.
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

  window.GEOGRAPHY = {
    id: 'geography',
    name: 'Geography',
    topics,
    parts: [],
    problems,
    key: (p) => `${p.k}:${p.front}`,
    build: (p) => ({ front: side(p.front, p.hint), back: side(p.back, p.note) }),
  };
})();

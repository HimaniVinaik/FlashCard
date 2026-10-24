/* Japanese travel phrases deck.
 * Each line: english | front hint | romaji | japanese | note   ("# " lines start a topic)
 * English is on the front (you need to say the Japanese). The back shows the
 * romaji to read aloud, the Japanese script to show someone, and a tip.
 * In the Etiquette topic the "romaji" field holds the answer in English and
 * the Japanese field is empty.
 */
(function () {
  'use strict';
  const DATA = `
# Basics & Politeness
Hello | | Konnichiwa | こんにちは | Use during the day.
Good morning | | Ohayō gozaimasu | おはようございます |
Good evening | | Konbanwa | こんばんは |
Thank you | | Arigatō gozaimasu | ありがとうございます | The polite form. Use it everywhere.
Thanks (quick, casual) | | Dōmo | どうも | Fine for small things, like taking change.
Excuse me / Sorry | to get attention or apologize | Sumimasen | すみません | The most useful word in Japan: call staff, squeeze past people, or apologize.
I'm sorry | a personal apology | Gomen nasai | ごめんなさい |
Yes | | Hai | はい | Also means "I'm listening."
No | | Iie | いいえ | A softer refusal is "Chotto…" (a bit…), often said with a small wave.
Please (asking for something) | | Onegaishimasu | お願いします | Put it after a thing: "Mizu, onegaishimasu" = Water, please.
Please, go ahead | offering | Dōzo | どうぞ |
Nice to meet you | | Hajimemashite | はじめまして |
I'm ___ (my name) | | Watashi wa ___ desu | 私は＿＿です |
Goodbye | | Sayōnara | さようなら | Friends say "Ja mata" (じゃまた), see you later.
Do you speak English? | | Eigo o hanasemasu ka? | 英語を話せますか？ |
I don't speak Japanese | | Nihongo ga hanasemasen | 日本語が話せません |
I don't understand | | Wakarimasen | わかりません |
I understand / Got it | | Wakarimashita | わかりました |
Once more, please | | Mō ichido onegaishimasu | もう一度お願いします |
Please speak slowly | | Yukkuri hanashite kudasai | ゆっくり話してください |
Could you write it down? | | Kaite moraemasu ka? | 書いてもらえますか？ | Then show the note to someone else or use a translation app.
It's OK / No thanks | | Daijōbu desu | 大丈夫です | Also a polite "no, thank you" (for a bag, a refill, and so on).
Just a moment, please | | Chotto matte kudasai | ちょっと待ってください |
Cheers! | | Kanpai! | 乾杯！ |
Before eating | what to say | Itadakimasu | いただきます | Like "Let's eat / Thank you for this food."
After eating | what to say | Gochisōsama deshita | ごちそうさまでした | Say it to the staff as you leave a restaurant.

# Help & Emergencies
Help! | | Tasukete! | 助けて！ |
Please call the police | | Keisatsu o yonde kudasai | 警察を呼んでください |
Please call an ambulance | | Kyūkyūsha o yonde kudasai | 救急車を呼んでください |
Police emergency number in Japan | | 110 (hyaku-tō-ban) | 110番 |
Ambulance and fire number in Japan | | 119 | 119番 |
Japan Visitor Hotline | 24/7 help in English | 050-3816-2787 | 訪日外国人向けコールセンター | Run by the Japan National Tourism Organization. From abroad: +81-50-3816-2787.
Where is the police box? | | Kōban wa doko desu ka? | 交番はどこですか？ | Small neighborhood police posts. Officers also help with directions and lost items.
I'm lost | | Michi ni mayoimashita | 道に迷いました |
I lost my passport | | Pasupōto o nakushimashita | パスポートをなくしました |
I lost my wallet | | Saifu o nakushimashita | 財布をなくしました | Lost items are very often returned in Japan. Ask at a kōban.
Can you help me? | | Tetsudatte moraemasu ka? | 手伝ってもらえますか？ |
I feel sick | | Guai ga warui desu | 具合が悪いです |
I need a doctor | | Isha ga hitsuyō desu | 医者が必要です |
Where is the hospital? | | Byōin wa doko desu ka? | 病院はどこですか？ |
It hurts here | | Koko ga itai desu | ここが痛いです | Point to the spot.
I have an allergy | | Arerugī ga arimasu | アレルギーがあります |
Where is a pharmacy? | | Yakkyoku wa doko desu ka? | 薬局はどこですか？ | Drugstores (ドラッグストア, doraggusutoa) sell common medicines.
Earthquake | | Jishin | 地震 | Small quakes are common. Follow staff instructions and stay calm.

# Airport
Airport | | Kūkō | 空港 |
Where is the check-in counter? | | Chekkuin kauntā wa doko desu ka? | チェックインカウンターはどこですか？ |
Departures | sign | Shuppatsu | 出発 |
Arrivals | sign | Tōchaku | 到着 |
Passport | | Pasupōto | パスポート |
Boarding pass | | Tōjōken | 搭乗券 |
Where is gate 12? | | Jūni-ban gēto wa doko desu ka? | 12番ゲートはどこですか？ |
Immigration | sign | Nyūkoku shinsa | 入国審査 |
Customs | sign | Zeikan | 税関 |
It's for sightseeing | answer at immigration | Kankō desu | 観光です | The answer to "What is the purpose of your visit?"
I'm staying for 7 days | | Nanoka-kan taizai shimasu | 七日間滞在します |
Baggage claim | sign | Tenimotsu uketorijo | 手荷物受取所 |
I can't find my luggage | | Nimotsu ga mitsukarimasen | 荷物が見つかりません |
Window seat, please | | Madogawa no seki o onegaishimasu | 窓側の席をお願いします |
Aisle seat, please | | Tsūrogawa no seki o onegaishimasu | 通路側の席をお願いします |
Delayed | flight board | Chien | 遅延 |
Canceled | flight board | Kekkō | 欠航 | For trains, "suspended" is 運休 (unkyū).
Where is the train into the city? | | Shinai e iku densha wa doko desu ka? | 市内へ行く電車はどこですか？ |

# Taxis
Taxi | | Takushī | タクシー |
Where is the taxi stand? | | Takushī noriba wa doko desu ka? | タクシー乗り場はどこですか？ |
Please call a taxi | | Takushī o yonde kudasai | タクシーを呼んでください | Ask at your hotel's front desk.
To this address, please | show it on your phone | Kono jūsho made onegaishimasu | この住所までお願いします | Drivers use navigation, so showing the address works best.
To ___, please | | ___ made onegaishimasu | ＿＿までお願いします | Example: "Tōkyō-eki made onegaishimasu" = To Tokyo Station, please.
To the station, please | | Eki made onegaishimasu | 駅までお願いします |
To the airport, please | | Kūkō made onegaishimasu | 空港までお願いします |
To this hotel, please | | Kono hoteru made onegaishimasu | このホテルまでお願いします |
About how much will it be? | | Ikura gurai desu ka? | いくらぐらいですか？ |
How long will it take? | | Dono gurai kakarimasu ka? | どのぐらいかかりますか？ |
Please stop here | | Koko de tomete kudasai | ここで止めてください |
Please turn right | | Migi ni magatte kudasai | 右に曲がってください |
Please turn left | | Hidari ni magatte kudasai | 左に曲がってください |
Please go straight | | Massugu itte kudasai | まっすぐ行ってください |
Can I pay by card? | in a taxi | Kādo de haraemasu ka? | カードで払えますか？ |

# Trains & Getting Around
Train | | Densha | 電車 |
Station | | Eki | 駅 |
Subway | | Chikatetsu | 地下鉄 |
Bullet train | | Shinkansen | 新幹線 |
Bus | | Basu | バス |
Bus stop | | Basu-tei | バス停 |
Ticket | | Kippu | 切符 |
Ticket gate | | Kaisatsu | 改札 |
Platform | | Hōmu | ホーム | Platforms are numbered: 3番線 (san-ban sen) = Track 3.
Exit | sign | Deguchi | 出口 |
Entrance | sign | Iriguchi | 入口 |
Transfer | changing trains | Norikae | 乗り換え |
Does this train go to Kyoto? | | Kono densha wa Kyōto ni ikimasu ka? | この電車は京都に行きますか？ |
Which platform for Osaka? | | Ōsaka-iki wa nan-ban sen desu ka? | 大阪行きは何番線ですか？ |
One ticket to Osaka, please | | Ōsaka made ichi-mai onegaishimasu | 大阪まで一枚お願いします |
Next station | | Tsugi no eki | 次の駅 |
Last train | | Shūden | 終電 | Often around midnight. Plan ahead!
Reserved seat / Non-reserved seat | on the shinkansen | Shiteiseki / Jiyūseki | 指定席 ／ 自由席 |
IC card | Suica, PASMO, ICOCA | Ai-shī kādo | ICカード | Tap-to-pay cards for trains, buses, vending machines and convenience stores.

# Directions
Where is ___? | | ___ wa doko desu ka? | ＿＿はどこですか？ | The single most useful question.
Where is the toilet? | | Toire wa doko desu ka? | トイレはどこですか？ |
Where is the station? | | Eki wa doko desu ka? | 駅はどこですか？ |
Where is the nearest convenience store? | | Ichiban chikai konbini wa doko desu ka? | 一番近いコンビニはどこですか？ |
How do I get to ___? | | ___ e wa dō ikeba ii desu ka? | ＿＿へはどう行けばいいですか？ |
Is it close? | | Chikai desu ka? | 近いですか？ |
Is it far? | | Tōi desu ka? | 遠いですか？ |
Can I walk there? | | Aruite ikemasu ka? | 歩いて行けますか？ |
Could you show me on the map? | | Chizu de oshiete moraemasu ka? | 地図で教えてもらえますか？ |
Right | | Migi | 右 |
Left | | Hidari | 左 |
Straight ahead | | Massugu | まっすぐ |
Here | | Koko | ここ |
There / Over there | | Soko / Asoko | そこ ／ あそこ | Soko = near you. Asoko = over there, away from both of us.
North / South / East / West | | Kita / Minami / Higashi / Nishi | 北 ／ 南 ／ 東 ／ 西 | Big stations have exits like 東口 (Higashi-guchi, East Exit).
Corner | | Kado | 角 |
Traffic light | | Shingō | 信号 |

# Hotel
I have a reservation | | Yoyaku shite imasu | 予約しています |
I have a reservation under ___ | | ___ de yoyaku shite imasu | ＿＿で予約しています |
Check-in, please | | Chekkuin onegaishimasu | チェックインお願いします |
Check-out, please | | Chekkuauto onegaishimasu | チェックアウトお願いします |
What time is check-out? | | Chekkuauto wa nan-ji desu ka? | チェックアウトは何時ですか？ |
Can you keep my luggage? | | Nimotsu o azukatte moraemasu ka? | 荷物を預かってもらえますか？ | Most hotels hold bags before check-in and after check-out.
Key | | Kagi | 鍵 |
Room | | Heya | 部屋 |
What's the Wi-Fi password? | | Wai-fai no pasuwādo wa nan desu ka? | Wi-Fiのパスワードは何ですか？ |
Is breakfast included? | | Chōshoku wa tsuite imasu ka? | 朝食は付いていますか？ |
The air conditioner doesn't work | | Eakon ga ugokimasen | エアコンが動きません |
Towel | | Taoru | タオル |
Hot spring / Public bath | | Onsen / Sentō | 温泉 ／ 銭湯 | Wash and rinse before getting in. No swimsuits.

# Restaurants & Ordering
Welcome! | what staff call out | Irasshaimase! | いらっしゃいませ！ | No reply needed. A nod or smile is fine.
How many people? | what staff ask | Nan-mei-sama desu ka? | 何名様ですか？ | Answer with fingers, or "Futari desu" (two people).
Just one person | | Hitori desu | 一人です |
Two people | | Futari desu | 二人です |
Three people | | San-nin desu | 三人です |
Excuse me! | calling the server | Sumimasen! | すみません！ | Calling out is normal. Many tables also have a call button.
Menu, please | | Menyū o onegaishimasu | メニューをお願いします |
Do you have an English menu? | | Eigo no menyū wa arimasu ka? | 英語のメニューはありますか？ |
What do you recommend? | | Osusume wa nan desu ka? | おすすめは何ですか？ |
This one, please | pointing | Kore o kudasai | これをください | Point at the menu or the plastic food display in the window.
Water, please | | Mizu o kudasai | 水をください | Water or tea is usually free.
Beer, please | | Bīru o kudasai | ビールをください |
One more, please | | Mō hitotsu onegaishimasu | もう一つお願いします |
A refill, please | | Okawari onegaishimasu | おかわりお願いします | Rice, drinks and noodle "kaedama" refills are sometimes free.
I can't eat meat | | Niku ga taberaremasen | 肉が食べられません |
I can't eat pork | | Butaniku ga taberaremasen | 豚肉が食べられません |
I'm vegetarian | | Bejitarian desu | ベジタリアンです | Many dishes use fish stock (dashi), so ask.
I have a shellfish allergy | | Kōkakurui no arerugī ga arimasu | 甲殻類のアレルギーがあります | Shrimp = ebi (えび), crab = kani (かに).
Does this have ___ in it? | | ___ wa haitte imasu ka? | ＿＿は入っていますか？ |
Not spicy, please | | Karaku shinaide kudasai | 辛くしないでください |
Delicious! | | Oishii! | おいしい！ |
The check, please | | Okaikei onegaishimasu | お会計お願いします | You usually pay at the register near the door, not at the table.
Can we pay separately? | | Betsubetsu ni haraemasu ka? | 別々に払えますか？ |
Takeout | | Mochikaeri | 持ち帰り | Staff may ask "Kochira de omeshiagari desu ka?" (Eating here?).
For here | | Koko de tabemasu | ここで食べます |
How long is the wait? | | Dono gurai machimasu ka? | どのぐらい待ちますか？ |
Non-smoking seat | | Kin'en-seki | 禁煙席 |

# Food Words
Rice (cooked) | | Gohan | ご飯 |
Noodles | | Men | 麺 | Ramen, soba (buckwheat) and udon (thick wheat).
Chicken | | Toriniku | 鶏肉 |
Beef | | Gyūniku | 牛肉 |
Pork | | Butaniku | 豚肉 |
Fish | | Sakana | 魚 |
Egg | | Tamago | 卵 |
Vegetables | | Yasai | 野菜 |
Water | | Mizu | 水 |
Green tea | | Ocha | お茶 |
Chopsticks | | Hashi | 箸 |
Fork / Spoon | | Fōku / Supūn | フォーク ／ スプーン |

# Shopping & Money
How much is this? | | Kore wa ikura desu ka? | これはいくらですか？ |
Can I use a credit card? | in a shop | Kurejitto kādo wa tsukaemasu ka? | クレジットカードは使えますか？ |
Cash only | sign | Genkin nomi | 現金のみ | Carry some cash. Small places may not take cards.
Where is an ATM? | | Ētīemu wa doko desu ka? | ATMはどこですか？ | Convenience-store ATMs, like 7-Eleven, usually accept foreign cards.
I'm just looking | | Miteru dake desu | 見てるだけです |
Do you have a bigger size? | | Motto ōkii saizu wa arimasu ka? | もっと大きいサイズはありますか？ |
Do you have a smaller size? | | Motto chiisai saizu wa arimasu ka? | もっと小さいサイズはありますか？ |
Can I try it on? | | Shichaku shite mo ii desu ka? | 試着してもいいですか？ |
I'll take this | | Kore ni shimasu | これにします |
I don't need a bag | | Fukuro wa irimasen | 袋はいりません | Bags usually cost a few yen.
Do you need a bag? | what the cashier asks | Fukuro wa goriyō desu ka? | 袋はご利用ですか？ |
Shall I heat it up? | what the cashier asks | Atatamemasu ka? | 温めますか？ | For convenience-store food. Answer "Hai, onegaishimasu" or "Daijōbu desu."
Tax-free | sign | Menzei | 免税 | Tourists can shop tax-free at stores with this sign. Bring your passport.
Receipt | | Reshīto / Ryōshūsho | レシート ／ 領収書 |
Discount | | Waribiki | 割引 |
Yen | | En | 円 | 1,000円 = sen en.
Convenience store | | Konbini | コンビニ | 7-Eleven, FamilyMart, Lawson: food, ATMs, tickets and more.
Expensive | | Takai | 高い |
Cheap | | Yasui | 安い |

# Numbers & Counting
1 | | Ichi | 一 |
2 | | Ni | 二 |
3 | | San | 三 |
4 | | Yon | 四 | Also "shi", but yon is preferred because shi sounds like "death".
5 | | Go | 五 |
6 | | Roku | 六 |
7 | | Nana | 七 | Also "shichi".
8 | | Hachi | 八 |
9 | | Kyū | 九 |
10 | | Jū | 十 |
100 | | Hyaku | 百 |
1,000 | | Sen | 千 |
10,000 | | Ichi-man | 一万 | Big prices are counted in man: 30,000円 = san-man en.
One (thing) | counting objects | Hitotsu | 一つ | Use it to order: "Hitotsu kudasai" = One, please.
Two (things) | counting objects | Futatsu | 二つ |
Three (things) | counting objects | Mittsu | 三つ |
How many? | | Ikutsu? | いくつ？ |

# Time & Days
What time is it? | | Ima nan-ji desu ka? | 今何時ですか？ |
___ o'clock | | ___-ji | ＿＿時 | 3 o'clock = san-ji. Half past = han: san-ji han = 3:30.
Now | | Ima | 今 |
Today | | Kyō | 今日 |
Tomorrow | | Ashita | 明日 |
Yesterday | | Kinō | 昨日 |
Morning | | Asa | 朝 |
Night | | Yoru | 夜 |
What time does it open? | | Nan-ji ni akimasu ka? | 何時に開きますか？ |
What time does it close? | | Nan-ji ni shimarimasu ka? | 何時に閉まりますか？ |
Open (for business) | sign | Eigyōchū | 営業中 |
Closed for now | sign | Junbichū | 準備中 | Literally "preparing". Often seen between lunch and dinner.

# Signs & Useful Words
Toilet | | Toire | トイレ | Also お手洗い (otearai).
Men | sign | Otoko / Dansei | 男 ／ 男性 | On toilet and bath doors, often in blue.
Women | sign | Onna / Josei | 女 ／ 女性 | On toilet and bath doors, often in red.
Push | sign | Osu | 押 |
Pull | sign | Hiku | 引 |
No smoking | sign | Kin'en | 禁煙 |
Smoking area | sign | Kitsuenjo | 喫煙所 | Smoking on the street is banned in many city areas.
Danger | sign | Kiken | 危険 |
No entry | sign | Tachiiri kinshi | 立入禁止 |
Emergency exit | sign | Hijōguchi | 非常口 |
Free of charge | sign | Muryō | 無料 |
Sold out | sign | Urikire | 売り切れ |
Information desk | sign | Annaijo | 案内所 |

# Etiquette
Should I tip? | in Japan | No | Tipping isn't customary and can confuse people. Good service is already included.
Shoes indoors? | homes, ryokan, temples | Take them off at the entrance | Use the slippers provided. Separate toilet slippers stay in the toilet.
Eating while walking? | | Usually avoid it | Eat by the shop or on a bench. Festivals and food stalls are fine.
Phone calls on trains? | | Avoid them | Keep your phone on silent ("manner mode") and talk quietly.
Escalators in Tokyo | which side to stand? | Stand on the left | In Osaka, people stand on the right.
Trash cans | | They're rare, so carry your trash | Convenience stores often have bins.
Paying at a shop | | Put the money on the small tray | Most shops have a tray by the register for cash.
Chopsticks | what not to do | Don't stand them upright in rice or pass food chopstick to chopstick | Both are linked to funerals.
Tattoos at onsen | | Many baths don't allow them | Look for tattoo-friendly baths or book a private bath.
Train platforms | | Line up in the marked lines | Let passengers off first.
Bowing | | A small bow or nod is a polite hello and thank you | No need to overdo it as a visitor.
`;

  const topics = [];
  const problems = [];
  DATA.split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith('# ')) { topics.push(line.slice(2).trim()); return; }
    const [en, hint, romaji, ja, note] = line.split('|').map((x) => (x || '').trim());
    problems.push({ k: topics.length - 1, en, hint, romaji, ja, note });
  });

  window.JAPANESE = {
    id: 'japanese',
    name: 'Japanese',
    version: 1,
    topics,
    parts: [],
    problems,
    key: (p) => `${p.k}:${p.en}`,
    build: (p) => ({
      front: `**${p.en}**` + (p.hint ? `\n\n${p.hint}` : ''),
      back: [`**${p.romaji}**`, p.ja, p.note].filter(Boolean).join('\n\n'),
    }),
  };
})();

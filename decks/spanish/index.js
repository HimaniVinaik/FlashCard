/* Spanish beginner vocabulary deck (about Duolingo units 1–16).
 * Each line: spanish | spanish example sentence | english | english sentence
 * Lines starting with "# " start a new topic.
 * Nouns include their article (el / la) so you learn the gender too.
 */
(function () {
  'use strict';
  const DATA = `
# Basics & Greetings
hola | Hola, me llamo Ana. | hello | Hello, my name is Ana.
adiós | Adiós, hasta mañana. | goodbye | Goodbye, see you tomorrow.
buenos días | Buenos días, señor García. | good morning | Good morning, Mr. García.
buenas tardes | Buenas tardes, ¿cómo está usted? | good afternoon | Good afternoon, how are you?
buenas noches | Buenas noches, mamá. | good night | Good night, Mom.
por favor | Un café, por favor. | please | A coffee, please.
gracias | Muchas gracias por la comida. | thank you | Thank you very much for the food.
de nada | —Gracias. —De nada. | you're welcome | "Thanks." "You're welcome."
perdón | Perdón, no entiendo. | sorry / excuse me | Excuse me, I don't understand.
lo siento | Lo siento, llego tarde. | I'm sorry | I'm sorry, I'm late.
sí | Sí, soy estudiante. | yes | Yes, I am a student.
no | No, no tengo hambre. | no / not | No, I'm not hungry.
¿cómo estás? | Hola, Pedro, ¿cómo estás? | how are you? | Hi, Pedro, how are you?
bien | Estoy bien, gracias. | well / fine | I'm fine, thanks.
mal | Hoy me siento mal. | badly / unwell | Today I feel unwell.
más o menos | —¿Qué tal? —Más o menos. | so-so | "How's it going?" "So-so."
mucho gusto | Mucho gusto, soy Carlos. | nice to meet you | Nice to meet you, I'm Carlos.
encantado | Encantado de conocerte. | pleased (to meet you) | Pleased to meet you.
hasta luego | Hasta luego, amigos. | see you later | See you later, friends.
hasta mañana | Hasta mañana en la escuela. | see you tomorrow | See you tomorrow at school.
me llamo | Me llamo Lucía. | my name is | My name is Lucía.
¿qué tal? | ¿Qué tal tu día? | how's it going? | How's your day going?
bienvenido | Bienvenido a mi casa. | welcome | Welcome to my house.
claro | Claro, te ayudo. | of course | Of course, I'll help you.
vale | Vale, nos vemos a las ocho. | okay | Okay, see you at eight.

# People & Family
la persona | Ella es una persona muy simpática. | the person | She is a very nice person.
el hombre | El hombre lee el periódico. | the man | The man reads the newspaper.
la mujer | La mujer trabaja en un hospital. | the woman | The woman works in a hospital.
el niño | El niño juega en el parque. | the boy / the child | The boy plays in the park.
la niña | La niña tiene cinco años. | the girl | The girl is five years old.
el chico | El chico es alto. | the boy / the guy | The boy is tall.
la chica | La chica habla inglés. | the girl | The girl speaks English.
el bebé | El bebé duerme mucho. | the baby | The baby sleeps a lot.
la familia | Mi familia es grande. | the family | My family is big.
la madre | Mi madre cocina muy bien. | the mother | My mother cooks very well.
el padre | Mi padre trabaja en una oficina. | the father | My father works in an office.
los padres | Mis padres viven en Madrid. | the parents | My parents live in Madrid.
el hermano | Mi hermano tiene diez años. | the brother | My brother is ten years old.
la hermana | Mi hermana estudia medicina. | the sister | My sister studies medicine.
el hijo | Su hijo se llama Mateo. | the son | Her son's name is Mateo.
la hija | Tienen una hija pequeña. | the daughter | They have a little daughter.
el abuelo | Mi abuelo tiene ochenta años. | the grandfather | My grandfather is eighty years old.
la abuela | La abuela hace pasteles. | the grandmother | Grandma makes cakes.
el tío | Mi tío vive en México. | the uncle | My uncle lives in Mexico.
la tía | Mi tía es profesora. | the aunt | My aunt is a teacher.
el primo | Mi primo juega al fútbol. | the cousin (male) | My cousin plays soccer.
el esposo | Su esposo es médico. | the husband | Her husband is a doctor.
la esposa | Mi esposa habla francés. | the wife | My wife speaks French.
el amigo | Él es mi mejor amigo. | the friend (male) | He is my best friend.
la amiga | Voy al cine con mi amiga. | the friend (female) | I'm going to the movies with my friend.
el novio | Su novio es de Colombia. | the boyfriend | Her boyfriend is from Colombia.
la novia | Mi novia es muy inteligente. | the girlfriend | My girlfriend is very smart.
el vecino | El vecino tiene un perro. | the neighbor | The neighbor has a dog.

# Food
la comida | La comida está deliciosa. | the food / the meal | The food is delicious.
el pan | Compro pan todos los días. | the bread | I buy bread every day.
la manzana | Como una manzana roja. | the apple | I eat a red apple.
la naranja | La naranja es dulce. | the orange (fruit) | The orange is sweet.
el plátano | El niño come un plátano. | the banana | The boy eats a banana.
la fresa | Me gustan las fresas. | the strawberry | I like strawberries.
la fruta | La fruta es buena para la salud. | the fruit | Fruit is good for your health.
la verdura | Comemos verduras con el pollo. | the vegetable | We eat vegetables with the chicken.
el tomate | La ensalada tiene tomate. | the tomato | The salad has tomato.
la papa | Quiero papas fritas. | the potato | I want French fries.
la cebolla | No me gusta la cebolla. | the onion | I don't like onion.
la ensalada | Ella come una ensalada. | the salad | She eats a salad.
el arroz | El arroz con pollo es mi plato favorito. | the rice | Chicken with rice is my favorite dish.
el pollo | El pollo está en el horno. | the chicken | The chicken is in the oven.
la carne | Él no come carne. | the meat | He doesn't eat meat.
el pescado | Comemos pescado los viernes. | the fish (food) | We eat fish on Fridays.
el huevo | Quiero dos huevos, por favor. | the egg | I want two eggs, please.
el queso | El queso es de España. | the cheese | The cheese is from Spain.
la mantequilla | Pongo mantequilla en el pan. | the butter | I put butter on the bread.
el azúcar | ¿Tomas el café con azúcar? | the sugar | Do you take your coffee with sugar?
la sal | La sopa necesita sal. | the salt | The soup needs salt.
la sopa | La sopa está caliente. | the soup | The soup is hot.
el sándwich | Mi hijo come un sándwich de jamón. | the sandwich | My son eats a ham sandwich.
el jamón | El jamón español es famoso. | the ham | Spanish ham is famous.
el pastel | El pastel de chocolate es para ti. | the cake | The chocolate cake is for you.
el chocolate | Me encanta el chocolate. | the chocolate | I love chocolate.
el helado | Los niños quieren helado. | the ice cream | The children want ice cream.
el desayuno | El desayuno es a las ocho. | the breakfast | Breakfast is at eight.
el almuerzo | El almuerzo está listo. | the lunch | Lunch is ready.
la cena | Preparo la cena para mi familia. | the dinner | I make dinner for my family.

# Drinks & Restaurant
el agua | Quiero un vaso de agua. | the water | I want a glass of water.
la leche | El gato bebe leche. | the milk | The cat drinks milk.
el café | Tomo café por la mañana. | the coffee | I drink coffee in the morning.
el té | Ella prefiere el té verde. | the tea | She prefers green tea.
el jugo | Un jugo de naranja, por favor. | the juice | An orange juice, please.
la cerveza | Él bebe una cerveza fría. | the beer | He drinks a cold beer.
el vino | El vino tinto es de Chile. | the wine | The red wine is from Chile.
el restaurante | Cenamos en un restaurante italiano. | the restaurant | We have dinner at an Italian restaurant.
el mesero | El mesero trae el menú. | the waiter | The waiter brings the menu.
el menú | ¿Me puede dar el menú? | the menu | Can you give me the menu?
la cuenta | La cuenta, por favor. | the check / the bill | The check, please.
la mesa | Hay una mesa para dos. | the table | There is a table for two.
el plato | El plato está sucio. | the plate / the dish | The plate is dirty.
el vaso | El vaso está vacío. | the glass | The glass is empty.
la taza | Una taza de té, por favor. | the cup | A cup of tea, please.
el tenedor | Necesito un tenedor. | the fork | I need a fork.
el cuchillo | El cuchillo está en la mesa. | the knife | The knife is on the table.
la cuchara | Como la sopa con una cuchara. | the spoon | I eat the soup with a spoon.
la botella | Una botella de agua cuesta un euro. | the bottle | A bottle of water costs one euro.
la propina | Dejamos una propina para el mesero. | the tip | We leave a tip for the waiter.

# Animals
el animal | Mi animal favorito es el caballo. | the animal | My favorite animal is the horse.
el perro | El perro corre en el parque. | the dog | The dog runs in the park.
el gato | El gato duerme en la cama. | the cat | The cat sleeps on the bed.
el pájaro | El pájaro canta por la mañana. | the bird | The bird sings in the morning.
el pez | El pez nada en el agua. | the fish (animal) | The fish swims in the water.
el caballo | El caballo es muy rápido. | the horse | The horse is very fast.
la vaca | La vaca da leche. | the cow | The cow gives milk.
el cerdo | El cerdo come mucho. | the pig | The pig eats a lot.
la gallina | La gallina pone huevos. | the hen | The hen lays eggs.
el ratón | El gato persigue al ratón. | the mouse | The cat chases the mouse.
el oso | El oso vive en el bosque. | the bear | The bear lives in the forest.
el león | El león es el rey de la selva. | the lion | The lion is the king of the jungle.
el elefante | El elefante es muy grande. | the elephant | The elephant is very big.
el mono | El mono come plátanos. | the monkey | The monkey eats bananas.
la tortuga | La tortuga camina despacio. | the turtle | The turtle walks slowly.
el conejo | El conejo es blanco. | the rabbit | The rabbit is white.
la serpiente | No me gustan las serpientes. | the snake | I don't like snakes.
el pato | El pato nada en el lago. | the duck | The duck swims in the lake.
la oveja | La oveja está en el campo. | the sheep | The sheep is in the field.
el insecto | Hay un insecto en mi sopa. | the insect | There is an insect in my soup.

# Colors
el color | ¿Cuál es tu color favorito? | the color | What is your favorite color?
rojo | Tengo una mochila roja. | red | I have a red backpack.
azul | El cielo es azul. | blue | The sky is blue.
verde | La hierba es verde. | green | The grass is green.
amarillo | El sol es amarillo. | yellow | The sun is yellow.
negro | Mi gato es negro. | black | My cat is black.
blanco | La nieve es blanca. | white | The snow is white.
gris | El cielo está gris hoy. | gray | The sky is gray today.
marrón | Ella tiene los ojos marrones. | brown | She has brown eyes.
naranja | La camiseta naranja es nueva. | orange (color) | The orange T-shirt is new.
rosa | La flor es rosa. | pink | The flower is pink.
morado | Me gusta el vestido morado. | purple | I like the purple dress.

# Numbers
uno | Solo quiero uno. | one | I only want one.
dos | Tengo dos perros. | two | I have two dogs.
tres | Hay tres libros en la mesa. | three | There are three books on the table.
cuatro | La mesa tiene cuatro patas. | four | The table has four legs.
cinco | Trabajo cinco días a la semana. | five | I work five days a week.
seis | Me levanto a las seis. | six | I get up at six.
siete | La semana tiene siete días. | seven | The week has seven days.
ocho | La clase empieza a las ocho. | eight | Class starts at eight.
nueve | Mi hermana tiene nueve años. | nine | My sister is nine years old.
diez | El libro cuesta diez dólares. | ten | The book costs ten dollars.
once | Somos once en el equipo. | eleven | There are eleven of us on the team.
doce | Compro doce huevos. | twelve | I buy twelve eggs.
quince | Llego en quince minutos. | fifteen | I'll arrive in fifteen minutes.
veinte | Tengo veinte años. | twenty | I am twenty years old.
treinta | El mes tiene treinta días. | thirty | The month has thirty days.
cuarenta | Mi padre tiene cuarenta años. | forty | My father is forty years old.
cincuenta | Hay cincuenta estudiantes. | fifty | There are fifty students.
cien | Corro cien metros. | one hundred | I run one hundred meters.
mil | La bicicleta cuesta mil pesos. | one thousand | The bicycle costs one thousand pesos.
el número | ¿Cuál es tu número de teléfono? | the number | What is your phone number?
primero | Él es el primero en llegar. | first | He is the first to arrive.
segundo | Vivo en el segundo piso. | second | I live on the second floor.
último | Es el último tren de la noche. | last | It's the last train of the night.
la mitad | Quiero la mitad de la pizza. | the half | I want half of the pizza.
cada | Voy al gimnasio cada día. | each / every | I go to the gym every day.

# Time, Days & Months
la hora | ¿Qué hora es? | the hour / the time | What time is it?
el minuto | Espera un minuto. | the minute | Wait a minute.
el día | Hoy es un buen día. | the day | Today is a good day.
la semana | Voy a la playa la próxima semana. | the week | I'm going to the beach next week.
el mes | Este mes tengo vacaciones. | the month | This month I have vacation.
el año | El año tiene doce meses. | the year | The year has twelve months.
hoy | Hoy es lunes. | today | Today is Monday.
mañana | Mañana voy al médico. | tomorrow | Tomorrow I'm going to the doctor.
ayer | Ayer comí paella. | yesterday | Yesterday I ate paella.
la mañana | Estudio por la mañana. | the morning | I study in the morning.
la tarde | Juego al tenis por la tarde. | the afternoon | I play tennis in the afternoon.
la noche | Leo un libro por la noche. | the night | I read a book at night.
ahora | Ahora estoy en casa. | now | Now I'm at home.
el fin de semana | ¿Qué haces el fin de semana? | the weekend | What do you do on the weekend?
lunes | El lunes trabajo. | Monday | On Monday I work.
martes | Tengo clase el martes. | Tuesday | I have class on Tuesday.
miércoles | El miércoles voy al gimnasio. | Wednesday | On Wednesday I go to the gym.
jueves | El jueves cenamos con mis padres. | Thursday | On Thursday we have dinner with my parents.
viernes | El viernes vamos al cine. | Friday | On Friday we go to the movies.
sábado | El sábado no trabajo. | Saturday | On Saturday I don't work.
domingo | El domingo descanso. | Sunday | On Sunday I rest.
enero | Hace frío en enero. | January | It's cold in January.
febrero | Mi cumpleaños es en febrero. | February | My birthday is in February.
marzo | La primavera empieza en marzo. | March | Spring starts in March.
abril | Llueve mucho en abril. | April | It rains a lot in April.
mayo | Vamos a México en mayo. | May | We're going to Mexico in May.
junio | Las clases terminan en junio. | June | Classes end in June.
julio | En julio hace mucho calor. | July | In July it's very hot.
agosto | Vamos a la playa en agosto. | August | We go to the beach in August.
septiembre | La escuela empieza en septiembre. | September | School starts in September.
octubre | Su boda es en octubre. | October | Their wedding is in October.
noviembre | Noviembre es un mes tranquilo. | November | November is a quiet month.
diciembre | Celebramos la Navidad en diciembre. | December | We celebrate Christmas in December.
el cumpleaños | Hoy es mi cumpleaños. | the birthday | Today is my birthday.
temprano | Me levanto temprano. | early | I get up early.
tarde | Siempre llega tarde. | late | He always arrives late.

# Home
la casa | Mi casa es pequeña. | the house / home | My house is small.
el apartamento | Vivo en un apartamento. | the apartment | I live in an apartment.
la habitación | Mi habitación es azul. | the room / the bedroom | My room is blue.
la cocina | Mi padre está en la cocina. | the kitchen | My father is in the kitchen.
el baño | ¿Dónde está el baño? | the bathroom | Where is the bathroom?
la sala | Vemos la tele en la sala. | the living room | We watch TV in the living room.
el jardín | Hay flores en el jardín. | the garden / the yard | There are flowers in the garden.
la puerta | Cierra la puerta, por favor. | the door | Close the door, please.
la ventana | Abro la ventana. | the window | I open the window.
la cama | La cama es muy cómoda. | the bed | The bed is very comfortable.
la silla | La silla está al lado de la mesa. | the chair | The chair is next to the table.
el sofá | El perro duerme en el sofá. | the sofa | The dog sleeps on the sofa.
la lámpara | La lámpara no funciona. | the lamp | The lamp doesn't work.
el espejo | Me miro en el espejo. | the mirror | I look at myself in the mirror.
la llave | No encuentro mis llaves. | the key | I can't find my keys.
el refrigerador | La leche está en el refrigerador. | the refrigerator | The milk is in the refrigerator.
la televisión | Mi abuela ve la televisión. | the television | My grandmother watches television.
el teléfono | Mi teléfono está en la mesa. | the phone | My phone is on the table.
la computadora | Uso la computadora para trabajar. | the computer | I use the computer for work.
el piso | El piso está limpio. | the floor | The floor is clean.
la pared | Hay un cuadro en la pared. | the wall | There is a painting on the wall.
la ducha | Me doy una ducha cada mañana. | the shower | I take a shower every morning.
la basura | Saco la basura por la noche. | the trash | I take out the trash at night.
el techo | El techo es muy alto. | the ceiling / the roof | The ceiling is very high.
la escalera | La escalera es muy larga. | the stairs | The staircase is very long.

# Clothing
la ropa | Mi ropa está en el armario. | the clothes | My clothes are in the closet.
la camisa | Él lleva una camisa blanca. | the shirt | He is wearing a white shirt.
la camiseta | Esta camiseta es nueva. | the T-shirt | This T-shirt is new.
los pantalones | Necesito pantalones nuevos. | the pants | I need new pants.
el vestido | Ella lleva un vestido rojo. | the dress | She is wearing a red dress.
la falda | La falda es corta. | the skirt | The skirt is short.
los zapatos | Mis zapatos son negros. | the shoes | My shoes are black.
el sombrero | El sombrero es grande. | the hat | The hat is big.
el abrigo | Hace frío; lleva tu abrigo. | the coat | It's cold; wear your coat.
la chaqueta | Mi chaqueta es de cuero. | the jacket | My jacket is leather.
los calcetines | Busco mis calcetines. | the socks | I'm looking for my socks.
el suéter | Este suéter es de lana. | the sweater | This sweater is wool.
la bolsa | La bolsa es de mi madre. | the bag | The bag is my mother's.
los lentes | No veo sin mis lentes. | the glasses | I can't see without my glasses.
el reloj | Mi reloj es nuevo. | the watch / the clock | My watch is new.
llevar | Siempre llevo jeans. | to wear / to carry | I always wear jeans.
la gorra | La gorra es azul. | the cap | The cap is blue.
la bufanda | Mi abuela me hizo una bufanda. | the scarf | My grandmother made me a scarf.

# Body & Health
el cuerpo | El cuerpo necesita agua. | the body | The body needs water.
la cabeza | Me duele la cabeza. | the head | My head hurts.
el pelo | Ella tiene el pelo largo. | the hair | She has long hair.
la cara | Lávate la cara. | the face | Wash your face.
el ojo | Tiene los ojos verdes. | the eye | He has green eyes.
la nariz | El perro tiene la nariz negra. | the nose | The dog has a black nose.
la boca | Abre la boca, por favor. | the mouth | Open your mouth, please.
el diente | Me lavo los dientes. | the tooth | I brush my teeth.
la oreja | El conejo tiene orejas largas. | the ear | The rabbit has long ears.
la mano | Levanta la mano. | the hand | Raise your hand.
el brazo | Me duele el brazo. | the arm | My arm hurts.
la pierna | Tengo las piernas cansadas. | the leg | My legs are tired.
el pie | Voy a pie al trabajo. | the foot | I go to work on foot.
el dedo | Me corté el dedo. | the finger | I cut my finger.
el estómago | Me duele el estómago. | the stomach | My stomach hurts.
el corazón | El corazón es un músculo. | the heart | The heart is a muscle.
el médico | Necesito ir al médico. | the doctor | I need to go to the doctor.
el hospital | Mi tía trabaja en el hospital. | the hospital | My aunt works at the hospital.
enfermo | Mi hijo está enfermo. | sick | My son is sick.
la medicina | Toma la medicina después de comer. | the medicine | Take the medicine after eating.

# City & Places
la ciudad | Madrid es una ciudad grande. | the city | Madrid is a big city.
el pueblo | Mis abuelos viven en un pueblo. | the town / the village | My grandparents live in a village.
la calle | La calle es muy tranquila. | the street | The street is very quiet.
el parque | Los niños juegan en el parque. | the park | The children play in the park.
la tienda | La tienda abre a las nueve. | the store | The store opens at nine.
el supermercado | Compro fruta en el supermercado. | the supermarket | I buy fruit at the supermarket.
el mercado | El mercado tiene frutas frescas. | the market | The market has fresh fruit.
el banco | El banco está cerrado hoy. | the bank | The bank is closed today.
la iglesia | La iglesia es muy antigua. | the church | The church is very old.
el museo | Visitamos el museo de arte. | the museum | We visit the art museum.
la biblioteca | Estudio en la biblioteca. | the library | I study at the library.
el cine | Vamos al cine esta noche. | the movie theater | We're going to the movies tonight.
la plaza | Nos vemos en la plaza. | the square | See you in the square.
el centro | Trabajo en el centro de la ciudad. | the center / downtown | I work downtown.
el edificio | El edificio tiene diez pisos. | the building | The building has ten floors.
el puente | El puente es muy largo. | the bridge | The bridge is very long.
la farmacia | La farmacia está en la esquina. | the pharmacy | The pharmacy is on the corner.
la esquina | Hay un café en la esquina. | the corner | There is a café on the corner.
el correo | Voy al correo para enviar una carta. | the post office / the mail | I'm going to the post office to send a letter.
la oficina | Mi oficina está en el centro. | the office | My office is downtown.
el hotel | El hotel está cerca de la playa. | the hotel | The hotel is near the beach.
la playa | Me gusta caminar en la playa. | the beach | I like walking on the beach.
el país | España es un país bonito. | the country | Spain is a beautiful country.
el barrio | Mi barrio es muy seguro. | the neighborhood | My neighborhood is very safe.
la policía | La policía está aquí. | the police | The police are here.

# Travel & Transport
el viaje | El viaje a Perú fue increíble. | the trip | The trip to Peru was incredible.
viajar | Me gusta viajar en tren. | to travel | I like to travel by train.
el coche | Mi coche es viejo. | the car | My car is old.
el autobús | Tomo el autobús a las siete. | the bus | I take the bus at seven.
el tren | El tren sale a las diez. | the train | The train leaves at ten.
el avión | El avión llega a Lima. | the airplane | The plane arrives in Lima.
la bicicleta | Voy a la escuela en bicicleta. | the bicycle | I go to school by bike.
el taxi | Llamamos un taxi. | the taxi | We call a taxi.
el barco | El barco cruza el río. | the boat / the ship | The boat crosses the river.
el aeropuerto | El aeropuerto está lejos. | the airport | The airport is far away.
la estación | La estación de tren está cerca. | the station | The train station is nearby.
el boleto | Necesito un boleto para Sevilla. | the ticket | I need a ticket to Seville.
el pasaporte | No olvides tu pasaporte. | the passport | Don't forget your passport.
la maleta | Mi maleta es muy pesada. | the suitcase | My suitcase is very heavy.
las vacaciones | Estamos de vacaciones. | the vacation | We are on vacation.
el mapa | Miramos el mapa de la ciudad. | the map | We look at the map of the city.
la izquierda | Gira a la izquierda. | the left | Turn left.
la derecha | El baño está a la derecha. | the right | The bathroom is on the right.
derecho | Sigue derecho dos calles. | straight ahead | Go straight for two blocks.
el turista | Hay muchos turistas en verano. | the tourist | There are many tourists in summer.

# School & Work
la escuela | Mi escuela es grande. | the school | My school is big.
la universidad | Mi hermana va a la universidad. | the university | My sister goes to the university.
la clase | La clase de español es divertida. | the class | Spanish class is fun.
el estudiante | El estudiante hace preguntas. | the student | The student asks questions.
el profesor | El profesor explica la lección. | the teacher (male) | The teacher explains the lesson.
la profesora | La profesora es de Argentina. | the teacher (female) | The teacher is from Argentina.
el libro | Leo un libro interesante. | the book | I'm reading an interesting book.
el cuaderno | Escribo en mi cuaderno. | the notebook | I write in my notebook.
el lápiz | ¿Tienes un lápiz? | the pencil | Do you have a pencil?
el bolígrafo | Necesito un bolígrafo azul. | the pen | I need a blue pen.
el papel | Escribe tu nombre en el papel. | the paper | Write your name on the paper.
la tarea | Hago la tarea después de cenar. | the homework | I do my homework after dinner.
el examen | Mañana tengo un examen. | the exam | Tomorrow I have an exam.
la pregunta | Tengo una pregunta. | the question | I have a question.
la respuesta | La respuesta es correcta. | the answer | The answer is correct.
la palabra | ¿Qué significa esta palabra? | the word | What does this word mean?
el idioma | Hablo dos idiomas. | the language | I speak two languages.
el trabajo | Mi trabajo es interesante. | the work / the job | My job is interesting.
el jefe | El jefe está en una reunión. | the boss | The boss is in a meeting.
la reunión | La reunión es a las tres. | the meeting | The meeting is at three.
el dinero | No tengo mucho dinero. | the money | I don't have much money.
el abogado | Mi tío es abogado. | the lawyer | My uncle is a lawyer.
el ingeniero | Mi padre es ingeniero. | the engineer | My father is an engineer.
el cocinero | El cocinero prepara la paella. | the cook / the chef | The cook makes the paella.
el problema | No hay problema. | the problem | No problem.

# Weather & Nature
el tiempo | ¿Qué tiempo hace hoy? | the weather / the time | What's the weather like today?
el sol | Hace sol y calor. | the sun | It's sunny and hot.
la lluvia | No me gusta la lluvia. | the rain | I don't like the rain.
llover | Va a llover esta tarde. | to rain | It's going to rain this afternoon.
la nieve | Los niños juegan en la nieve. | the snow | The children play in the snow.
el viento | Hace mucho viento hoy. | the wind | It's very windy today.
el calor | Hace calor en verano. | the heat | It's hot in summer.
el frío | Tengo frío. | the cold | I'm cold.
la nube | Hay muchas nubes en el cielo. | the cloud | There are many clouds in the sky.
el cielo | El cielo está despejado. | the sky | The sky is clear.
el verano | En verano vamos a la playa. | the summer | In summer we go to the beach.
el invierno | El invierno es frío aquí. | the winter | Winter is cold here.
la primavera | Las flores salen en primavera. | the spring | Flowers come out in spring.
el otoño | Me gusta el otoño. | the fall / the autumn | I like fall.
el árbol | El árbol es muy alto. | the tree | The tree is very tall.
la flor | Te compro una flor. | the flower | I'll buy you a flower.
el río | El río es largo. | the river | The river is long.
el mar | El mar está tranquilo. | the sea | The sea is calm.
la montaña | Subimos la montaña. | the mountain | We climb the mountain.
el bosque | Caminamos por el bosque. | the forest | We walk through the forest.

# Common Verbs
ser | Yo soy de Argentina. | to be (who/what something is) | I am from Argentina.
estar | Estoy en casa. | to be (where / how something is) | I am at home.
tener | Tengo un perro. | to have | I have a dog.
hacer | ¿Qué haces hoy? | to do / to make | What are you doing today?
ir | Voy al supermercado. | to go | I'm going to the supermarket.
venir | ¿Vienes a la fiesta? | to come | Are you coming to the party?
querer | Quiero un café. | to want / to love | I want a coffee.
poder | ¿Puedo entrar? | can / to be able to | Can I come in?
saber | No sé la respuesta. | to know (facts) | I don't know the answer.
conocer | Conozco a tu hermano. | to know (people, places) | I know your brother.
decir | Ella dice la verdad. | to say / to tell | She tells the truth.
hablar | Hablo un poco de español. | to speak / to talk | I speak a little Spanish.
comer | Comemos a las dos. | to eat | We eat at two.
beber | Bebo mucha agua. | to drink | I drink a lot of water.
vivir | Vivo en Barcelona. | to live | I live in Barcelona.
trabajar | Trabajo en un banco. | to work | I work at a bank.
estudiar | Estudio español todos los días. | to study | I study Spanish every day.
leer | Leo el periódico. | to read | I read the newspaper.
escribir | Escribo una carta a mi abuela. | to write | I write a letter to my grandmother.
escuchar | Escucho música en el coche. | to listen | I listen to music in the car.
ver | Vemos una película. | to see / to watch | We watch a movie.
mirar | Mira el cielo. | to look at | Look at the sky.
dormir | Duermo ocho horas. | to sleep | I sleep eight hours.
caminar | Camino al trabajo. | to walk | I walk to work.
correr | Corro en el parque. | to run | I run in the park.
nadar | Me gusta nadar en el mar. | to swim | I like swimming in the sea.
jugar | Los niños juegan al fútbol. | to play (games, sports) | The children play soccer.
cocinar | Mi padre cocina los domingos. | to cook | My father cooks on Sundays.
comprar | Compro leche y pan. | to buy | I buy milk and bread.
vender | Venden frutas en el mercado. | to sell | They sell fruit at the market.
pagar | Pago con tarjeta. | to pay | I pay by card.
abrir | Abre la puerta, por favor. | to open | Open the door, please.
cerrar | Cierro la ventana. | to close | I close the window.
entrar | Entramos en la tienda. | to enter / to go in | We go into the store.
salir | Salgo de casa a las ocho. | to leave / to go out | I leave home at eight.
llegar | El tren llega tarde. | to arrive | The train arrives late.
volver | Vuelvo a casa a las seis. | to return / to come back | I come back home at six.
tomar | Tomo el autobús. | to take / to drink | I take the bus.
dar | Te doy un regalo. | to give | I give you a gift.
necesitar | Necesito ayuda. | to need | I need help.
buscar | Busco mis llaves. | to look for | I'm looking for my keys.
encontrar | No encuentro mi teléfono. | to find | I can't find my phone.
ayudar | ¿Me ayudas, por favor? | to help | Can you help me, please?
entender | No entiendo la pregunta. | to understand | I don't understand the question.
aprender | Aprendo español con Duolingo. | to learn | I'm learning Spanish with Duolingo.
pensar | Pienso en ti. | to think | I think about you.
creer | Creo que tienes razón. | to believe / to think | I think you're right.
gustar | Me gusta el chocolate. | to like (to be pleasing) | I like chocolate.
llamar | Llamo a mi madre cada día. | to call | I call my mother every day.
esperar | Espero el autobús. | to wait / to hope | I'm waiting for the bus.
usar | Uso el teléfono para todo. | to use | I use my phone for everything.
poner | Pongo los libros en la mesa. | to put | I put the books on the table.
traer | Traigo pan para la cena. | to bring | I'm bringing bread for dinner.
preguntar | El niño pregunta mucho. | to ask | The boy asks a lot of questions.
contestar | Contesta el teléfono. | to answer | Answer the phone.
empezar | La película empieza a las nueve. | to start / to begin | The movie starts at nine.
terminar | Termino el trabajo a las cinco. | to finish | I finish work at five.
bailar | Bailamos en la fiesta. | to dance | We dance at the party.
cantar | Ella canta muy bien. | to sing | She sings very well.
limpiar | Limpio la casa los sábados. | to clean | I clean the house on Saturdays.
descansar | Necesito descansar un poco. | to rest | I need to rest a little.
levantarse | Me levanto a las siete. | to get up | I get up at seven.

# Adjectives & Feelings
grande | Tengo una casa grande. | big | I have a big house.
pequeño | El perro es pequeño. | small | The dog is small.
alto | Mi hermano es muy alto. | tall / high | My brother is very tall.
bajo | Ella es baja. | short (height) / low | She is short.
largo | Es un viaje largo. | long | It's a long trip.
corto | El vestido es corto. | short (length) | The dress is short.
nuevo | Tengo un teléfono nuevo. | new | I have a new phone.
viejo | El hombre viejo camina despacio. | old | The old man walks slowly.
joven | Mi madre es joven. | young | My mother is young.
bueno | El pan es bueno. | good | The bread is good.
malo | El tiempo está malo hoy. | bad | The weather is bad today.
bonito | ¡Qué día tan bonito! | pretty / nice | What a nice day!
feo | El edificio es feo. | ugly | The building is ugly.
guapo | Tu novio es guapo. | handsome / good-looking | Your boyfriend is handsome.
fácil | El español es fácil. | easy | Spanish is easy.
difícil | El examen es difícil. | difficult | The exam is difficult.
caro | El hotel es muy caro. | expensive | The hotel is very expensive.
barato | Este restaurante es barato. | cheap | This restaurant is cheap.
rápido | El tren es rápido. | fast | The train is fast.
lento | Mi computadora es lenta. | slow | My computer is slow.
caliente | El café está caliente. | hot (temperature) | The coffee is hot.
frío | El agua está fría. | cold | The water is cold.
feliz | Estoy feliz hoy. | happy | I'm happy today.
triste | El niño está triste. | sad | The boy is sad.
cansado | Estoy cansado después del trabajo. | tired | I'm tired after work.
contento | Mi madre está contenta. | glad / pleased | My mother is pleased.
enojado | El jefe está enojado. | angry | The boss is angry.
nervioso | Estoy nervioso por el examen. | nervous | I'm nervous about the exam.
aburrido | La película es aburrida. | boring / bored | The movie is boring.
divertido | El juego es divertido. | fun | The game is fun.
interesante | La clase es interesante. | interesting | The class is interesting.
importante | Es una reunión importante. | important | It's an important meeting.
simpático | Tu amigo es muy simpático. | nice / friendly | Your friend is very nice.
inteligente | La niña es muy inteligente. | intelligent / smart | The girl is very smart.
delicioso | La paella está deliciosa. | delicious | The paella is delicious.
limpio | La cocina está limpia. | clean | The kitchen is clean.
sucio | Mis zapatos están sucios. | dirty | My shoes are dirty.
lleno | El autobús está lleno. | full | The bus is full.
vacío | El restaurante está vacío. | empty | The restaurant is empty.
abierto | El museo está abierto. | open | The museum is open.
cerrado | La tienda está cerrada. | closed | The store is closed.
fuerte | El café es muy fuerte. | strong | The coffee is very strong.
ocupado | Estoy muy ocupado hoy. | busy | I'm very busy today.
listo | La cena está lista. | ready / smart | Dinner is ready.
favorito | Mi color favorito es el azul. | favorite | My favorite color is blue.
mejor | Eres mi mejor amiga. | better / best | You are my best friend.
peor | Hoy es el peor día. | worse / worst | Today is the worst day.
mismo | Tenemos el mismo libro. | same | We have the same book.
otro | Quiero otro café. | other / another | I want another coffee.
mucho | Tengo mucho trabajo. | a lot / much | I have a lot of work.
poco | Hablo un poco de inglés. | little / a bit | I speak a little English.
todo | Todo está bien. | all / everything | Everything is fine.

# Questions & Little Words
¿qué? | ¿Qué quieres comer? | what? | What do you want to eat?
¿quién? | ¿Quién es ella? | who? | Who is she?
¿dónde? | ¿Dónde vives? | where? | Where do you live?
¿cuándo? | ¿Cuándo es la fiesta? | when? | When is the party?
¿por qué? | ¿Por qué estás triste? | why? | Why are you sad?
¿cómo? | ¿Cómo te llamas? | how? | What's your name? (literally "How do you call yourself?")
¿cuánto? | ¿Cuánto cuesta? | how much? | How much does it cost?
¿cuál? | ¿Cuál prefieres? | which? / what? | Which one do you prefer?
porque | Estudio porque quiero aprender. | because | I study because I want to learn.
yo | Yo soy estudiante. | I | I am a student.
tú | ¿Tú hablas inglés? | you (informal) | Do you speak English?
él | Él es mi hermano. | he | He is my brother.
ella | Ella es doctora. | she | She is a doctor.
usted | ¿Usted es el señor López? | you (formal) | Are you Mr. López?
nosotros | Nosotros vivimos aquí. | we | We live here.
ellos | Ellos son mis amigos. | they | They are my friends.
y | Quiero pan y queso. | and | I want bread and cheese.
o | ¿Café o té? | or | Coffee or tea?
pero | Es caro, pero es bueno. | but | It's expensive, but it's good.
con | Voy con mi madre. | with | I'm going with my mother.
sin | Café sin azúcar, por favor. | without | Coffee without sugar, please.
en | El libro está en la mesa. | in / on / at | The book is on the table.
de | Soy de Chile. | of / from | I'm from Chile.
para | Este regalo es para ti. | for | This gift is for you.
a | Voy a la playa. | to / at | I'm going to the beach.
aquí | Estoy aquí. | here | I'm here.
allí | El hotel está allí. | there | The hotel is there.
cerca | La tienda está cerca. | near / close | The store is close by.
lejos | Mi casa está lejos. | far | My house is far away.
muy | Estoy muy bien. | very | I'm very well.
también | Yo también quiero ir. | also / too | I want to go too.
siempre | Siempre como a las dos. | always | I always eat at two.
nunca | Nunca bebo café. | never | I never drink coffee.
a veces | A veces voy al cine. | sometimes | Sometimes I go to the movies.
ya | Ya terminé la tarea. | already | I already finished the homework.
todavía | Todavía no sé nadar. | still / yet | I still don't know how to swim.
después | Después del trabajo, voy al gimnasio. | after / afterward | After work, I go to the gym.
antes | Lávate las manos antes de comer. | before | Wash your hands before eating.
hay | Hay un gato en el jardín. | there is / there are | There is a cat in the garden.
algo | ¿Quieres algo de beber? | something | Do you want something to drink?
nada | No tengo nada. | nothing | I have nothing.
alguien | Alguien está en la puerta. | someone | Someone is at the door.
nadie | No hay nadie en casa. | nobody | There's nobody at home.
mi | Mi casa es tu casa. | my | My house is your house.
tu | ¿Dónde está tu hermano? | your (informal) | Where is your brother?

# Hobbies & Free Time
el deporte | Mi deporte favorito es el tenis. | the sport | My favorite sport is tennis.
el fútbol | Juego al fútbol los sábados. | soccer | I play soccer on Saturdays.
la música | Escucho música todo el día. | the music | I listen to music all day.
la película | Vemos una película de terror. | the movie | We're watching a horror movie.
la fiesta | La fiesta es el sábado. | the party | The party is on Saturday.
el juego | Este juego es para niños. | the game | This game is for children.
la canción | Me gusta esta canción. | the song | I like this song.
el baile | El baile es a las ocho. | the dance | The dance is at eight.
la guitarra | Toco la guitarra. | the guitar | I play the guitar.
la novela | Leo una novela de amor. | the novel | I'm reading a romance novel.
la foto | Tomo muchas fotos. | the photo | I take a lot of photos.
el gimnasio | Voy al gimnasio por la mañana. | the gym | I go to the gym in the morning.
el equipo | Mi equipo ganó el partido. | the team | My team won the game.
el partido | El partido empieza a las seis. | the match / the game | The match starts at six.
el regalo | Gracias por el regalo. | the gift | Thanks for the gift.
la piscina | Nadamos en la piscina. | the swimming pool | We swim in the pool.
el tiempo libre | En mi tiempo libre, leo. | free time | In my free time, I read.
el arte | Me interesa el arte moderno. | the art | I'm interested in modern art.
pasear | Paseamos por el parque. | to take a walk | We take a walk in the park.
el videojuego | Mi hermano juega videojuegos. | the video game | My brother plays video games.
la invitación | Recibí una invitación a la boda. | the invitation | I received an invitation to the wedding.
`;

  const topics = [];
  const problems = [];
  DATA.split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith('# ')) { topics.push(line.slice(2).trim()); return; }
    const [es, esSentence, en, enSentence] = line.split('|').map((x) => x.trim());
    problems.push({ k: topics.length - 1, es, esSentence, en, enSentence });
  });

  window.SPANISH500 = {
    id: 'spanish500',
    name: 'Spanish',
    topics,
    parts: [],
    problems,
    expected: problems.length,
    build: (p) => ({
      front: `**${p.es}**\n\n${p.esSentence}`,
      back: `**${p.en}**\n\n${p.enSentence}`,
    }),
  };
})();

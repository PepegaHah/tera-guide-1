// Antaroth's Abyss (Hard)
//
// made by Yuyuko
// updated by HSDN

const {HIGHLIGHT_ITEM, SpawnMarker, SpawnVector, SpawnCircle} = require("../lib");

let player, entity, library, effect;

let counter = 0; // count for back attacks
let timer; // reset time
let print = true; // 2 boss Health

// 2 boss Health tips
function start_boss() {
	print = true;
}

function print_fifty(handlers) {
	if (print) {
		handlers['text']({
			"sub_type": "message",
			"message": "50%",
			"message_RU": "50%"
		});
	}
	print = false;
}

function print_twenty(handlers) {
	if (print) {
		handlers['text']({
			"sub_type": "message",
			"message": "20%",
			"message_RU": "20%"
		});
	}
	print = false;
}

// 3 boss: counter of back attacks
function back_attack_HM(handlers) {
	clearTimeout(timer);
	counter++;
	if (counter >= 2) {
		handlers['text']({
			"sub_type": "message",
			"message": "Back attack",
			"message_RU": "Задний"
		});
	}
	timer = setTimeout(()=> {
		counter = 0;
	}, 3000);
}

// 3 boss: color marks in cage
/* ------------------------------------------- */
let colour_to_use = null;
const COLOURS_OFFSETS = {
	"red": 0,
	"yellow": 120,
	"blue": 240,
};
function set_clockwise(clockwise, handlers, event, entity, dispatch) {
	setTimeout(()=> {
		// Get the colour rotation
		const colour_rotation = clockwise ? ["red", "yellow", "blue"] : ["blue", "yellow", "red"];

		// Loop thru the three cage rotations
		for (let i = 0; i < 3; i++) {
			let current_colour = colour_rotation[(colour_rotation.indexOf(colour_to_use) + i) % 3];
			SpawnMarker(false, COLOURS_OFFSETS[current_colour], 150, i * 2600, (i + 1) * 3000, true, null, handlers, event, entity);
		}

		// clear out clockwise
		setTimeout(()=> {
			clockwise = null;
		}, 12000);
	}, 1000);
}
function change_colour(colour) {
	colour_to_use = colour;
}
/* ------------------------------------------- */

// heart thrust+anticlockwise spin+right swipe+AOEs from out to in
let SPAWNING_FIRST_CIRCLE_FLOWERS = [
	{"type": "text","class_position":"tank","sub_type": "message","message": "Right safe > Inward waves","message_RU": "Вправо сейф > Волны к"},
	{"type": "text","class_position":"dps","sub_type": "message","message": "Left safe > Inward waves","message_RU": "Влево сейф > Волны к"},
	{"type": "text","class_position":"heal","sub_type": "message","message": "Left safe > Inward waves","message_RU": "Влево сейф > Волны к"},
	{"type": "func","func": SpawnMarker.bind(null,false,90,-250,0,2500,true,null)},
	{"type": "func","func": SpawnVector.bind(null,553,0,0,180,500,0,2500)},
	{"type": "func","func": SpawnVector.bind(null,553,0,0,0,500,0,1500)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,18,143,1500,5000)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,12,293,1500,5000)}
];
// heart thrust+clockwise spin+left swipe+AOEs from in to out
let SPAWNING_SECOND_CIRCLE_FLOWERS = [
	{"type": "text","class_position":"tank","sub_type": "message","message": "Left safe > Outward waves","message_RU": "Влево сейф > Волны от"},
	{"type": "text","class_position":"dps","sub_type": "message","message": "Right safe > Outward waves","message_RU": "Вправо сейф > Волны от"},
	{"type": "text","class_position":"heal","sub_type": "message","message": "Right safe > Outward waves","message_RU": "Вправо сейф > Волны от"},
	{"type": "func","func": SpawnMarker.bind(null,false,270,-250,0,2500,true,null)},
	{"type": "func","func": SpawnVector.bind(null,553,0,0,180,500,0,2500)},
	{"type": "func","func": SpawnVector.bind(null,553,0,0,0,500,0,1500)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,18,157,1500,5000)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,12,307,1500,5000)}
];

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
	},

	// 1 BOSS, NOT ENRAGED
	"s-920-1000-1117-0": [{"type": "text","sub_type": "message","message": "Stay IN > Get OUT","message_RU": "К нему > От него"}],
	"s-920-1000-1116-0": [{"type": "text","sub_type": "message","message": "Get OUT > Stay IN","message_RU": "От него > К нему"}],
	"s-920-1000-1109-0": [{"type": "text","sub_type": "message","message": "Back attack","message_RU": "Откид назад"}],
	"s-920-1000-1130-0": [{"type": "text","sub_type": "message","message": "Full > Outer > Inner","message_RU": "Общий > Внешний > Внутренний"}],

	// 1 BOSS, ENRAGED
	"s-920-1000-2117-0": [{"type": "text","sub_type": "message","message": "Stay IN > Get OUT","message_RU": "К нему > От него"}],
	"s-920-1000-2116-0": [{"type": "text","sub_type": "message","message": "Get OUT > Stay IN","message_RU": "От него > К нему"}],
	"s-920-1000-2109-0": [{"type": "text","sub_type": "message","message": "Back attack","message_RU": "Откид назад"}],
	"s-920-1000-2130-0": [{"type": "text","sub_type": "message","message": "Full > Inner > Outer","message_RU": "Общий > Внутренний > Внешний"}],

	// 1 BOSS, SPECIAL ATTACKS
	"s-920-1000-1300-0": [{"type": "text","sub_type": "message","delay": 600,"message": "Dodge!","message_RU": "Эвейд!"}],

	// 2 BOSS, NOT ENRAGED
	"s-920-2000-1108-0": [{"type": "text","sub_type": "message","message": "Target swing","message_RU": "Таргет"}],
	"s-920-2000-1113-0": [{"type": "text","sub_type": "message","message": "Left hand","message_RU": "| Левая полоса"}],
	"s-920-2000-1114-0": [{"type": "text","sub_type": "message","message": "Right hand","message_RU": "Правая полоса |"}],
	"s-920-2000-1106-0": [{"type": "text","sub_type": "message","message": "Spin attack","message_RU": "Крутилка"},
		{"type": "func","func": SpawnCircle.bind(null,false,553,0,0,10,320,0,3500)}
	],
	"s-920-2000-1105-0": [{"type": "text","sub_type": "message","message": "Back attack","message_RU": "Удар назад"}],
	"s-920-2000-1104-0": [{"type": "text","sub_type": "message","message": "Random jump","message_RU": "Прыжок (стан)"}],
	"s-920-2000-1110-0": [{"type": "text","sub_type": "message","message": "Stun attack","message_RU": "Передний стан"}],
	"s-920-2000-1111-0": [{"type": "text","sub_type": "message","message": "Left hand","message_RU": "| Левая полоса"}],
	"s-920-2000-1112-0": [{"type": "text","sub_type": "message","message": "Right hand","message_RU": "Правая полоса |"}],

	// 2 BOSS, ENRAGED
	"s-920-2000-2108-0": [{"type": "text","sub_type": "message","message": "Target swing","message_RU": "Таргет"}],
	"s-920-2000-2113-0": [{"type": "text","sub_type": "message","message": "Left hand","message_RU": "| Левая полоса"}],
	"s-920-2000-2114-0": [{"type": "text","sub_type": "message","message": "Right hand","message_RU": "Правая полоса |"}],
	"s-920-2000-2106-0": [{"type": "text","sub_type": "message","message": "Spin attack","message_RU": "Крутилка"},
		{"type": "func","func": SpawnCircle.bind(null,false,553,0,0,10,320,0,3500)}
	],
	"s-920-2000-2105-0": [{"type": "text","sub_type": "message","message": "Back attack","message_RU": "Удар назад"}],
	"s-920-2000-2104-0": [{"type": "text","sub_type": "message","message": "Random jump","message_RU": "Прыжок (стан)"}],
	"s-920-2000-2110-0": [{"type": "text","sub_type": "message","message": "Stun attack","message_RU": "Передний стан"}],
	"s-920-2000-2111-0": [{"type": "text","sub_type": "message","message": "Left hand","message_RU": "| Левая полоса"}],
	"s-920-2000-2112-0": [{"type": "text","sub_type": "message","message": "Right hand","message_RU": "Правая полоса"}],

	// 2 BOSS, SPECIAL ATTACKS
	"s-920-2000-3119-0": [{"type": "text","sub_type": "message","message": "Red: OUT safe","message_RU": "Красный: Наружу сейф"}],
	"s-920-2000-3220-0": [{"type": "text","sub_type": "message","message": "Blue: IN safe","message_RU": "Синий: Внутрь сейф"}],
	"s-920-2000-3116-0": [{"type": "text","sub_type": "message","message": "Circles","message_RU": "Круги"}],
	"h-920-2000-99": [{"type": "func","func": start_boss}],
	"h-920-2000-50": [{"type": "func","func": print_fifty}],  // 50%
	"h-920-2000-21": [{"type": "func","func": start_boss}],
	"h-920-2000-20": [{"type": "func","func": print_twenty}], // 20%

	// 3 BOSS, UNENRAGED
	"s-920-3000-1315-0": [{"type": "text","sub_type": "message","message": "Pushback","message_RU": "Откид (кайа)"}],
	"s-920-3000-1107-0": [{"type": "text","sub_type": "message","message": "Random jump","message_RU": "Прыжок (стан)"}],
	"s-920-3000-1204-0": [{"type": "text","sub_type": "message","message": "Energy beam","message_RU": "Волна"}],
	// heart thrust+anticlockwise spin+right swipe+AOEs from out to in
	"s-920-3000-1109-0": SPAWNING_FIRST_CIRCLE_FLOWERS,
	// heart thrust+clockwise spin+left swipe+AOEs from in to out
	"s-920-3000-1111-0": SPAWNING_SECOND_CIRCLE_FLOWERS,
	//
	"s-920-3000-1113-0": [{"type": "text","sub_type": "message","message": "Front | Back slam","message_RU": "Передний | Задний"}],
	"s-920-3000-1115-0": [{"type": "text","sub_type": "message","message": "Spinning attack","message_RU": "Круговая"}],
	"s-920-3000-1104-0": [{"type": "func","func": back_attack_HM}],
	//"s-920-3000-1202-0": [{"type": "text","sub_type": "message","message": "spin or front,back slam","message_RU": "Круговая | Задний"}],
	"s-920-3000-1120-0": [{"type": "text","sub_type": "message","message": "energy beam","message_RU": "Волна"}],

	// 3 BOSS, ENRAGED
	"s-920-3000-2204-0": [{"type": "text","sub_type": "message","message": "Enraged: energy beam","message_RU": "Волна"}],
	// heart thrust+anticlockwise spin+right swipe+AOEs from out to in
	"s-920-3000-2109-0": SPAWNING_FIRST_CIRCLE_FLOWERS,
	// heart thrust+clockwise spin+left swipe+AOEs from in to out
	"s-920-3000-2111-0": SPAWNING_SECOND_CIRCLE_FLOWERS,
	//
	"s-920-3000-2113-0": [{"type": "text","sub_type": "message","message": "Front | Back slam","message_RU": "Передний | Задний"}],
	"s-920-3000-2104-0": [{"type": "func","func": back_attack_HM}],
	"s-920-3000-2115-0": [{"type": "text","sub_type": "message","message": "Spinning attack","message_RU": "Круговая"}],
	"s-920-3000-2107-0": [{"type": "text","sub_type": "message","message": "Random jump","message_RU": "Прыжок (стан)"}],
	//"s-920-3000-2202-0": [{"type": "text","sub_type": "message","message": "spin or front,back slam","message_RU": "Круговая | Задний"}],
	"s-920-3000-2120-0": [{"type": "text","sub_type": "message","message": "Energy beam","message_RU": "Волна"}],

	// 3 BOSS, SPECIAL ATTACKS
	"s-920-3000-1400-0": [{"type": "text","sub_type": "message","message": "Clones: beam","message_RU": "Копии: волны"}],
	"s-920-3000-1401-0": [{"type": "text","sub_type": "message","message": "Clones: spin","message_RU": "Копии: круговые"}],
	// color marks in cage
	"ae-0-0-9203037": [{"type": "text","sub_type": "message","message": "Red","message_RU": "Красный"},{"type": "func","func": change_colour.bind(null, 'red')}],
	"ae-0-0-9203038": [{"type": "text","sub_type": "message","message": "Yellow","message_RU": "Желтый"},{"type": "func","func": change_colour.bind(null, 'yellow')}],
	"ae-0-0-9203039": [{"type": "text","sub_type": "message","message": "Blue","message_RU": "Синий"},{"type": "func","func": change_colour.bind(null, 'blue')}],
	// anti-clockwise
	"s-920-3000-1317-0": [{"type": "func","func": set_clockwise.bind(null, false)}],
	// clockwise
	"s-920-3000-1318-0": [{"type": "func","func": set_clockwise.bind(null, true)}]
};
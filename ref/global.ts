import * as Application from "expo-application";
import * as Battery from "expo-battery";
import { Directory, File, Paths } from "expo-file-system";
import * as ExpoLocation from "expo-location";
import * as Notifications from "expo-notifications";
import { Dimensions, Platform } from "react-native";
import * as SUNCALC from "suncalc";
import { create } from "zustand";
import FontPrefs from "./font-prefs.json" with { type: "json" };


//* Bodies
export interface CelestialBody {
	name: string,
	targetAltitude: number,
	axialTilt: number,
	colors: string[],
	palette: string[],
	spriteSheet: any,
	thumbnail: any,
	icon?: string,
}

export const pluto: CelestialBody = {
	name: "Pluto",
	targetAltitude: -1.5,
	axialTilt: 122.5,
	colors: [
		"#ebd4b2",
		"#eee8dc",
		"#cec1b0",
		"#503e2a",
		"#968c7c"
	],
	palette: [
		"#DBC5A3",
		"#A69171",
		"#755F42",
		"#483116"
	],
	spriteSheet: require("../assets/images/bodies/sprite-sheets/Pluto.png"),
	thumbnail: require("../assets/images/bodies/thumbnails/Pluto.png"),
	icon: "m 49.999512,12.079102 c -5.80701,0 -11.612999,3.405264 -12.732422,10.21582 2.238847,13.621111 23.227462,13.621111 25.466308,0 -1.119423,-6.810556 -6.926876,-10.21582 -12.733886,-10.21582 z m -31.483887,0.84082 c 1.039029,17.923247 14.194245,27.521871 28.21875,28.809082 0.758885,5.455175 1.244505,10.910861 1.45752,16.366699 -5.647244,-0.09752 -11.29416,-0.646699 -16.942383,-1.658203 v 6.716309 c 5.68192,-1.017539 11.362522,-1.567057 17.043457,-1.659668 0.160924,8.809145 -0.388729,17.619313 -1.650879,26.427246 h 6.716308 c -1.262149,-8.807933 -1.811802,-17.6181 -1.650878,-26.427246 5.680446,0.09268 11.362025,0.642217 17.043457,1.659668 V 56.4375 C 63.102753,57.449004 57.454373,57.998188 51.807129,58.095703 52.020143,52.639846 52.507224,47.184198 53.266113,41.729004 67.290074,40.441263 80.444405,30.842551 81.483398,12.919922 H 74.76709 c 2.238848,36.381265 -51.772538,36.381265 -49.533692,0 z m 31.483887,0.837891 c 3.568162,-1e-6 7.137001,2.845977 6.017578,8.537109 2.238847,11.382264 -14.272538,11.382264 -12.033692,0 -1.119423,-5.691132 2.447951,-8.537109 6.016114,-8.537109 z",
};

export const terra: CelestialBody = {
	name: "Terra",
	targetAltitude: 90,
	axialTilt: 23.4393,
	colors: [
		"#63ab3f",
		"#3b7d4f",
		"#2f5753",
		"#283540",
		"#4fa4b8",
		"#404973",
		"#f5ffe8",
		"#dfe0e8",
		"#686f99",
		"#404973"
	],
	palette: [
		"#BAC4FF",
		"#00A6C1",
		"#00783A",
		"#194100"
	],
	spriteSheet: require("../assets/images/bodies/sprite-sheets/Terra.png"),
	thumbnail: require("../assets/images/bodies/thumbnails/Terra.png"),
};


export interface TimeFont {
	name: string,
	spacing: number,
	glyph_height: number,
	glyph_widths: { char: string, width: number }[],
}

//* UI
export const ui = {
	palette: ["#ffffff", "#000000", "#ff453a"],
	timeFonts: FontPrefs as TimeFont[],
	get bodyTextSize() {
		return 0.055 * slot.width;
	},
	skewAngle: -10,
	get skewStyle() {
		return Platform.select({
			ios: {
				transform: [{skewY: `${this.skewAngle}deg`}]
			},
			android: {
				transform: [
					{perspective: 82100},
					{rotateX: "25deg"},
					{rotateY: "-25deg"},
					{scale: 1.1},
				],
			},
		});
	},
	get antiSkewStyle() {
		return Platform.select({
			ios: {
				transform: [{skewY: `${-this.skewAngle}deg`}]
			},
			android: {
				transform: [
					{perspective: 82100},
					{rotateX: "-25deg"},
					{rotateY: "25deg"},
					{scale: 1.1},
				],
			},
		});
	},
	get inputBorderWidth() {
		return 0.005 * slot.width;
	},
	btnShadowStyle(direction="down", color="black") {
		let offset = 0;
		switch (direction) {
			case "up": offset = -1; break;
			case "middle": offset = 0; break;
			case "down": offset = 1; break;
		}

		return {
			shadowColor: color,
			shadowOffset: {
				width: 0,
				height: offset * this.inputBorderWidth
			},
			shadowRadius: this.inputBorderWidth,
			shadowOpacity: 0.5,
		}
	},
	animDuration: 0.2,
	btnAnimDuration: 0.1,
	fps: 16,
	alertYes: "Continue",
	alertNo: "Cancel",
}

export const screen = {
	// topOffset: 59,
	topOffset: 10,
	bottomOffset: 20,
	horizOffset: 10,
	width: Dimensions.get("window").width,
	height: Dimensions.get("window").height,
};

export const nav = {
	ratio: 0.45,
	get height() {
		return this.ratio * slot.width;
	},
	get thickness() {
		return (20 / (this.ratio * 100)) * this.height;
	},
};

export const slot = {
	get width() {
		return screen.width - 2 * screen.horizOffset;
	},
	get height() {
		return screen.height - screen.topOffset - screen.bottomOffset - nav.thickness;
	},
	get ellipseSemiMajor() {
		return this.width / 2;
	},
	get ellipseSemiMinor() {
		return this.ellipseSemiMajor / 2;
	},
	borderRadius: 30,
	shadowRadius: 35,
};


//* City class
const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
export const bodyTimeLength = 5 * 60 * 1000;
const numBodyTimes = 60;

export class City {
	name: string;
	fullName: string;
	lat: number;
	lng: number;
	nextBodyTimes = Array.from({ length: numBodyTimes }, () => new Date(Date.now() + 2 * ONE_DAY));

	constructor(name: string, fullName: string, lat: number, lng: number) {
		this.name = name;
		this.fullName = fullName;
		this.lat = lat;
		this.lng = lng;
	}

	getNextBodyTimes(start: Date): Date[] {
		SUNCALC.addTime(pluto.targetAltitude, "plutoTimeMorning", "plutoTimeEvening");
		const results = [];
		for (let i = 0; results.length < numBodyTimes; i++) {
			const date = new Date(start.getTime() + i * ONE_DAY);
			const times = SUNCALC.getTimes(date, this.lat, this.lng);
			const morning = times["plutoTimeMorning"];
			const evening = times["plutoTimeEvening"];
			morning.setSeconds(0, 0);
			evening.setSeconds(0, 0);
			if (morning.getTime() > start.getTime()) results.push(morning);
			if (evening.getTime() > start.getTime()) results.push(evening);
		}
		return results.slice(0, numBodyTimes);
	}

	getNextTestTimes(start: Date): Date[] {
		const dt = 5;
		const results = [];
		const next = new Date(start);
		next.setSeconds(0, 0);
		const nextMinute = Math.ceil((start.getMinutes() + 1) / dt) * dt;
		if (nextMinute >= 60) {
			next.setHours(next.getHours() + 1);
			next.setMinutes(0);
		}
		else next.setMinutes(nextMinute);
		for (let i = 0; i < this.nextBodyTimes.length; i++) {
			results.push(new Date(next.getTime() + i * dt * ONE_MINUTE));
		}
		return results;
	}

	setNextBodyTimes() {
		// const now = new Date(2025, 3, 20, 12, 0, 0);
		const now = new Date();
		const start = new Date(now.getTime() - bodyTimeLength);
		this.nextBodyTimes = this.getNextBodyTimes(start);
		// this.nextBodyTimes = this.getNextTestTimes(start);
		console.log(`Calculated times for ${this.name}.`);
	}

	get12HourClockTime() {
		return this.nextBodyTimes[0].toLocaleTimeString(undefined, {
			hour: "numeric",
			minute: "2-digit",
			hour12: true
		}).replace(/\s/g, "");
	}

	get24HourClockTime() {
		return this.nextBodyTimes[0].toLocaleTimeString(undefined, {
			hour: "numeric",
			minute: "2-digit",
			hour12: false
		});
	}

	getDateLong() {
		return this.nextBodyTimes[0].toLocaleDateString(undefined, {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	isBodyTimeNow() {
		const now = new Date();
		const dt = now.getTime() - this.nextBodyTimes[0].getTime();
		return (0 <= dt && dt <= bodyTimeLength) ? true : false;
	}
}


//* Zustand saving
const appVersion = Application.nativeApplicationVersion;
const saveDir = new Directory(Paths.document, "saves");
const saveFile = new File(saveDir, "save.json");

type saveStoreTypes = {
	// Saves
	version: string | null,

	defaultSaveData?: any, //^ Not save worthy
	initDefaultSaveData: () => void,
	writeDefaultSaveToFile: () => void,

	isSaveLoaded?: boolean, //^ Not save worthy
	setIsSaveLoaded: (bool: boolean) => void,
	loadSave: () => void,
	writeNewSaveToFile: () => void,

	// Permissions n' stuff
	promptsCompleted: boolean[],
	setPromptCompleted: (index: number, bool: boolean) => void,

	geolocate: () => Promise<void>,

	notifFreqs: boolean[],
	toggleNotifFreq: (index: number) => void,
	scheduleNotifs: () => Promise<void>,
	disableAllNotifs: () => void,

	// General storage
	activeTab?: number, //^ Not save worthy
	setActiveTab: (index: number) => void,

	activeCity: City,
	setActiveCity: (city: City) => void,
	youAreHere: boolean,
	setYouAreHere: (bool: boolean) => void,

	isFormat24Hour: boolean,
	setIsFormat24Hour: (bool: boolean) => void,
}

export const useSaveStore = create<saveStoreTypes>((set, get) => ({
	// Saves
	version: appVersion,

	defaultSaveData: null,
	initDefaultSaveData: () => {
		const saveData = JSON.parse(JSON.stringify(get()));
		delete saveData.defaultSaveData;
		delete saveData.isSaveLoaded;
		delete saveData.activeTab;
		saveData.promptsCompleted = [true, true];
		saveData.activeCity.nextBodyTimes = [];
		set({ defaultSaveData: saveData });
	},
	writeDefaultSaveToFile: async () => {
		const saveDataJSON = JSON.stringify(get().defaultSaveData);
		if (!saveDir.exists) saveDir.create();
		if (!saveFile.exists) saveFile.create();
		saveFile.write(saveDataJSON);
		console.log("Wrote default data to save file.");
	},

	isSaveLoaded: false,
	setIsSaveLoaded: (bool) => set({ isSaveLoaded: bool }),
	loadSave: async () => {
		if (saveFile.exists) {
			const dataFromSaveJSON = await saveFile.text();
			const saveData = JSON.parse(dataFromSaveJSON);

			// TODO: Switch case for future save versions

			set({ promptsCompleted: saveData.promptsCompleted });
			set({ notifFreqs: saveData.notifFreqs });
			get().setActiveCity(new City(saveData.activeCity.name, saveData.activeCity.fullName, saveData.activeCity.lat, saveData.activeCity.lng));
			get().setYouAreHere(saveData.youAreHere);
			get().setIsFormat24Hour(saveData.isFormat24Hour);

			console.log("Loaded preexisting data from save file.");
		}
		else console.log("No save file found, using default save data.");

		get().setIsSaveLoaded(true);
	},
	writeNewSaveToFile: async () => {
		const saveData = JSON.parse(JSON.stringify(get()));
		delete saveData.defaultSaveData;
		delete saveData.isSaveLoaded;
		delete saveData.activeTab;
		saveData.activeCity.nextBodyTimes = [];
		
		const saveDataJSON = JSON.stringify(saveData);
		if (!saveDir.exists) saveDir.create();
		if (!saveFile.exists) saveFile.create();
		saveFile.write(saveDataJSON);
		console.log("Wrote new data to save file.");
	},

	// Permissions n' stuff
	promptsCompleted: [false, false],
	setPromptCompleted: (index, bool) => {
		set(state => ({ promptsCompleted: state.promptsCompleted.map((p, i) => i === index ? bool : p) }));
	},

	geolocate: async () => {
		const { granted: locGranted } = await ExpoLocation.getForegroundPermissionsAsync();
		if (locGranted) {
			const batteryLevel = await Battery.getBatteryLevelAsync();
			const locAccuracy = (batteryLevel > 0.2) ? ExpoLocation.Accuracy.Balanced : ExpoLocation.Accuracy.Lowest;
			
			const position = await ExpoLocation.getCurrentPositionAsync({ accuracy: locAccuracy });
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;
			// const lat = 42.15032;
			// const lon = -84.03772;
			const results = await ExpoLocation.reverseGeocodeAsync({
				latitude: lat,
				longitude: lon,
			});

			const parts = [results[0].city || results[0].name, results[0].region, results[0].country];
			const name = parts.filter(Boolean)[0];
			const fullName = parts.filter(Boolean).join(", ");
			const city = new City(name!, fullName, lat, lon);
			city.setNextBodyTimes();
			get().setActiveCity(city);
			console.log(`Geolocation was a success! Location set to: ${name}`);
		}
		else {
			get().setYouAreHere(false);
			console.log("Location services not granted.");
		}
	},

	notifFreqs: [true, true],
	toggleNotifFreq: (index) => {
		set(state => ({ notifFreqs: state.notifFreqs.map((b, i) => i === index ? !b : b) }));
	},
	scheduleNotifs: async () => {
		const { granted: notifsGranted } = await Notifications.getPermissionsAsync();
		if (notifsGranted) {			
			const activeCity = get().activeCity;
			const youAreHere = get().youAreHere;
			const notifFreqs = get().notifFreqs;

			let numScheduled = 0;
			Notifications.cancelAllScheduledNotificationsAsync();
			activeCity.nextBodyTimes.map((nextBodyTime) => {
				if (nextBodyTime.getTime() > Date.now()) {
					const isBeforeNoon = (nextBodyTime.getHours() < 12);
					if ((isBeforeNoon && notifFreqs[0]) || (!isBeforeNoon && notifFreqs[1])) {
						Notifications.scheduleNotificationAsync({
							content: {
								title: `It's Pluto Time${(youAreHere) ? ` in ${activeCity.name}` : ""}!`,
								body: (youAreHere) ?
									`The sunlight in ${activeCity.name} now matches high noon on Pluto.` :
									"Step outside – the sunlight around you now matches high noon on Pluto.",
								interruptionLevel: "critical",
							},
							trigger: {
								type: Notifications.SchedulableTriggerInputTypes.DATE,
								date: nextBodyTime,
							},
						});
						numScheduled++;
					}
				}
			});

			console.log(`Notification scheduling was a success! ${numScheduled} Pluto Times scheduled in ${activeCity.name}${(numScheduled > 0) ? `, next scheduled for ${activeCity.get12HourClockTime()}.` : "."}`);
		} else {
			get().disableAllNotifs();
			console.log("Notifications not granted, disabled all.");
		}
	},
	disableAllNotifs: () => {
		set({ notifFreqs: [false, false] });
	},

	// General storage
	activeTab: 1,
	setActiveTab: (index) => set({ activeTab: index }),

	activeCity: new City("Reykjavík", "Reykjavik, Capital Region, Iceland", 64.13548, -21.89541),
	// activeCity: new City("Manchester", "Manchester, Michigan, United States", 42.15032, -84.03772),
	setActiveCity: (city) => set({ activeCity: city }),
	youAreHere: true,
	setYouAreHere: (bool) => set({ youAreHere: bool }),

	isFormat24Hour: false,
	setIsFormat24Hour: (bool) => set({ isFormat24Hour: bool }),
}));

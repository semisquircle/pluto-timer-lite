import { ToggleBtn } from "@/ref/btns";
import AllCities from "@/ref/cities.json" with { type: "json" };
import * as GLOBAL from "@/ref/global";
import { SlotBottomShadow } from "@/ref/slot-shadows";
import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import * as ExpoLocation from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, KeyboardEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Reanimated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Circle, Path, Rect, Svg, Text as SvgText } from "react-native-svg";


//* Reanimated
const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);
const ReanimatedSvg = Reanimated.createAnimatedComponent(Svg);
const ReanimatedRect = Reanimated.createAnimatedComponent(Rect);
const ReanimatedCircle = Reanimated.createAnimatedComponent(Circle);
const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const ReanimatedSvgText = Reanimated.createAnimatedComponent(SvgText);


//* Colors
const subTitleColor = GLOBAL.pluto.palette[0];
const inputOffColor = GLOBAL.pluto.palette[2];
const btnBgColor = GLOBAL.pluto.palette[2];
const bodyTextColor = GLOBAL.pluto.palette[0];


//* City input
const allCities = AllCities as any[]; //? Resolve typing conflict for "filter"
const cityInputHeight = 45;
const svgIconDimension = 0.6 * cityInputHeight;


//* Map
const s = "b";
const z = 16;
const n = Math.pow(2, z);
const mapTileDimension = (GLOBAL.slot.width - 2 * (GLOBAL.screen.horizOffset + GLOBAL.ui.inputBorderWidth)) / 3;
const mapTileOverlap = 0.1;
const pinArrowDimension = 0.8 * GLOBAL.ui.bodyTextSize;

const states: { [key: string]: string } = {
	"Alabama": "AL",
	"Alaska": "AK",
	"Arizona": "AZ",
	"Arkansas": "AR",
	"California": "CA",
	"Colorado": "CO",
	"Connecticut": "CT",
	"Delaware": "DE",
	"District Of Columbia": "DC",
	"Florida": "FL",
	"Georgia": "GA",
	"Hawaii": "HI",
	"Idaho": "ID",
	"Illinois": "IL",
	"Indiana": "IN",
	"Iowa": "IA",
	"Kansas": "KS",
	"Kentucky": "KY",
	"Louisiana": "LA",
	"Maine": "ME",
	"Maryland": "MD",
	"Massachusetts": "MA",
	"Michigan": "MI",
	"Minnesota": "MN",
	"Mississippi": "MS",
	"Missouri": "MO",
	"Montana": "MT",
	"Nebraska": "NE",
	"Nevada": "NV",
	"New Hampshire": "NH",
	"New Jersey": "NJ",
	"New Mexico": "NM",
	"New York": "NY",
	"North Carolina": "NC",
	"North Dakota": "ND",
	"Ohio": "OH",
	"Oklahoma": "OK",
	"Oregon": "OR",
	"Pennsylvania": "PA",
	"Rhode Island": "RI",
	"South Carolina": "SC",
	"South Dakota": "SD",
	"Tennessee": "TN",
	"Texas": "TX",
	"Utah": "UT",
	"Vermont": "VT",
	"Virginia": "VA",
	"Washington": "WA",
	"West Virginia": "WV",
	"Wisconsin": "WI",
	"Wyoming": "WY",
	"Puerto Rico": "PR",
};

const provinces: { [key: string]: string } = {
	"Alberta": "AB",
	"British Columbia": "BC",
	"Manitoba": "MB",
	"New Brunswick": "NB",
	"Newfoundland": "NF",
	"Northwest Territory": "NT",
	"Nova Scotia": "NS",
	"Nunavut": "NU",
	"Ontario": "ON",
	"Prince Edward Island": "PE",
	"Quebec": "QC",
	"Saskatchewan": "SK",
	"Yukon": "YT",
};


function toDMS(coord: number, isLat: boolean) {
	const deg = Math.floor(Math.abs(coord));
	const minFloat = (Math.abs(coord) - deg) * 60;
	const min = Math.floor(minFloat);
	const sec = ((minFloat - min) * 60).toFixed(2);

	let dir;
	if (isLat) dir = (coord >= 0) ? "N" : "S";
	else dir = (coord >= 0) ? "E" : "W";

	return `${deg}° ${min}' ${sec}" ${dir}`;
}


function locAlert() {
	Alert.alert(
		"Location services are disabled",
		`To update your current location dynamically, please allow location access in the Settings app.`,
		[
			{
				text: "OK",
				style: "default",
			},
		]
	);
}


//* Stylesheet
const styles = StyleSheet.create({
	content: {
		alignItems: "center",
		width: GLOBAL.slot.width,
		overflow: "hidden",
	},

	skewContainer: {
		width: "100%",
		height: "100%",
		paddingHorizontal: GLOBAL.screen.horizOffset,
		paddingTop: GLOBAL.screen.horizOffset,
	},

	title: {
		width: "100%",
		fontFamily: "Trickster-Reg-Semi",
		fontSize: 30,
		marginBottom: GLOBAL.screen.horizOffset,
		color: GLOBAL.ui.palette[0],
	},

	subtitle: {
		width: "100%",
		fontFamily: "Trickster-Reg-Semi",
		fontSize: 0.8 * GLOBAL.ui.bodyTextSize,
		marginBottom: GLOBAL.screen.horizOffset,
	},

	citySearchContainer: {
		position: "relative",
		zIndex: 9996,
	},

	cityInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		width: "60%",
		height: cityInputHeight,
		paddingHorizontal: GLOBAL.screen.horizOffset,
		borderColor: GLOBAL.ui.palette[0],
		borderWidth: GLOBAL.ui.inputBorderWidth,
		borderRadius: GLOBAL.screen.horizOffset,
		backgroundColor: GLOBAL.ui.palette[1],
		color: GLOBAL.ui.palette[1],
		zIndex: 9998,
	},

	citySearchSvg: {
		width: svgIconDimension,
		height: svgIconDimension,
		marginRight: (cityInputHeight - (2 * GLOBAL.ui.inputBorderWidth) - svgIconDimension) / 2,
	},

	cityInput: {
		flex: 1,
		fontFamily: "Trickster-Reg-Semi",
		fontSize: GLOBAL.ui.bodyTextSize,
		marginBottom: 0.1 * GLOBAL.ui.bodyTextSize,
		color: GLOBAL.ui.palette[0],
	},

	cityInputCancelBtnContainer: {
		position: "absolute",
		right: 0,
		height: "100%",
	},

	cityInputCancelBtn: {
		justifyContent: "center",
		height: "100%",
	},

	cityInputCancelBtnText: {
		fontFamily: "Trickster-Reg-Semi",
		fontSize: GLOBAL.ui.bodyTextSize,
		borderBottomWidth: GLOBAL.ui.inputBorderWidth / 2,
	},

	cityResultScrollViewContainer: {
		position: "absolute",
		top: cityInputHeight,
		width: "100%",
		backgroundColor: GLOBAL.ui.palette[1],
		zIndex: 9997,
		overflow: "hidden",
	},

	cityResultScrollView: {
		width: "100%",
		overflow: "visible",
	},

	cityResult: {
		justifyContent: "center",
		width: "100%",
		height: cityInputHeight - GLOBAL.screen.horizOffset,
		paddingLeft: GLOBAL.screen.horizOffset,
	},

	cityResultText: {
		fontFamily: "Trickster-Reg-Semi",
		fontSize: 0.8 * GLOBAL.ui.bodyTextSize,
		color: GLOBAL.ui.palette[0],
	},

	map: {
		justifyContent: "center",
		alignItems: "center",
		width: GLOBAL.slot.width - (2 * GLOBAL.screen.horizOffset),
		height: 0.55 * GLOBAL.slot.width,
		borderWidth: GLOBAL.ui.inputBorderWidth,
		borderColor: inputOffColor,
		borderRadius: GLOBAL.screen.horizOffset,
		overflow: "hidden",
	},

	mapTileContainer: {
		position: "absolute",
		flexWrap: "wrap",
		flexDirection: "row",
		width: 3 * mapTileDimension,
		height: 3 * mapTileDimension,
	},

	mapPin: {
		justifyContent: "center",
		alignItems: "center",
	},

	mapPinText: {
		flexDirection: "row",
		textAlign: "center",
		fontFamily: "Trickster-Reg-Semi",
		fontSize: GLOBAL.ui.bodyTextSize,
		paddingVertical: 0.4 * GLOBAL.ui.bodyTextSize,
		paddingHorizontal: 0.6 * GLOBAL.ui.bodyTextSize,
		backgroundColor: GLOBAL.ui.palette[2],
		borderRadius: 0.5 * GLOBAL.screen.horizOffset,
		color: GLOBAL.ui.palette[0],
	},

	latLng: {
		width: "100%",
		textAlign: "right",
		fontFamily: "Trickster-Reg-Semi",
		fontSize: 0.8 * GLOBAL.ui.bodyTextSize,
		marginTop: 0.5 * GLOBAL.screen.horizOffset,
		color: subTitleColor,
	},

	terra: {
		position: "absolute",
		bottom: -0.5 * GLOBAL.slot.width,
		width: GLOBAL.slot.width,
		height: GLOBAL.slot.width,
	}
});


export default function CityScreen() {
	//* App storage
	const WriteNewSaveToFile = GLOBAL.useSaveStore(state => state.writeNewSaveToFile);

	const Geolocate = GLOBAL.useSaveStore(state => state.geolocate);
	const ScheduleNotifs = GLOBAL.useSaveStore(state => state.scheduleNotifs);

	const ActiveCity = GLOBAL.useSaveStore(state => state.activeCity);
	const SetActiveCity = GLOBAL.useSaveStore(state => state.setActiveCity);
	const YouAreHere = GLOBAL.useSaveStore(state => state.youAreHere);
	const SetYouAreHere = GLOBAL.useSaveStore(state => state.setYouAreHere);


	//* City input/results
	const cityInputRef = useRef<TextInput>(null);
	const [cityScrollOffset, setCityScrollOffset] = useState(0);
	const [cityInputValue, setCityInputValue] = useState<string>("");
	const [isCityInputFocused, setIsCityInputFocused] = useState<boolean>(false);

	const handleCityInputPress = () => {
		cityInputRef.current?.focus();
		setIsCityInputFocused(true);
	}

	const [cityResults, setCityResults] = useState<any[]>([]);
	const handleCitySearch = (text: string) => {
		if (text.trim().length < 2) {
			setCityResults([]);
			return;
		}

		const lowerText = text.toLowerCase();
		const filteredCities = [];
		for (const city of allCities) {
			const cityFullNameLower = city.fullName.join(", ").toLowerCase();
			if (
				cityFullNameLower.includes(lowerText) ||
				cityFullNameLower.replace(/, /g, " ").includes(lowerText)
			) {
				filteredCities.push(city);
				if (filteredCities.length === 13) break;
			}
		}
		setCityResults(filteredCities);
	};

	const cityInputFocusProgress = useSharedValue(0);
	useEffect(() => {
		cityInputFocusProgress.value = withTiming(
			(isCityInputFocused) ? 1 : 0,
			{ duration: 1000 * GLOBAL.ui.animDuration / 2, easing: Easing.linear }
		);
	}, [isCityInputFocused]);

	const [cityInputCancelBtnWidth, setCityInputCancelBtnWidth] = useState(0);
	const cityInputWrapperAnimStyle = useAnimatedStyle(() => {
		return { width: GLOBAL.slot.width - (2 * GLOBAL.screen.horizOffset) - (cityInputFocusProgress.value * (cityInputCancelBtnWidth + GLOBAL.screen.horizOffset)) }
	});

	const cityInputFadeAnimStyle = useAnimatedStyle(() => {
		return { opacity: cityInputFocusProgress.value }
	});

	const youAreHereProgress = useSharedValue((YouAreHere) ? 0 : 1);
	useEffect(() => {
		youAreHereProgress.value = withTiming(
			(YouAreHere) ? 0 : 1,
			{ duration: 1000 * GLOBAL.ui.animDuration, easing: Easing.inOut(Easing.quad) }
		);
	}, [YouAreHere]);
	const youAreHereInputAnimStyle = useAnimatedStyle(() => {
		return {
			opacity: youAreHereProgress.value,
			marginBottom: interpolate(
				youAreHereProgress.value,
				[0, 1],
				[-cityInputHeight, GLOBAL.screen.horizOffset]
			),
		}
	});


	//* Keyboard height calculation
	const cityResultScrollViewRef = useRef(null);
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	function onKeyboardShow(event: KeyboardEvent) {
		setKeyboardHeight(event.endCoordinates.height);
	}

	useEffect(() => {
		const onShow = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
		return () => { onShow.remove() };
	}, []);


	//* Map
	const latRad = ActiveCity.lat * Math.PI / 180;
	const baseX = Math.floor(n * ((ActiveCity.lng + 180) / 360));
	const baseY = Math.floor(n * (1 - (Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI)) / 2);
	// const pinName = ActiveCity.fullName.join(", ");
	const pinName = ActiveCity.fullName[0] + ", " + (states[ActiveCity.fullName[1]] || provinces[ActiveCity.fullName[1]] || ActiveCity.fullName[1]);


	//* Components
	return (
		<View style={[styles.content, { height: GLOBAL.slot.height }]}>
			<ExpoImage style={styles.terra} source={require("@/assets/images/Terra.png")} />

			<View style={[styles.skewContainer, GLOBAL.ui.skewStyle]}>
				<Text style={styles.title}>Where Are You?</Text>

				<ToggleBtn
					style={{ marginBottom: GLOBAL.screen.horizOffset }}
					getter={!YouAreHere}
					optionTitles={[
						{ title: "Dynamic", subtitle: "Location" },
						{ title: "Static", subtitle: "Location" },
					]}
					optionIcons={[
						"m 57.269286,14.094483 c -3.818296,0 -7.636942,2.338763 -8.132812,7.016601 0.991742,9.355671 15.273884,9.355671 16.265625,0 -0.495871,-4.677838 -4.314517,-7.016601 -8.132813,-7.016601 z m 0,0.742675 c 2.826555,0 5.652122,2.091958 5.15625,6.273926 0.991742,8.363936 -11.305706,8.363936 -10.313965,0 -0.495869,-4.181968 2.33116,-6.273926 5.157715,-6.273926 z M 28.366454,30.591553 c -0.960679,5.534753 -2.851602,10.728554 -5.67334,15.585936 l 2.791993,1.016602 c 0.852249,-4.910041 2.438095,-9.551105 4.754882,-13.927734 4.644266,-0.643904 9.287664,-0.590648 13.932129,0.162597 -2.749557,9.726647 -6.268357,19.171717 -10.564453,28.335938 0.836029,4.668403 0.963793,9.334596 0.388184,14.002441 -4.668445,0.575951 -9.33506,0.449397 -14.003905,-0.386719 v 2.970704 c 5.529533,-0.990252 11.056881,-0.990252 16.586424,0 -0.934429,-5.217811 -0.985807,-10.434236 -0.156738,-15.651856 0.0133,-0.05003 0.02772,-0.09939 0.04102,-0.149414 8.89703,2.516209 17.555771,5.679157 25.981933,9.489258 -1.058659,4.51834 -2.760587,8.801333 -5.112304,12.849609 l 2.791992,1.016602 c 0.960679,-5.534755 2.850126,-10.730019 5.671874,-15.587403 h -0.0015 C 60.37132,68.876706 55.036019,67.194712 49.786864,65.277587 c 2.447858,-8.786338 5.521225,-17.341784 9.227051,-25.669921 2.128328,4.179957 3.598766,8.599199 4.407715,13.259766 5.529536,-0.990251 11.056884,-0.990251 16.586426,0 v -2.970703 c -4.905077,0.878419 -9.808157,0.975912 -14.712891,0.295898 -2.316688,-4.376535 -3.902664,-9.017815 -4.754883,-13.927734 -5.534764,-0.960685 -10.728552,-2.851591 -15.585937,-5.67334 -5.529535,0.99025 -11.058346,0.99025 -16.587891,0 z m 18.309082,3.351561 c 3.614837,0.847231 7.07937,2.10905 10.393067,3.783693 -2.560848,9.12819 -5.802907,18.006388 -9.723633,26.639648 -3.442557,-1.31248 -6.847924,-2.726254 -10.21582,-4.245118 2.525227,-8.965881 5.70823,-17.690175 9.546386,-26.178223 z",
						"m 50.172851,8.5126953 c -3.8183,0 -7.635476,2.3387637 -8.131347,7.0166017 0.991742,9.355692 15.272424,9.355692 16.26416,0 -0.495865,-4.677838 -4.314513,-7.0166017 -8.132813,-7.0166017 z m 0,0.7426758 c 2.826558,0 5.653587,2.0919599 5.157715,6.2739259 0.991742,8.36395 -11.305708,8.36395 -10.313965,0 -0.495871,-4.181966 2.329693,-6.2739259 5.15625,-6.2739259 z M 41.694336,28.496094 c -3.21458,4.617107 -7.129473,8.531996 -11.746582,11.746582 0.991736,5.537854 0.991743,11.073478 0,16.611328 h 2.975097 c -0.922882,-5.153327 -0.985146,-10.3054 -0.190429,-15.458496 2.634635,-3.595487 5.713779,-6.746121 9.235839,-9.454101 0.677354,9.544088 0.612385,19.08734 -0.183105,28.631836 -0.978076,5.428679 -2.851064,10.529589 -5.625,15.304687 2.825976,4.864691 4.718535,10.066303 5.680664,15.609375 l 2.796387,-1.016602 c -2.652481,-4.566021 -4.482757,-9.430765 -5.493164,-14.594238 1.009528,-5.158459 2.838863,-10.015963 5.487304,-14.578125 3.584157,-0.414976 7.167816,-0.414602 10.751954,0.0015 2.648077,4.56183 4.476404,9.418629 5.485839,14.57666 -1.0104,5.163474 -2.842148,10.028218 -5.494629,14.594238 l 2.796387,1.016567 C 59.133026,85.944227 61.027044,80.742621 63.853027,75.87793 61.058271,71.066997 59.176438,65.924575 58.20459,60.450196 57.418773,50.946392 57.357274,41.444825 58.031738,31.941407 c 3.522318,2.708084 6.602496,5.858406 9.237305,9.454101 0.794709,5.153096 0.730987,10.305169 -0.191895,15.458496 h 2.975098 c -0.991716,-5.537851 -0.99171,-11.073475 0,-16.611328 -4.61711,-3.214586 -8.531975,-7.129473 -11.746582,-11.746582 -5.537837,0.991703 -11.073472,0.991703 -16.611328,0 z m 8.563476,2.238281 c 1.842644,0.0084 3.600969,0.127349 5.280762,0.328125 0.70893,9.361903 0.711208,18.722095 0.0029,28.083985 -3.693262,0.441967 -7.386745,0.447285 -11.080078,0.0059 -0.708938,-9.361983 -0.700765,-18.72056 0.0073,-28.082519 2.018593,-0.241149 3.946418,-0.343849 5.789062,-0.33545 z"
					]}
					onPress={async () => {
						const { granted: locGranted } = await ExpoLocation.getForegroundPermissionsAsync();
						if (locGranted) {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							SetYouAreHere(!YouAreHere);
							if (!YouAreHere) {
								(async () => {
									await Geolocate();
									ActiveCity.setNextBodyTimes();
									await ScheduleNotifs();
								})();
							}
							WriteNewSaveToFile(); //^ Save write
						}
						else locAlert();

						cityInputRef.current?.blur();
						setIsCityInputFocused(false);
					}}
				/>

				<Reanimated.View
					style={[styles.citySearchContainer, youAreHereInputAnimStyle]}
					onLayout={(evt) => {
						const layout = evt.nativeEvent.layout;
						const offset = layout.y + cityInputHeight;
						setCityScrollOffset(offset);
					}}
				>
					<View style={{
						position: "relative",
						flexDirection: "row",
						alignItems: "center"
					}}>
						<ReanimatedPressable
							style={[styles.cityInputWrapper, cityInputWrapperAnimStyle]}
							onPress={handleCityInputPress}
						>
							<Svg style={styles.citySearchSvg} viewBox="0 0 100 100">
								<Path
									fill={bodyTextColor}
									stroke={bodyTextColor}
									strokeWidth={3}
									d="M 43.056322,11.247625 C 27.082725,11.247625 11.109248,21.434942 10,41.808696 11.607136,71.32412 44.413143,79.45141 63.217652,66.203347 71.984049,72.313459 79.343296,79.82704 85.294874,88.752375 L 90,84.047247 C 81.202609,78.178277 73.773523,70.937379 67.706234,62.334276 72.447003,57.349296 75.638755,50.511773 76.112644,41.808696 75.003396,21.434942 59.029919,11.247625 43.056322,11.247625 Z m 0,1.664934 c 13.755103,0 27.510137,9.631628 26.400889,28.896137 2.218495,38.524688 -55.020272,38.524688 -52.801777,0 C 15.546186,22.544187 29.30122,12.912559 43.056322,12.912559 Z"
								/>
							</Svg>

							<TextInput
								ref={cityInputRef}
								style={styles.cityInput}
								placeholder="Search for a city"
								placeholderTextColor={bodyTextColor}
								value={cityInputValue}
								onPress={handleCityInputPress}
								onChangeText={(newValue) => {
									setCityInputValue(newValue);
									handleCitySearch(newValue);
								}}
								onSubmitEditing={() => {
									setIsCityInputFocused(false);
								}}
							>
							</TextInput>
						</ReanimatedPressable>

						<Reanimated.View
							style={[styles.cityInputCancelBtnContainer, cityInputFadeAnimStyle]}
							onLayout={(evt) => {
								const layout = evt.nativeEvent.layout;
								setCityInputCancelBtnWidth(layout.width);
							}}
						>
							<TouchableOpacity
								style={styles.cityInputCancelBtn}
								onPress={() => {
									cityInputRef.current?.blur();
									setIsCityInputFocused(false);
								}}
							>
								<Text style={[
									styles.cityInputCancelBtnText,
									{ color: bodyTextColor, borderBottomColor: bodyTextColor }
								]}>Cancel</Text>
							</TouchableOpacity>
						</Reanimated.View>
					</View>

					<Reanimated.View style={[
						styles.cityResultScrollViewContainer,
						cityInputFadeAnimStyle,
						{ height: GLOBAL.slot.height }
					]}>
						<ScrollView
							ref={cityResultScrollViewRef}
							style={[
								styles.cityResultScrollView,
								{ maxHeight: GLOBAL.screen.height - GLOBAL.screen.topOffset - cityScrollOffset - keyboardHeight }
							]}
							contentContainerStyle={{
								paddingTop: GLOBAL.screen.horizOffset,
								paddingBottom: 4 * GLOBAL.screen.horizOffset,
							}}
							showsVerticalScrollIndicator={false}
							keyboardShouldPersistTaps="handled"
						>
							{cityResults.map((city, i) => (
								<TouchableOpacity
									key={`city-result${i}`}
									style={styles.cityResult}
									onPress={() => {
										const newCity = new GLOBAL.City(city.name, city.fullName, city.lat, city.lng);
										newCity.setNextBodyTimes();
										SetActiveCity(newCity);
										WriteNewSaveToFile(); //^ Save write
										cityInputRef.current?.blur();
										setIsCityInputFocused(false);
										setCityInputValue("");
										setCityResults([]);
									}}
								>
									<Text style={styles.cityResultText} numberOfLines={1}>
										{cityResults[i].fullName.join(", ")}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</Reanimated.View>
				</Reanimated.View>

				<View style={[styles.map, { zIndex: (YouAreHere) ? 9999 : 9995 }]}>
					<View style={[styles.mapTileContainer, GLOBAL.ui.antiSkewStyle]}>
						{[...Array(9)].map((item, i) => {
							const x = baseX + (i % 3) - 1;
							const y = baseY + Math.floor(i / 3) - 1;

							// const src = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
							// const src = `https://${s}.tile.openstreetmap.fr/osmfr/${z}/${x}/${y}.png`;
							// const src = `https://${s}.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png`;

							// const src = `https://tile.osm.ch/osm-swiss-style/${z}/${x}/${y}.png`;
							// const src = `https://tile.memomaps.de/tilegen/${z}/${x}/${y}.png`;

							// const src = `https://cartodb-basemaps-${s}.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;
							// const src = `https://cartodb-basemaps-${s}.global.ssl.fastly.net/dark_all/${z}/${x}/${y}.png`;
							// const src = `https://cartodb-basemaps-${s}.global.ssl.fastly.net/light_nolabels/${z}/${x}/${y}.png`;
							const src = `https://cartodb-basemaps-${s}.global.ssl.fastly.net/dark_nolabels/${z}/${x}/${y}.png`;
							// const src = `https://cartodb-basemaps-${s}.global.ssl.fastly.net/rastertiles/voyager/${z}/${x}/${y}.png`;
							// const src = `https://cartodb-basemaps-${s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/${z}/${x}/${y}.png`;
							// const src = `https://cartodb-basemaps-${s}.global.ssl.fastly.net/rastertiles/voyager_labels_under/${z}/${x}/${y}.png`;

							// const src = `https://cdn.lima-labs.com/${z}/${x}/${y}.png?api=demo`;

							return (
								<ExpoImage
									key={`map-tile${i}`}
									style={{
										width: mapTileDimension,
										height: mapTileDimension,
										marginLeft: (i % 3) * -mapTileOverlap,
										marginTop: Math.floor(i / 3) * -mapTileOverlap,
									}}
									source={src}
								/>
							);
						})}
					</View>

					<View style={[styles.mapPin, GLOBAL.ui.btnShadowStyle()]}>
						<Text style={styles.mapPinText}>
							{(YouAreHere) ? "¹ " : ""}
							{(pinName.length > 25) ? pinName.replace(", ", ",\n") : pinName}
							{/* {pinName} */}
						</Text>

						<Svg
							style={{ marginTop: -0.5 }}
							width={pinArrowDimension}
							height={pinArrowDimension}
							viewBox="0 0 100 100"
						>
							<Path
								fill={GLOBAL.ui.palette[2]}
								d="m 0,0 33.355309,50.04028 c 7.916718,11.87419 25.365344,11.87419 33.282061,0 L 100,0 Z"
							/>
						</Svg>
					</View>
				</View>

				<Text style={styles.latLng}>
					{toDMS(ActiveCity.lat, true)}{"\n"}
					{toDMS(ActiveCity.lng, false)}
				</Text>
			</View>

			<SlotBottomShadow />
		</View>
	);
}

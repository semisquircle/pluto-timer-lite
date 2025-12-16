import { RectBtn } from "@/ref/btns";
import * as GLOBAL from "@/ref/global";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Application from "expo-application";
import { useFonts } from "expo-font";
import { Image as ExpoImage } from "expo-image";
import * as ExpoLocation from "expo-location";
import * as Notifications from "expo-notifications";
import { router, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import Reanimated, { Easing, interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";


const ReanimatedSafeAreaView = Reanimated.createAnimatedComponent(SafeAreaView);
const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const ReanimatedExpoImage = Reanimated.createAnimatedComponent(ExpoImage);


//* Tabs
const tabIconDimension = 0.11 * GLOBAL.slot.width;
const tabArray: {
	key: string;
	href: any,
	handlePath: string,
	unpressedSrc: any,
	pressedSrc: any,
	iconPath: string,
	iconStyle: any
}[] = [
	{
		key: "settings",
		href: "/settings",
		handlePath: "M 1.5,14.142578 V 27.95459 a 5.9377066,5.9377066 60.055345 0 0 3.0274581,5.255428 c 9.1605819,4.989489 19.1578649,7.649315 28.1707959,9.005265 a 3.9451158,3.9451158 146.32409 0 0 4.374637,-2.914863 l 2.641327,-9.857188 A 3.0339824,3.0339824 55.695159 0 0 37.142033,25.673234 C 25.37108,24.133885 12.690991,20.203865 5.0348964,12.841826 A 2.046879,2.046879 159.79766 0 0 1.5,14.142578 Z",
		unpressedSrc: require("../assets/images/tabs/unpressed/1.png"),
		pressedSrc: require("../assets/images/tabs/pressed/1.png"),
		iconPath: "m 42.671386,10.000247 c 1.768098,9.96388 -9.903561,14.796885 -15.69873,6.500977 -2.239434,4.740177 -5.730524,8.232733 -10.470703,10.472168 8.295909,5.795167 3.462902,17.465366 -6.500976,15.697265 1.768294,4.935334 1.768294,9.874244 0,14.809571 9.963878,-1.768095 14.796884,9.903563 6.500976,15.69873 l 0.03662,0.03809 0.04248,-0.07617 c 4.622061,2.243128 8.039518,5.695548 10.242188,10.35791 5.795167,-8.295914 17.463898,-3.462909 15.695802,6.500971 4.935332,-1.768294 9.874239,-1.768294 14.80957,0 -1.768099,-9.96388 9.905027,-14.796885 15.700195,-6.500977 2.239434,-4.740179 5.730525,-8.232735 10.470703,-10.472168 -8.295908,-5.795167 -3.464368,-17.465364 6.499512,-15.697265 -1.768294,-4.935332 -1.768294,-9.874241 0,-14.80957 -9.96388,1.768095 -14.79542,-9.903564 -6.499512,-15.698731 l -0.03808,-0.03809 -0.04102,0.07617 c -4.622063,-2.243127 -8.039518,-5.695549 -10.242188,-10.35791 -5.795167,8.295908 -17.465362,3.462904 -15.697265,-6.500977 -4.935333,1.768294 -9.874238,1.768294 -14.809571,0 z m 7.404786,3.979981 c 1.158785,-3.47e-4 2.317371,0.09832 3.476074,0.292969 2.700745,5.387344 8.525312,8.741699 14.4375,8.797851 1.664796,0.01581 3.335521,-0.232876 4.945312,-0.769043 1.850113,1.317347 3.442808,2.892201 4.778321,4.724121 -2.459068,7.336365 1.095025,15.950642 8.0083,19.419434 0.390348,2.318083 0.393708,4.636954 0.0044,6.955078 -6.902442,3.46133 -10.46123,12.052972 -8.028809,19.381348 -1.361961,1.913702 -2.999442,3.552674 -4.911621,4.916015 -1.61114,-0.536714 -3.282327,-0.784867 -4.948242,-0.769043 -5.911705,0.05614 -11.736469,3.408363 -14.4375,8.794922 -2.31737,0.389851 -4.634742,0.390692 -6.952148,0.0015 -2.700745,-5.387345 -8.523847,-8.740236 -14.436036,-8.796387 -1.664796,-0.01581 -3.335521,0.232876 -4.945312,0.769043 -1.850114,-1.317346 -3.442807,-2.893665 -4.77832,-4.725586 2.459068,-7.336364 -1.09649,-15.949177 -8.009765,-19.417968 -0.390253,-2.317524 -0.391959,-4.63605 -0.0029,-6.953614 6.902627,-3.460953 10.457109,-12.052949 8.025878,-19.381347 1.36295,-1.914742 3.003621,-3.553677 4.917481,-4.917481 1.610374,0.536112 3.280272,0.784858 4.945312,0.769043 5.911704,-0.05615 11.735002,-3.408365 14.436035,-8.794922 1.158684,-0.194926 2.317288,-0.29555 3.476075,-0.295898 z M 50,31.999271 c -4.641674,0 -9.289148,1.490397 -12.855469,4.492676 -3.56632,3.002278 -6.032007,7.528039 -6.292969,13.486816 v 0.02051 0.02197 c 0.260962,5.958777 2.726646,10.484668 6.292969,13.486817 3.566324,3.00215 8.2138,4.491211 12.855469,4.491211 4.641667,0 9.289144,-1.489061 12.855468,-4.491211 3.566325,-3.002149 6.032008,-7.52804 6.292969,-13.486817 v -0.02197 -0.02051 C 68.887475,44.019986 66.42179,39.494225 62.855468,36.491947 59.289147,33.489668 54.641672,31.999271 50,31.999271 Z m 0,1.766601 c 3.908002,0 7.808717,1.358302 10.658203,4.048828 2.849486,2.690528 4.676555,6.707021 4.426758,12.161133 l -0.0029,0.02344 0.0029,0.02344 c 0.249798,5.454106 -1.577277,9.473658 -4.426758,12.164058 -2.84948,2.690398 -6.750186,4.047363 -10.658203,4.047363 -3.908017,0 -7.808723,-1.356965 -10.658203,-4.047363 -2.849482,-2.6904 -4.675093,-6.709947 -4.425293,-12.164063 l 0.0015,-0.02344 -0.0015,-0.02344 C 34.666705,44.521726 36.492309,40.505228 39.341797,37.8147 42.191283,35.124174 46.091997,33.765872 50,33.765872 Z",
		iconStyle: {
			marginRight: 0.62 * GLOBAL.slot.width,
			marginTop: 0.155 * GLOBAL.slot.width,
		},
	},
	{
		key: "index",
		href: "/",
		handlePath: "m 72.226066,23.942213 c -9.794274,2.393299 -19.452468,2.798319 -27.101273,2.436052 a 4.3134337,4.3134337 144.35159 0 0 -4.398139,3.154383 l -2.647644,9.883434 a 2.9339568,2.9339568 55.155073 0 0 2.579159,3.704721 c 9.899723,0.76477 27.705655,0.865307 45.001851,-5.494633 a 2.2757039,2.2757039 101.77602 0 0 0.782586,-3.753876 l -8.361287,-8.361287 a 6.1806503,6.1806503 14.998934 0 0 -5.855253,-1.568794 z",
		unpressedSrc: require("../assets/images/tabs/unpressed/2.png"),
		pressedSrc: require("../assets/images/tabs/pressed/2.png"),
		iconPath: GLOBAL.pluto.icon!,
		iconStyle: {
			marginLeft: 0.225 * GLOBAL.slot.width,
			marginTop: 0.24 * GLOBAL.slot.width,
		},
	},
	{
		key: "city",
		href: "/city",
		handlePath: "m 94.970273,12.845933 c -4.005662,3.86178 -9.304268,6.686074 -14.955624,8.750404 a 2.1874173,2.1874173 103.19659 0 0 -0.842021,3.590939 l 8.249959,8.249959 a 4.931536,4.931536 10.090219 0 0 5.651218,1.00564 c 0.804428,-0.395448 1.603862,-0.80732 2.396963,-1.236974 a 5.9240429,5.9240429 119.9826 0 0 3.02972,-5.251311 V 14.142578 a 2.0431601,2.0431601 20.16824 0 0 -3.530215,-1.296645 z",
		unpressedSrc: require("../assets/images/tabs/unpressed/3.png"),
		pressedSrc: require("../assets/images/tabs/pressed/3.png"),
		iconPath: "M 38.082952,12.76415 C 30.137186,19.4677 21.278333,24.582436 11.5,28.111893 c 1.832565,15.347729 1.832565,39.014061 0,54.361791 l 2.74885,4.762166 C 21.442805,81.166575 29.387296,76.403961 38.082952,72.936821 46.778316,76.403936 54.723307,81.16675 61.917053,87.23585 69.86282,80.532296 78.721672,75.417564 88.5,71.888108 86.667441,56.540378 86.667441,32.874045 88.5,17.526317 L 85.751155,12.76415 C 78.557407,18.833249 70.612417,23.596063 61.917053,27.063178 53.22169,23.596063 45.276699,18.833251 38.082952,12.76415 Z M 35.566756,69.166101 C 29.764084,73.710917 23.497821,77.449663 16.763264,80.379832 15.273819,66.657668 15.2459,44.616911 16.686313,30.894746 c 5.844468,-4.588197 12.160835,-8.357162 18.952025,-11.305003 0,0 1.422685,35.823816 -0.07158,49.576358 z m 4.960811,-49.576358 c 6.730297,2.921411 12.994087,6.64905 18.794544,11.18152 1.547095,13.781827 1.61947,35.882222 0.211174,49.664048 C 52.749474,77.496791 46.439067,73.740037 40.599152,69.166101 39.104881,55.413559 39.078994,33.342285 40.527567,19.589743 Z m 42.709177,0.02864 c 1.489572,13.722162 1.517239,35.762919 0.07695,49.485084 C 77.451671,73.705492 71.115275,77.48352 64.300818,80.435313 62.892525,66.653487 62.9649,44.553093 64.511994,30.771266 70.292579,26.254322 76.532683,22.535277 83.236743,19.61838 Z",
		iconStyle: {
			marginLeft: 0.822 * GLOBAL.slot.width,
			marginTop: 0.045 * GLOBAL.slot.width,
		},
	},
];


//* Prompts
const promptContentWidth = GLOBAL.slot.width - (2 * GLOBAL.screen.horizOffset);
const promptBtnHeight = 80;


//* Stylesheet
const styles = StyleSheet.create({
	screen: {
		width: GLOBAL.screen.width,
		height: GLOBAL.screen.height,
	},

	prompt: {
		position: "absolute",
		justifyContent: "space-between",
		alignItems: "center",
		width: GLOBAL.screen.width,
		height: GLOBAL.screen.height,
		paddingTop: promptBtnHeight,
		paddingBottom: promptBtnHeight / 2,
	},

	promptTopContainer: {
		alignItems: "center",
		width: promptContentWidth,
	},

	promptTitle: {
		textAlign: "center",
		width: GLOBAL.slot.width,
		fontFamily: "Trickster-Reg-Semi",
		fontSize: 1.7 * GLOBAL.ui.bodyTextSize,
		color: GLOBAL.ui.palette[0],
	},

	promptImg: {
		width: promptContentWidth,
		height: 0.6 * promptContentWidth,
		borderWidth: GLOBAL.ui.inputBorderWidth,
		borderColor: GLOBAL.ui.palette[0],
		borderRadius: GLOBAL.screen.horizOffset,
		marginTop: GLOBAL.ui.bodyTextSize,
	},

	promptSubtitle: {
		width: "90%",
		textAlign: "center",
		fontFamily: "Trickster-Reg-Semi",
		fontSize: 0.7 * GLOBAL.ui.bodyTextSize,
		color: GLOBAL.ui.palette[0],
		marginTop: GLOBAL.ui.bodyTextSize,
	},

	promptBottomContainer: {
		alignItems: "center",
		width: "100%",
		// marginBottom: promptBtnHeight / 2,
	},

	promptNotNowText: {
		fontFamily: "Trickster-Reg-Semi",
		fontSize: GLOBAL.ui.bodyTextSize,
		color: GLOBAL.ui.palette[0],
		textDecorationLine: "underline",
	},

	slotMask: {
		position: "absolute",
		width: GLOBAL.slot.width,
	},

	slotBG: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundColor: GLOBAL.ui.palette[1],
	},

	tabContainer: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		width: GLOBAL.slot.width,
		height: GLOBAL.nav.height,
	},

	tabImg: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},

	tabIcon: {
		position: "absolute",
		width: tabIconDimension,
		height: tabIconDimension,
	},
});


type PromptTypes = {
	animStyle: any;
	title: string;
	img: any;
	imgColor: any;
	subtitles: string[];
	btn: any;
}
const Prompt = (props: PromptTypes) => {
	return (
		<ReanimatedSafeAreaView style={[styles.prompt, props.animStyle]}>
			<View style={[styles.promptTopContainer, GLOBAL.ui.btnShadowStyle(), GLOBAL.ui.skewStyle]}>
				<Text style={styles.promptTitle}>{ props.title }</Text>

				<ExpoImage
					style={[styles.promptImg, { backgroundColor: props.imgColor }]}
					source={props.img}
					contentFit="cover"
				/>

				{props.subtitles.map((subtitle, s) => (
					<Text key={`prompt-subtitle${s}`} style={styles.promptSubtitle}>{subtitle}</Text>
				))}
			</View>

			<View style={[styles.promptBottomContainer, GLOBAL.ui.skewStyle]}>
				{props.btn}
			</View>
		</ReanimatedSafeAreaView>
	);
}

export default function Layout() {
	//* Screen offset
	const screenInsets = useSafeAreaInsets();


	//* App storage
	const InitDefaultSaveData = GLOBAL.useSaveStore(state => state.initDefaultSaveData);
	const WriteDefaultSaveToFile = GLOBAL.useSaveStore(state => state.writeDefaultSaveToFile);
	const LoadSave = GLOBAL.useSaveStore(state => state.loadSave);
	const IsSaveLoaded = GLOBAL.useSaveStore(state => state.isSaveLoaded);
	const SetIsSaveLoaded = GLOBAL.useSaveStore(state => state.setIsSaveLoaded);
	const WriteNewSaveToFile = GLOBAL.useSaveStore(state => state.writeNewSaveToFile);

	const PromptsCompleted = GLOBAL.useSaveStore(state => state.promptsCompleted);
	const SetPromptCompleted = GLOBAL.useSaveStore(state => state.setPromptCompleted);
	const Geolocate = GLOBAL.useSaveStore(state => state.geolocate);
	const ScheduleNotifs = GLOBAL.useSaveStore(state => state.scheduleNotifs);

	const ActiveTab = GLOBAL.useSaveStore(state => state.activeTab);
	const SetActiveTab = GLOBAL.useSaveStore(state => state.setActiveTab);
	const ActiveCity = GLOBAL.useSaveStore(state => state.activeCity);
	const YouAreHere = GLOBAL.useSaveStore(state => state.youAreHere);


	//* Meat and potatoes
	const [isReadyForSlot, setIsReadyForSlot] = useState(false);

	useEffect(() => {
		GLOBAL.screen.topOffset = screenInsets.top;
		InitDefaultSaveData();

		//? Development
		// WriteDefaultSaveToFile(); //^ Save write
		// SetIsSaveLoaded(true);

		//? Production
		LoadSave();
	}, []);

	useEffect(() => {
		if (IsSaveLoaded && PromptsCompleted[0] && PromptsCompleted[1]) {
			(async () => {
				if (YouAreHere) {
					await Geolocate();
					WriteNewSaveToFile(); //^ Save write
				}
				else ActiveCity.setNextBodyTimes();
				await ScheduleNotifs();
				setIsReadyForSlot(true);
			})();
		}
	}, [IsSaveLoaded, PromptsCompleted]);


	//* Fonts
	const [fontsLoaded, fontsError] = useFonts({
		"Trickster": require("../assets/fonts/Trickster-Reg-Semi.otf"),
		"Hades TallFat": require("../assets/fonts/Hades/Hades-TallFat.ttf"),
		"Hades ShortFat": require("../assets/fonts/Hades/Hades-ShortFat.ttf"),
		"Hades SuperShortFat": require("../assets/fonts/Hades/Hades-SuperShortFat.ttf"),
		"Hades ShortSkinny": require("../assets/fonts/Hades/Hades-ShortSkinny.ttf"),
	});


	//* Tabs
	const [tabBeingPressed, setTabBeingPressed] = useState<number | null>(null);
	const tabBgColor = GLOBAL.pluto.palette[2];
	const tabPressedBgColor = GLOBAL.pluto.palette[3];


	//* Prompts + animations
	// Location
	const [isLocationBtnPressed, setIsLocationBtnPressed] = useState(false);
	const [isLocationBtnActive, setIsLocationBtnActive] = useState(false);
	const locationPromptProgress = useSharedValue(0);
	const locationPromptAnimStyle = useAnimatedStyle(() => {
		return {
			display: (locationPromptProgress.value == 0) ? "none" : "flex",
			opacity: locationPromptProgress.value,
		}
	});

	// Notifications
	const [isNotifBtnPressed, setIsNotifBtnPressed] = useState(false);
	const [isNotifBtnActive, setIsNotifBtnActive] = useState(false);
	const notifPromptProgress = useSharedValue((PromptsCompleted[0] && !PromptsCompleted[1]) ? 1 : 0);
	const notifPromptAnimStyle = useAnimatedStyle(() => {
		return {
			display: (notifPromptProgress.value == 0) ? "none" : "flex",
			opacity: notifPromptProgress.value,
		}
	});

	// Main
	const mainProgress = useSharedValue(0);
	const mainAnimStyle = useAnimatedStyle(() => {
		return {
			display: (mainProgress.value == 0) ? "none" : "flex",
			opacity: mainProgress.value,
		}
	});

	useEffect(() => {
		if (IsSaveLoaded) {
			locationPromptProgress.value = withTiming(
				(PromptsCompleted[0]) ? 0 : 1,
				{ duration: 1000 * GLOBAL.ui.animDuration, easing: Easing.linear }
			);

			if (PromptsCompleted[0] && !PromptsCompleted[1]) {
				notifPromptProgress.value = withDelay(
					1000 * GLOBAL.ui.animDuration,
					withTiming(
						1, { duration: 1000 * GLOBAL.ui.animDuration, easing: Easing.linear }
					)
				);
			}
			else if (PromptsCompleted[0] && PromptsCompleted[1]) {
				notifPromptProgress.value = withTiming(
					0, { duration: 1000 * GLOBAL.ui.animDuration, easing: Easing.linear }
				);
			}

			mainProgress.value = withDelay(
				1000 * GLOBAL.ui.animDuration,
				withTiming(
					(isReadyForSlot) ? 1 : 0,
					{ duration: 2 * 1000 * GLOBAL.ui.animDuration, easing: Easing.linear }
				)
			);
		}
	}, [IsSaveLoaded, PromptsCompleted, isReadyForSlot]);


	//* Components
	return (
		<View style={[styles.screen, { backgroundColor: GLOBAL.pluto.palette[1] }]}>
			<Reanimated.View style={[
				{
					position: "absolute",
					alignItems: "center",
					width: GLOBAL.screen.width,
					height: GLOBAL.screen.height,
				},
				mainAnimStyle
			]}>
				<StatusBar />

				{/* Tab background */}
				<Svg
					style={[styles.tabContainer, { bottom: GLOBAL.screen.bottomOffset }]}
					width={GLOBAL.slot.width}
					height={GLOBAL.nav.height + 1}
					viewBox={`0 0 100 ${GLOBAL.nav.ratio * 100}`}
				>
					<Path
						fill={GLOBAL.ui.palette[0]}
						d="M 0,0 V 28.332031 C 0,30.54117 1.5075156,33.302376 3.4407579,34.370727 19.64974,43.328153 38.346903,45 50,45 61.582973,45 80.314327,43.348091 96.559726,34.370693 98.49297,33.30236 100,30.54117 100,28.332031 V 0 Z"
					/>
				</Svg>

				{/* Tab decorations */}
				{tabArray.map((tab, t) => {
					const tabFillProgress = useSharedValue(0);

					useEffect(() => {
						tabFillProgress.value = withTiming(
							(ActiveTab == t) ? 1 : 0,
							{ duration: 1000 * GLOBAL.ui.animDuration, easing: Easing.out(Easing.cubic) }
						);
					}, [ActiveTab]);

					const tabFillAnimStyle = useAnimatedProps(() => {
						return {
							fill: interpolateColor(
								tabFillProgress.value,
								[0, 1],
								[tabBgColor!, tabPressedBgColor!]
							),
						}
					});

					const tabUnpressedImgAnimStyle = useAnimatedStyle(() => {
						return { opacity: 1 - tabFillProgress.value }
					});

					const tabPressedImgAnimStyle = useAnimatedStyle(() => {
						return { opacity: tabFillProgress.value }
					});

					const tabIconAnimStyle = useAnimatedProps(() => {
						return {
							fill: interpolateColor(
								tabFillProgress.value,
								[0, 1],
								[GLOBAL.ui.palette[0], GLOBAL.pluto.palette[0]]
							),
							stroke: interpolateColor(
								tabFillProgress.value,
								[0, 1],
								[GLOBAL.ui.palette[0], GLOBAL.pluto.palette[0]]
							),
						}
					});

					return (
						<View
							key={`tab${t}`}
							style={[styles.tabContainer, { bottom: GLOBAL.screen.bottomOffset }]}
							pointerEvents="none"
						>
							{/* Tab fills */}
							<Svg
								style={[
									{ width: "100%", height: "100%" },
									(t !== ActiveTab && t !== tabBeingPressed) && GLOBAL.ui.btnShadowStyle()
								]}
								width={GLOBAL.slot.width}
								height={GLOBAL.nav.height + 1}
								viewBox={`0 0 100 ${GLOBAL.nav.ratio * 100}`}
							>
								<ReanimatedPath
									key={`tab-path${tab.key}`}
									animatedProps={tabFillAnimStyle}
									d={tab.handlePath}
								/>
							</Svg>

							{/* Tab aero states */}
							<ReanimatedExpoImage
								style={[styles.tabImg, tabUnpressedImgAnimStyle]}
								source={tab.unpressedSrc}
								contentFit="fill"
							/>
							<ReanimatedExpoImage
								style={[styles.tabImg, tabPressedImgAnimStyle]}
								source={tab.pressedSrc}
								contentFit="fill"
							/>

							{/* Tab icons */}
							<Svg
								style={[
									styles.tabIcon,
									tab.iconStyle,
									GLOBAL.ui.btnShadowStyle(
										(t !== ActiveTab) ? "down" : "middle",
										(t !== ActiveTab) ? "black" : GLOBAL.pluto.palette[1]
									)
								]}
								viewBox="0 0 100 100"
							>
								<ReanimatedPath
									animatedProps={tabIconAnimStyle}
									strokeWidth={2}
									d={tab.iconPath}
								/>
							</Svg>
						</View>
					);
				})}

				{/* Slot mask */}
				<MaskedView
					style={[styles.slotMask, { top: screenInsets.top, height: GLOBAL.slot.height }]}
					maskElement={
						<Svg
							width={GLOBAL.slot.width}
							height={GLOBAL.slot.height}
							viewBox={`0 0 ${GLOBAL.slot.width} ${GLOBAL.slot.height}`}
						>
							<Path d={`
								M 0,${GLOBAL.slot.borderRadius}
								v ${GLOBAL.slot.height - GLOBAL.slot.borderRadius - GLOBAL.slot.ellipseSemiMinor}
								A ${GLOBAL.slot.ellipseSemiMajor} ${GLOBAL.slot.ellipseSemiMinor}
									0 0 0 ${GLOBAL.slot.width},${GLOBAL.slot.height - GLOBAL.slot.ellipseSemiMinor}
								v ${-(GLOBAL.slot.height - GLOBAL.slot.borderRadius - GLOBAL.slot.ellipseSemiMinor)}
								q 0,${-GLOBAL.slot.borderRadius} ${-GLOBAL.slot.borderRadius},${-GLOBAL.slot.borderRadius}
								h ${-(GLOBAL.slot.width - 2 * GLOBAL.slot.borderRadius)}
								q ${-GLOBAL.slot.borderRadius},0 ${-GLOBAL.slot.borderRadius},${GLOBAL.slot.borderRadius}
								z
							`}/>
						</Svg>
					}
				>
					<View style={styles.slotBG} pointerEvents="none"></View>
					{(isReadyForSlot) && <Slot />}
				</MaskedView>

				{/* Tab handles */}
				<View
					style={[styles.tabContainer, { bottom: GLOBAL.screen.bottomOffset }]}
					pointerEvents="box-none"
				>
					{[1,0,2].map((t, i) => (
						<Pressable
							key={`tab-handle${t}`}
							style={[
								{ position: "absolute" },
								(t == 0) && {
									top: "43%",
									left: "-2%",
									width: 0.41 * GLOBAL.slot.width,
									height: "43%",
									// backgroundColor: "#f00a",
									borderTopRightRadius: 0.05 * GLOBAL.slot.width,
									borderBottomLeftRadius: 0.13 * GLOBAL.slot.width,
									borderBottomRightRadius: 0.06 * GLOBAL.slot.width,
									transform: [{ rotate: "18deg" }],
								},
								(t == 1) && {
									right: "13%",
									bottom: "6%",
									width: 0.5 * GLOBAL.slot.width,
									height: "39%",
									// backgroundColor: "#0f0a",
									borderTopLeftRadius: "20%",
									borderTopRightRadius: "40%",
									borderBottomLeftRadius: "20%",
									borderBottomRightRadius: "20%",
									transform: [{ rotate: "-6deg" }],
								},
								(t == 2) && {
									top: "31%",
									right: "-1%",
									width: 0.18 * GLOBAL.slot.width,
									height: "50%",
									// backgroundColor: "#00fa",
									borderTopLeftRadius: "60%",
									borderBottomLeftRadius: "40%",
									transform: [
										{ scaleX: -1 },
										{ rotate: "-60deg" },
									],
								},
							]}
							pointerEvents="auto"
							onPressIn={() => {
								if (t !== ActiveTab) setTabBeingPressed(t);
							}}
							onPress={() => {
								if (t !== ActiveTab) {
									SetActiveTab(t);
									router.replace(tabArray[t].href);
								}
							}}
							onPressOut={() => {
								if (t !== ActiveTab) setTabBeingPressed(null);
							}}
						></Pressable>
					))}
				</View>
			</Reanimated.View>

			<Prompt
				animStyle={notifPromptAnimStyle}
				title="² Notifications"
				img={require("../assets/images/prompts/notifications-shear.jpg")}
				imgColor="#d4d5d0"
				subtitles={[
					`${Application.applicationName} can send notifications to remind you when your next Pluto Time occurs.`,
					"Turning on notifications allows you to receive a reminder for Pluto Times in the first, second, or both halves of the day, helping you make the most of the moment!",
					"This option can be changed later in the Settings app."
				]}
				btn={
					<RectBtn
						text="Continue"
						width={promptContentWidth}
						height={promptBtnHeight}
						borderRadius={GLOBAL.screen.horizOffset}
						isPressed={isNotifBtnPressed}
						isActive={isNotifBtnActive}
						color={GLOBAL.pluto.palette[2]}
						pressedColor={GLOBAL.pluto.palette[3]}
						onPressIn={() => setIsNotifBtnPressed(true)}
						onPress={async () => {
							await Notifications.requestPermissionsAsync();
							SetPromptCompleted(1, true);
							WriteNewSaveToFile(); //^ Save write
						}}
						onPressOut={() => setIsNotifBtnPressed(false)}
					/>
				}
			/>

			<Prompt
				animStyle={locationPromptAnimStyle}
				title="¹ Location Services"
				img={require("../assets/images/prompts/location-shear.jpg")}
				imgColor="black"
				subtitles={[
					`${Application.applicationName} can use your latitude/longitude to\ndetermine your geolocation and solar altitude,\nkind of like a weather app.`,
					"Turning on location services ensures your Pluto Times stay accurate wherever you go!",
					"Your location data won't be used for any other purposes. This option can be changed later in the Settings app."
				]}
				btn={
					<RectBtn
						text="Continue"
						width={promptContentWidth}
						height={promptBtnHeight}
						borderRadius={GLOBAL.screen.horizOffset}
						isPressed={isLocationBtnPressed}
						isActive={isLocationBtnActive}
						color={GLOBAL.pluto.palette[2]}
						pressedColor={GLOBAL.pluto.palette[3]}
						onPressIn={() => setIsLocationBtnPressed(true)}
						onPress={async () => {
							await ExpoLocation.requestForegroundPermissionsAsync();
							SetPromptCompleted(0, true);
							WriteNewSaveToFile(); //^ Save write
						}}
						onPressOut={() => setIsLocationBtnPressed(false)}
					/>
				}
			/>
		</View>
	);
}

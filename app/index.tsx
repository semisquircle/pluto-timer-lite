import * as GLOBAL from "@/ref/global";
import { BodyRotator } from "@/ref/rotators";
import { SlotTopShadow } from "@/ref/slot-shadows";
import { Image as ExpoImage } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Reanimated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Defs, Path, Svg, Text as SvgText, TextPath, TSpan } from "react-native-svg";


export default function HomeScreen() {
	//* App storage
	const ActiveCity = GLOBAL.useSaveStore(state => state.activeCity);
	const YouAreHere = GLOBAL.useSaveStore(state => state.youAreHere);
	const IsFormat24Hour = GLOBAL.useSaveStore(state => state.isFormat24Hour);


	//* Colors
	const bodyTextColor = GLOBAL.pluto.palette[0];
	const activeCityColor = GLOBAL.pluto.palette[1];
	const youAreHereColor = GLOBAL.pluto.palette[2];


	//* Finger animation
	const fingerDimension = 0.25 * GLOBAL.slot.width;
	const fingerTranslateDistance = GLOBAL.slot.width / 3;
	const fingerTheta = GLOBAL.pluto.axialTilt * (Math.PI / 180);
	const fingerDx = Math.cos(fingerTheta);
	const fingerDy = Math.sin(fingerTheta);

	// Timing (in seconds)
	const fingerFadeDuration = 0.5;
	const fingerTranslateDuration = 1;
	const fingerAnimInterval = 30;

	const fingerOpacity = useSharedValue(0);
	const fingerTranslateProgress = useSharedValue(0);

	useEffect(() => {
		fingerOpacity.value = withRepeat(
			withSequence(
				withDelay(1000 * fingerAnimInterval, withTiming(0)),
				withTiming(1, { duration: 1000 * fingerFadeDuration }),
				withTiming(1, { duration: 1000 * fingerTranslateDuration }),
				withTiming(0, { duration: 1000 * fingerFadeDuration }),
			),
			-1,
			false
		);

		fingerTranslateProgress.value = withRepeat(
			withSequence(
				withDelay(1000 * fingerAnimInterval, withTiming(0)),
				withTiming(0, { duration: 1000 * fingerFadeDuration }),
				withTiming(1, { duration: 1000 * fingerTranslateDuration }),
				withTiming(1, { duration: 1000 * fingerFadeDuration }),
			),
			-1,
			false
		);
	}, []);

	const fingerAnimStyle = useAnimatedStyle(() => {
		return {
			opacity: fingerOpacity.value,
			transform: [
				{ translateX: ((fingerTranslateProgress.value * fingerTranslateDistance) - (fingerTranslateDistance / 2)) * fingerDx },
				{ translateY: ((fingerTranslateProgress.value * fingerTranslateDistance) - (fingerTranslateDistance / 2)) * fingerDy },
			],
		};
	});


	//* Text fitting
	const getFontWidth = (text: string, font: GLOBAL.TimeFont) => {
		return text.split("").reduce((w, char, i) => {
			const glyph = font.glyph_widths.find(g => g.char === char);
			return w + glyph!.width + ((i < text.length - 1) ? font.spacing : 0);
		}, 0);
	}

	const getFontSize = (font: GLOBAL.TimeFont, width: number, padding: number) => {
		return ((GLOBAL.slot.width - (2 * padding)) / width) * font.glyph_height;
	}

	const nextBodyTime = (IsFormat24Hour) ? ActiveCity.get24HourClockTime() : ActiveCity.get12HourClockTime();
	const nextBodyDate = ActiveCity.getDateLong();

	let nextBodyTimeFont = GLOBAL.ui.timeFonts[(IsFormat24Hour) ? 2 : 0];
	let nextBodyTimeFontWidth = getFontWidth(nextBodyTime, nextBodyTimeFont);
	if (nextBodyTimeFontWidth < 1.2 * nextBodyTimeFont.glyph_height) {
		nextBodyTimeFont = GLOBAL.ui.timeFonts[1];
		nextBodyTimeFontWidth = getFontWidth(nextBodyTime, nextBodyTimeFont);
	}
	const nextBodyTimeFontSize = getFontSize(nextBodyTimeFont, nextBodyTimeFontWidth, GLOBAL.screen.horizOffset);

	const nowFont = GLOBAL.ui.timeFonts[1];
	const nowFontWidth = getFontWidth("NOW!", nowFont);
	const nowFontSize = getFontSize(nowFont, nowFontWidth, 2 * GLOBAL.screen.horizOffset);

	const locationNameTextOffset = GLOBAL.screen.horizOffset;
	const locationNameTextSize =
		(ActiveCity.name.length > 20) ? GLOBAL.ui.bodyTextSize
		: (ActiveCity.name.length > 10) ? 1.5 * GLOBAL.ui.bodyTextSize
		: 2 * GLOBAL.ui.bodyTextSize;
	const youAreHereTextOffset = locationNameTextOffset + locationNameTextSize + 3;
	const youAreHereTextSize = 0.6 * GLOBAL.ui.bodyTextSize;


	//* Is body time now?
	const [isBodyTimeNow, setIsBodyTimeNow] = useState(ActiveCity.isBodyTimeNow());
	useEffect(() => {
		const untilBodyTime = ActiveCity.nextBodyTimes[0].getTime() - Date.now();
		
		const scheduleBodyTime = setTimeout(() => {
			setIsBodyTimeNow(true);
		}, untilBodyTime);

		const transpireBodyTime = setTimeout(() => {
			ActiveCity.setNextBodyTimes();
			setIsBodyTimeNow(false);
		}, untilBodyTime + GLOBAL.bodyTimeLength);

		return () => {
			if (!isBodyTimeNow) {
				clearTimeout(scheduleBodyTime);
				clearTimeout(transpireBodyTime);
			}
		}
	}, [ActiveCity.nextBodyTimes, isBodyTimeNow]);

	const nextBodyTimeProgress = useSharedValue((isBodyTimeNow) ? 0 : 1);
	const nowProgress = useSharedValue((isBodyTimeNow) ? 1 : 0);
	const bodyTimeAnimDuration = 2 * 1000 * GLOBAL.ui.animDuration;
	useEffect(() => {
		nextBodyTimeProgress.value = withDelay(
			(isBodyTimeNow) ? 0 : bodyTimeAnimDuration,
			withTiming(
				(isBodyTimeNow) ? 0 : 1,
				{ duration: bodyTimeAnimDuration, easing: Easing.linear }
			)
		);

		nowProgress.value = withDelay(
			(isBodyTimeNow) ? bodyTimeAnimDuration : 0,
			withTiming(
				(isBodyTimeNow) ? 1 : 0,
				{ duration: bodyTimeAnimDuration, easing: Easing.linear }
			)
		);
	}, [isBodyTimeNow]);

	const starsAnimStyle = useAnimatedStyle(() => {
		return { opacity: interpolate(nowProgress.value, [0, 1], [0, 0.5]) }
	});

	const nextBodyTimeAnimStyle = useAnimatedStyle(() => {
		return { opacity: nextBodyTimeProgress.value }
	});

	const nowAnimStyle = useAnimatedStyle(() => {
		return { opacity: nowProgress.value }
	});


	//* Stylesheet
	const styles = StyleSheet.create({
		content: {
			alignItems: "center",
			width: GLOBAL.slot.width,
			height: GLOBAL.slot.height,
			overflow: "hidden",
		},

		stars: {
			position: "absolute",
			top: 0,
			width: 0.7 * GLOBAL.slot.height,
			height: GLOBAL.slot.height,
		},

		finger: {
			position: "absolute",
			top: (GLOBAL.slot.width / 3) - (fingerDimension / 2),
			left: (GLOBAL.slot.width / 2) - (0.4 * fingerDimension),
			width: fingerDimension,
			height: fingerDimension,
			zIndex: 9999,
		},

		bodyTimeTextContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
			height: "100%",
			marginBottom: youAreHereTextOffset + youAreHereTextSize,
			// backgroundColor: "pink",
		},

		nextBodyTimeContainer: {
			position: "absolute",
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
			height: "100%",
		},

		nextText: {
			width: "100%",
			textAlign: "center",
			fontFamily: "Trickster-Reg-Semi",
			fontSize: GLOBAL.ui.bodyTextSize,
			color: GLOBAL.ui.palette[0],
		},

		bodyTimeName: {
			fontFamily: "Trickster-Reg-Semi",
			color: bodyTextColor,
		},

		nextBodyTime: {
			width: "100%",
			textAlign: "center",
			fontFamily: "Hades " + nextBodyTimeFont.name,
			fontSize: nextBodyTimeFontSize,
			marginVertical: GLOBAL.screen.horizOffset,
			color: GLOBAL.ui.palette[0],
		},

		nowContainer: {
			position: "absolute",
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
			height: "100%",
		},

		now: {
			width: "100%",
			textAlign: "center",
			fontFamily: "Hades " + nowFont.name,
			fontSize: nowFontSize,
			marginVertical: GLOBAL.screen.horizOffset,
			color: GLOBAL.ui.palette[0],
		},

		dateText: {
			width: "100%",
			textAlign: "center",
			fontFamily: "Trickster-Reg-Semi",
			fontSize: GLOBAL.ui.bodyTextSize,
			marginTop: -0.15 * GLOBAL.ui.bodyTextSize,
			paddingBottom: 0.3 * GLOBAL.ui.bodyTextSize,
			color: GLOBAL.ui.palette[0],
		},

		nextBodyDate: {
			fontFamily: "Trickster-Reg-Semi",
			color: bodyTextColor,
		},

		cityTextContainer: {
			position: "absolute",
			width: "100%",
			height: "100%",
		},
	});


	//* Components
	return (
		<View style={styles.content}>
			<Reanimated.View style={[styles.stars, starsAnimStyle]}>
				<ExpoImage
					style={{ width: "100%", height: "100%" }}
					source={require("../assets/images/stars-combined-compressed.png")}
				/>
			</Reanimated.View>

			<View
				style={[
					{
						position: "absolute",
						left: 0.005 * GLOBAL.slot.width,
						top: 0.38 * GLOBAL.slot.width,
						justifyContent: "center",
						alignItems: "center",
						width: 0.27 * GLOBAL.slot.width,
						height: 0.27 * GLOBAL.slot.width,
						transform: [{ rotate: "-10deg" }],
					},
					GLOBAL.ui.btnShadowStyle(),
				]}
			>
				<Svg
					style={{ position: "absolute" }}
					width="100%"
					height="100%"
					viewBox="0 0 100 100"
				>
					<Path
						fill="transparent"
						stroke={GLOBAL.pluto.palette[0]}
						strokeWidth={1.6}
						d="m 49.999999,18.000333 c -2.615773,0 -6.595655,6.9891 -9.105469,7.58446 -2.509814,0.595361 -10.534824,-3.545989 -12.735351,-2.403501 -2.200527,1.142489 -0.871019,8.76131 -2.583985,10.358369 -1.712966,1.597057 -11.235635,1.617327 -12.322266,3.539571 -1.08663,1.922246 5.130076,7.750701 4.757813,9.842403 -0.372263,2.091701 -8.37031,6.269074 -7.998047,8.360776 0.372263,2.091702 9.502725,4.278811 10.589355,6.201056 1.086631,1.922245 -2.84529,8.929353 -1.132324,10.526411 1.712966,1.59706 10.857091,-0.550783 13.057618,0.591705 2.200527,1.142488 3.581006,8.75474 6.09082,9.350104 2.509814,0.595359 8.766064,-5.204627 11.381836,-5.204627 2.615771,0 8.872021,5.799986 11.381836,5.204627 2.509814,-0.595364 3.891757,-8.207616 6.092285,-9.350104 2.200527,-1.142488 11.344651,1.005355 13.057617,-0.591705 1.712966,-1.597058 -2.218955,-8.604166 -1.132324,-10.526411 1.08663,-1.922245 10.215627,-4.109355 10.587891,-6.201056 0.372262,-2.091702 -7.62432,-6.269074 -7.996583,-8.360776 -0.372262,-2.091702 5.844443,-7.920158 4.757813,-9.842403 -1.086631,-1.922245 -10.610765,-1.942514 -12.32373,-3.539571 -1.712966,-1.597059 -0.381993,-9.21588 -2.58252,-10.358369 -2.200526,-1.142488 -10.227002,2.998862 -12.736817,2.403501 -2.509813,-0.595359 -6.489697,-7.58446 -9.105468,-7.58446 z"
					/>
				</Svg>

				<Text style={[
					{
						textAlign: "center",
						fontFamily: "Trickster-Reg-Semi",
						fontSize: 0.65 * GLOBAL.ui.bodyTextSize,
						lineHeight: 0.7 * GLOBAL.ui.bodyTextSize,
						color: GLOBAL.pluto.palette[0],
					},
					GLOBAL.ui.btnShadowStyle(),
				]}>Lite{"\n"}Version</Text>
			</View>

			<BodyRotator body={GLOBAL.pluto} />

			<Reanimated.View style={[styles.finger, fingerAnimStyle]} pointerEvents="none">
				<ExpoImage
					style={{ width: "100%", height: "100%" }}
					source={require("../assets/images/finger.png")}
				/>
			</Reanimated.View>

			<View style={styles.bodyTimeTextContainer}>
				<Reanimated.View
					style={[styles.nextBodyTimeContainer, GLOBAL.ui.skewStyle, nextBodyTimeAnimStyle]}
					pointerEvents="none"
				>
					<Text style={styles.nextText}>
						{"Your next "}
						<Text style={styles.bodyTimeName}>Pluto Time</Text>
						{" will occur at"}
					</Text>
					<Text style={styles.nextBodyTime} numberOfLines={1}>{nextBodyTime}</Text>
					<Text style={styles.dateText}>
						on <Text style={styles.nextBodyDate}>{nextBodyDate}</Text>
					</Text>
				</Reanimated.View>

				<Reanimated.View
					style={[styles.nowContainer, GLOBAL.ui.skewStyle, GLOBAL.ui.btnShadowStyle(), nowAnimStyle]}
					pointerEvents="none"
				>
					<Text style={[styles.nextText, { fontSize: 1.5 * GLOBAL.ui.bodyTextSize }]}>
						{"It's "}
						<Text style={styles.bodyTimeName}>Pluto Time</Text>
					</Text>
					<Text style={styles.now} numberOfLines={1}>NOW!</Text>
				</Reanimated.View>
			</View>

			{/* Curved city text */}
			<View style={[styles.cityTextContainer, GLOBAL.ui.btnShadowStyle()]} pointerEvents="none">
				<Svg
					width={GLOBAL.slot.width}
					height={GLOBAL.slot.height}
					viewBox={`0 0 ${GLOBAL.slot.width} ${GLOBAL.slot.height}`}
				>
					<Defs>
						<Path id="semi-ellipse-cur-loc" fill="transparent" d={`
							M ${youAreHereTextOffset},${GLOBAL.slot.height - GLOBAL.slot.ellipseSemiMinor}
							A ${GLOBAL.slot.ellipseSemiMajor - youAreHereTextOffset} ${GLOBAL.slot.ellipseSemiMinor - youAreHereTextOffset}
								0 0 0 ${GLOBAL.slot.width - youAreHereTextOffset},${GLOBAL.slot.height - GLOBAL.slot.ellipseSemiMinor}
						`}/>

						<Path id="semi-ellipse-city" fill="transparent" d={`
							M ${locationNameTextOffset},${GLOBAL.slot.height - GLOBAL.slot.ellipseSemiMinor}
							A ${GLOBAL.slot.ellipseSemiMajor - locationNameTextOffset} ${GLOBAL.slot.ellipseSemiMinor - locationNameTextOffset}
								0 0 0 ${GLOBAL.slot.width - locationNameTextOffset},${GLOBAL.slot.height - GLOBAL.slot.ellipseSemiMinor}
						`}/>
					</Defs>

					{(YouAreHere) && 
						<SvgText
							key={`cur-loc-${youAreHereTextOffset}`} //? Forces text update on location change
							fill={youAreHereColor}
							fontFamily="Trickster-Reg-Semi"
							fontSize={youAreHereTextSize}
							letterSpacing="0.5"
							textAnchor="middle"
						>
							<TextPath href="#semi-ellipse-cur-loc" startOffset="56%">
								<TSpan>¹ You are here!</TSpan>
							</TextPath>
						</SvgText>
					}

					<SvgText
						fill={activeCityColor}
						fontFamily="Trickster-Reg-Semi"
						fontSize={locationNameTextSize}
						letterSpacing="1"
						textAnchor="middle"
					>
						<TextPath href="#semi-ellipse-city" startOffset="56%">
							<TSpan>{ActiveCity.name}</TSpan>
						</TextPath>
					</SvgText>
				</Svg>
			</View>

			<SlotTopShadow />
		</View>
	);
}

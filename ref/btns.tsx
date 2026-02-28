import * as GLOBAL from "@/ref/global";
import { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Reanimated, { Easing, interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ClipPath, Defs, LinearGradient, Path, RadialGradient, Rect, Stop, Svg } from "react-native-svg";


const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);
const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const ReanimatedSvg = Reanimated.createAnimatedComponent(Svg);


type RectBtnProps = {
	style?: any;
	text: string;
	width: number;
	height: number;
	borderRadius: number;
	isPressed: boolean;
	isActive: boolean;
	color: any;
	pressedColor: any;
	onPressIn: () => void;
	onPress: () => void;
	onPressOut: () => void;
}
export const RectBtn = (props: RectBtnProps) => {
	const pressProgress = useSharedValue(0);
	useEffect(() => {
		pressProgress.value = withTiming(
			(props.isPressed || props.isActive) ? 1 : 0,
			{ duration: 1000 * GLOBAL.ui.btnAnimDuration, easing: Easing.linear }
		);
	}, [props.isPressed, props.isActive]);
	const animStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: interpolateColor(
				pressProgress.value,
				[0, 1],
				[props.color, props.pressedColor]
			)
		}
	});

	return (
		<ReanimatedPressable
			style={[
				{
					justifyContent: "center",
					alignItems: "center",
					width: props.width,
					height: props.height,
					borderRadius: props.borderRadius,
				},
				props.style,
				(!props.isPressed) && GLOBAL.ui.boxShadowStyle(),
				animStyle,
			]}
			onPressIn={props.onPressIn}
			onPress={props.onPress}
			onPressOut={props.onPressOut}
		>
			<Svg
				style={{ position: "absolute", left: 0 }}
				width="100%"
				height="100%"
				viewBox={`0 0 ${props.width} ${props.height}`}
			>
				<Defs>
					<LinearGradient id="top-blob" x1="0%" x2="0" y1="0%" y2="100%">
						<Stop offset="0%" stopColor="white" stopOpacity="0.7" />
						<Stop offset="100%" stopColor="white" stopOpacity="0" />
					</LinearGradient>

					<RadialGradient id="bottom-blob" cx="50%" cy="100%" r="100%" fx="50%" fy="100%"
						gradientTransform={`matrix(0.5, 0, 0, 1, ${0.25 * (props.width - (2 * GLOBAL.ui.inputBorderWidth))}, 0)`}
					>
						<Stop offset="0%" stopColor="white" stopOpacity="0.7" />
						<Stop offset="100%" stopColor="white" stopOpacity="0" />
					</RadialGradient>

					<ClipPath id="btn-clip">
						<Rect
							fill="transparent"
							x={0}
							y={0}
							width={props.width}
							height={props.height}
							rx={props.borderRadius}
						/>
					</ClipPath>
				</Defs>

				<Rect
					fill="url(#bottom-blob)"
					x={GLOBAL.ui.inputBorderWidth}
					y={GLOBAL.ui.inputBorderWidth}
					width={props.width - (2 * GLOBAL.ui.inputBorderWidth)}
					height={props.height - (2 * GLOBAL.ui.inputBorderWidth)}
					rx={props.borderRadius - GLOBAL.ui.inputBorderWidth}
				/>

				<Rect
					fill="url(#top-blob)"
					x={GLOBAL.ui.inputBorderWidth}
					y={GLOBAL.ui.inputBorderWidth}
					width={props.width - (2 * GLOBAL.ui.inputBorderWidth)}
					height={2 * (props.borderRadius - GLOBAL.ui.inputBorderWidth)}
					rx={props.borderRadius - GLOBAL.ui.inputBorderWidth}
				/>

				<Rect
					fill="transparent"
					stroke="black"
					strokeWidth={2 * GLOBAL.ui.inputBorderWidth}
					opacity="0.25"
					x={0}
					y={0}
					width={props.width}
					height={props.height}
					rx={props.borderRadius}
					clipPath="url(#btn-clip)"
				/>
			</Svg>

			{Array.from({ length: (Platform.OS == "android") ? 2 : 1 }).map((_, i) => (
				<View
					key={`btn-text${i}`}
					style={[
						{ position: "absolute" },
						(i == 0 && Platform.OS == "android") && {
							marginTop: 2 * GLOBAL.ui.inputBorderWidth,
							filter: [{ blur: 2 }],
						}
					]}
				>
					<Text style={[
						{
							...GLOBAL.ui.bodyTextStyle(GLOBAL.ui.bodyTextSize),
							color: (i == 0 && Platform.OS == "android") ? GLOBAL.ui.palette[2] : GLOBAL.ui.palette[0],
						},
						GLOBAL.ui.textShadowStyle()
					]}>
						{props.text}
					</Text>
				</View>
			))}
		</ReanimatedPressable>
	);
}


const toggleBtnWidth = GLOBAL.slot.width - (2 * GLOBAL.screen.horizOffset);
const toggleBtnHeight = 110;
const toggleBtnBorderRadius = GLOBAL.screen.horizOffset;
const toggleBtnIconDimension = 3 * GLOBAL.ui.bodyTextSize;

type ToggleBtnProps = {
	style?: any;
	color: any;
	getter: boolean;
	optionTitles: any[],
	optionIcons?: string[],
	onPress: () => void;
}
export const ToggleBtn = (props: ToggleBtnProps) => {
	const [toggleState, setToggleState] = useState<number | null>(null);
	const toggleBtnProgress = useSharedValue((props.getter) ? 1 : 0);
	useEffect(() => {
		toggleBtnProgress.value = withTiming(
			(props.getter) ? 1 : 0,
			{ duration: 1000 * GLOBAL.ui.animDuration, easing: Easing.inOut(Easing.quad) }
		);
	}, [props.getter]);

	const animStyle = useAnimatedStyle(() => {
		return {
			left: GLOBAL.ui.inputBorderWidth
				+ (toggleBtnProgress.value * ((toggleBtnWidth / 2) - GLOBAL.ui.inputBorderWidth))
		};
	});

	return (
		<Reanimated.View
			style={[
				{
					width: toggleBtnWidth,
					height: toggleBtnHeight,
					borderRadius: toggleBtnBorderRadius,
					transform: [{ scale: (toggleState !== null) ? 1.01 : 1 }],
					overflow: "hidden",
				},
				props.style
			]}
		>
			{props.optionTitles.map((option, f) => (
				<Pressable
					key={`time-format-option-handle${f}`}
					style={{
						position: "absolute",
						top: GLOBAL.ui.inputBorderWidth,
						left: (f == 0) ? GLOBAL.ui.inputBorderWidth : toggleBtnWidth / 2,
						justifyContent: "center",
						alignItems: "center",
						width: (toggleBtnWidth - (2 * GLOBAL.ui.inputBorderWidth)) / 2,
						height: toggleBtnHeight - (2 * GLOBAL.ui.inputBorderWidth),
						// backgroundColor: (toggleState == f) ? GLOBAL.pluto.palette[0] + "22" : "transparent",
						borderRadius: toggleBtnBorderRadius - GLOBAL.ui.inputBorderWidth,
					}}
					onPressIn={() => {
						if (f === (props.getter ? 0 : 1)) setToggleState(f);
					}}
					onPress={props.onPress}
					onPressOut={() => {
						setToggleState(null);
					}}
				></Pressable>
			))}

			<View
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					borderWidth: GLOBAL.ui.inputBorderWidth,
					borderColor: GLOBAL.ui.palette[0],
					borderRadius: toggleBtnBorderRadius,
				}}
				pointerEvents="none"
			></View>

			<ReanimatedSvg
				style={[
					{
						position: "absolute",
						top: GLOBAL.ui.inputBorderWidth,
					},
					animStyle
				]}
				width={(toggleBtnWidth / 2) - GLOBAL.ui.inputBorderWidth}
				height={toggleBtnHeight - (2 * GLOBAL.ui.inputBorderWidth)}
				viewBox={`0 0
					${(toggleBtnWidth / 2) - GLOBAL.ui.inputBorderWidth}
					${toggleBtnHeight - (2 * GLOBAL.ui.inputBorderWidth)}
				`}
			>
				<Defs>
					<LinearGradient id="top-blob" x1="0%" x2="0" y1="0%" y2="100%">
						<Stop offset="0%" stopColor="white" stopOpacity="0.7" />
						<Stop offset="100%" stopColor="white" stopOpacity="0" />
					</LinearGradient>

					<RadialGradient id="bottom-blob" cx="50%" cy="100%" r="100%" fx="50%" fy="100%"
						gradientTransform={`matrix(0.5, 0, 0, 1, ${0.25 * ((toggleBtnWidth / 2) - GLOBAL.ui.inputBorderWidth)}, 0)`}
					>
						<Stop offset="0%" stopColor="white" stopOpacity="0.7" />
						<Stop offset="100%" stopColor="white" stopOpacity="0" />
					</RadialGradient>
				</Defs>

				<Rect
					fill={props.color}
					x={0}
					y={0}
					width={(toggleBtnWidth - (2 * GLOBAL.ui.inputBorderWidth)) / 2}
					height="100%"
					rx={toggleBtnBorderRadius - GLOBAL.ui.inputBorderWidth}
				/>

				<Rect
					fill="url(#bottom-blob)"
					x={0}
					y={0}
					width={(toggleBtnWidth - (2 * GLOBAL.ui.inputBorderWidth)) / 2}
					height="100%"
					rx={toggleBtnBorderRadius - GLOBAL.ui.inputBorderWidth}
				/>

				<Rect
					fill="url(#top-blob)"
					x={0}
					y={0}
					width={(toggleBtnWidth - (2 * GLOBAL.ui.inputBorderWidth)) / 2}
					height={2 * (toggleBtnBorderRadius - GLOBAL.ui.inputBorderWidth)}
					rx={toggleBtnBorderRadius - GLOBAL.ui.inputBorderWidth}
				/>
			</ReanimatedSvg>

			{Array.from({ length: (Platform.OS == "android") ? 2 : 1 }).map((_, i) => {
				return props.optionTitles.map((option, o) => {
					const textAnimStyle = useAnimatedStyle(() => {
						return {
							color: (i == 0 && Platform.OS == "android") ? GLOBAL.ui.palette[2] : interpolateColor(
								o ? toggleBtnProgress.value : 1 - toggleBtnProgress.value,
								[0, 1],
								[props.color, GLOBAL.ui.palette[0]]
							)
						}
					});

					const iconAnimProps = useAnimatedProps(() => {
						return {
							fill: (i == 0 && Platform.OS == "android") ? GLOBAL.ui.palette[2] : interpolateColor(
								o ? toggleBtnProgress.value : 1 - toggleBtnProgress.value,
								[0, 1],
								[props.color, GLOBAL.ui.palette[0]]
							),
							stroke: (i == 0 && Platform.OS == "android") ? GLOBAL.ui.palette[2] : interpolateColor(
								o ? toggleBtnProgress.value : 1 - toggleBtnProgress.value,
								[0, 1],
								[props.color, GLOBAL.ui.palette[0]]
							)
						}
					});

					return (
						<View
							key={`toggle-option-text${o}`}
							style={[
								{
									position: "absolute",
									top: GLOBAL.ui.inputBorderWidth,
									left: (o == 0) ? GLOBAL.ui.inputBorderWidth : toggleBtnWidth / 2,
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									width: (toggleBtnWidth - (2 * GLOBAL.ui.inputBorderWidth)) / 2,
									height: toggleBtnHeight - (2 * GLOBAL.ui.inputBorderWidth),
									marginTop: (i == 0) ? GLOBAL.ui.inputBorderWidth : 0,
									filter: (i == 0 && Platform.OS == "android") ? [{ blur: 2 }] : [],
								},
								GLOBAL.ui.textShadowStyle()
							]}
							pointerEvents="none"
						>
							{(props.optionIcons) && (
								<Svg
									style={{
										marginLeft: -0.3 * toggleBtnIconDimension,
										marginRight: -0.05 * toggleBtnIconDimension,
									}}
									width={toggleBtnIconDimension}
									height={toggleBtnIconDimension}
									viewBox="0 0 100 100"
								>
									<ReanimatedPath
										animatedProps={iconAnimProps}
										strokeWidth={2}
										d={props.optionIcons[o]}
									/>
								</Svg>
							)}

							<View style={{ alignItems: (props.optionIcons) ? "flex-start" : "center" }}>
								<Reanimated.Text
									style={[
										GLOBAL.ui.bodyTextStyle(GLOBAL.ui.bodyTextSize),
										textAnimStyle
									]}
									numberOfLines={1}
								>{option.title}</Reanimated.Text>

								<Reanimated.Text
									style={[
										GLOBAL.ui.bodyTextStyle(0.8 * GLOBAL.ui.bodyTextSize),
										textAnimStyle
									]}
									numberOfLines={1}
								>{option.subtitle}</Reanimated.Text>
							</View>
						</View>
					);
				});
			})}
		</Reanimated.View>
	);
}

import * as GLOBAL from "@/ref/global";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Reanimated, { Easing, interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Circle, ClipPath, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop, Svg } from "react-native-svg";


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
				(!props.isPressed) && GLOBAL.ui.btnShadowStyle(),
				animStyle
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

			<View style={[{ position: "absolute", }, GLOBAL.ui.btnShadowStyle()]}>
				<Text style={{
					fontFamily: "Trickster-Reg-Semi",
					fontSize: GLOBAL.ui.bodyTextSize,
					color: GLOBAL.ui.palette[0],
				}}>
					{ props.text }
				</Text>
			</View>
		</ReanimatedPressable>
	);
}


type CircleBtnProps = {
	style?: any;
	dimension: number;
	isPressed: boolean;
	color: any;
	pressedColor: any;
	onPressIn: () => void;
	onPress: () => void;
	onPressOut: () => void;
	children?: React.ReactNode;
}
export const CircleBtn = (props: CircleBtnProps) => {
	const pressProgress = useSharedValue(0);
	useEffect(() => {
		pressProgress.value = withTiming(
			(props.isPressed) ? 1 : 0,
			{ duration: 1000 * GLOBAL.ui.btnAnimDuration, easing: Easing.linear }
		);
	}, [props.isPressed]);
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
					position: "relative",
					justifyContent: "center",
					alignItems: "center",
					width: props.dimension,
					height: props.dimension,
					borderRadius: "50%",
				},
				props.style,
				(!props.isPressed) && GLOBAL.ui.btnShadowStyle(),
				animStyle
			]}
			onPressIn={props.onPressIn}
			onPress={props.onPress}
			onPressOut={props.onPressOut}
		>
			<Svg
				style={{ position: "absolute" }}
				width="100%"
				height="100%"
				viewBox={`0 0 ${props.dimension} ${props.dimension}`}
			>
				<Defs>
					<LinearGradient id="top-blob" x1="0%" x2="0" y1="0%" y2="100%">
						<Stop offset="0%" stopColor="white" stopOpacity="0.7" />
						<Stop offset="100%" stopColor="white" stopOpacity="0" />
					</LinearGradient>

					<RadialGradient id="bottom-blob" cx="50%" cy="100%" r="100%" fx="50%" fy="100%"
						gradientTransform={`matrix(0.5, 0, 0, 1, ${0.25 * props.dimension}, 0)`}
					>
						<Stop offset="0%" stopColor="white" stopOpacity="0.7" />
						<Stop offset="100%" stopColor="white" stopOpacity="0" />
					</RadialGradient>

					<ClipPath id="inner-clip">
						<Circle
							r={(props.dimension / 2) - GLOBAL.ui.inputBorderWidth}
							cx={props.dimension / 2}
							cy={props.dimension / 2}
						/>
					</ClipPath>

					<ClipPath id="outer-clip">
						<Circle
							r={props.dimension / 2}
							cx={props.dimension / 2}
							cy={props.dimension / 2}
						/>
					</ClipPath>
				</Defs>

				<Circle
					fill="url(#bottom-blob)"
					r={(props.dimension / 2) - GLOBAL.ui.inputBorderWidth}
					cx={props.dimension / 2}
					cy={props.dimension / 2}
					clipPath="url(#inner-clip)"
				/>

				<Ellipse
					fill="url(#top-blob)"
					rx={0.8 * ((props.dimension / 2) - GLOBAL.ui.inputBorderWidth)}
					ry={((props.dimension / 2) - GLOBAL.ui.inputBorderWidth) / 2}
					cx={props.dimension / 2}
					cy={GLOBAL.ui.inputBorderWidth + ((props.dimension / 2) - GLOBAL.ui.inputBorderWidth) / 2}
					clipPath="url(#inner-clip)"
				/>

				<Circle
					fill="transparent"
					stroke="black"
					strokeWidth={2 * GLOBAL.ui.inputBorderWidth}
					opacity="0.25"
					r={props.dimension / 2}
					cx={props.dimension / 2}
					cy={props.dimension / 2}
					clipPath="url(#outer-clip)"
				/>
			</Svg>

			{props.children}
		</ReanimatedPressable>
	);
}


type SemiEllipseBtnProps = {
	style?: any;
	text: string;
	disabledText: string;
	width: number;
	height: number;
	borderRadius: number;
	semiMinor: number;
	disabled: boolean | undefined;
	isPressed: boolean;
	color: any;
	pressedColor: any;
	disabledColor: any;
	onPressIn: () => void;
	onPress: () => void;
	onPressOut: () => void;
}
export const SemiEllipseBtn = (props: SemiEllipseBtnProps) => {
	const pressProgress = useSharedValue(0);
	useEffect(() => {
		pressProgress.value = withTiming(
			(props.isPressed) ? 1 : 0,
			{ duration: 1000 * GLOBAL.ui.btnAnimDuration, easing: Easing.linear }
		);
	}, [props.isPressed]);
	const animProps = useAnimatedProps(() => {
		return {
			fill: interpolateColor(
				pressProgress.value,
				[0, 1],
				[props.color || "transparent", props.pressedColor || "transparent"]
			)
		}
	});

	return (
		<View style={[
			{
				justifyContent: "center",
				alignItems: "center",
				width: props.width,
				height: props.height,
				// backgroundColor: "yellow",
			},
			props.style,
		]}>
			<Svg
				style={[
					{
						position: "absolute",
						width: props.width,
						height: props.height,
					},
					(!props.disabled && !props.isPressed) && GLOBAL.ui.btnShadowStyle(),
				]}
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

					<LinearGradient id="stroke" x1="0%" x2="0" y1="0%" y2="100%">
						<Stop offset="0%" stopColor={(props.disabled) ? props.disabledColor : "black"} stopOpacity={(props.disabled) ? "1" : "0"} />
						<Stop offset="100%" stopColor={(props.disabled) ? props.disabledColor : "black"} stopOpacity={(props.disabled) ? "1" : "0.7"} />
					</LinearGradient>

					<ClipPath id="btn-clip">
						<Path
							fill="transparent"
							d={`
								M 0,${props.borderRadius}
								v ${props.height - props.borderRadius - props.semiMinor}
								A ${props.width / 2} ${props.semiMinor}
									0 0 0 ${props.width},${props.height - props.semiMinor}
								v ${-(props.height - props.borderRadius - props.semiMinor)}
								q 0,${-props.borderRadius} ${-props.borderRadius},${-props.borderRadius}
								h ${-(props.width - (2 * props.borderRadius))}
								q ${-props.borderRadius},0 ${-props.borderRadius},${props.borderRadius}
								z
							`}
						/>
					</ClipPath>
				</Defs>

				{(!props.disabled) &&
					<ReanimatedPath
						animatedProps={animProps}
						d={`
							M 0,${props.borderRadius}
							v ${props.height - props.borderRadius - props.semiMinor}
							A ${props.width / 2} ${props.semiMinor}
								0 0 0 ${props.width},${props.height - props.semiMinor}
							v ${-(props.height - props.borderRadius - props.semiMinor)}
							q 0,${-props.borderRadius} ${-props.borderRadius},${-props.borderRadius}
							h ${-(props.width - (2 * props.borderRadius))}
							q ${-props.borderRadius},0 ${-props.borderRadius},${props.borderRadius}
							z
						`}
					/>
				}

				<Path
					fill="url(#bottom-blob)"
					stroke="url(#stroke)"
					strokeWidth={2 * GLOBAL.ui.inputBorderWidth}
					d={`
						M 0,${props.borderRadius}
						v ${props.height - props.borderRadius - props.semiMinor}
						A ${props.width / 2} ${props.semiMinor}
							0 0 0 ${props.width},${props.height - props.semiMinor}
						v ${-(props.height - props.borderRadius - props.semiMinor)}
						q 0,${-props.borderRadius} ${-props.borderRadius},${-props.borderRadius}
						h ${-(props.width - (2 * props.borderRadius))}
						q ${-props.borderRadius},0 ${-props.borderRadius},${props.borderRadius}
						z
					`}
					clipPath="url(#btn-clip)"
				/>

				<Rect
					fill="url(#top-blob)"
					x={GLOBAL.ui.inputBorderWidth}
					y={GLOBAL.ui.inputBorderWidth}
					width={props.width - (2 * GLOBAL.ui.inputBorderWidth)}
					height={2 * (props.borderRadius - 2 * GLOBAL.ui.inputBorderWidth)}
					rx={props.borderRadius - 2 * GLOBAL.ui.inputBorderWidth}
				/>

				<Path
					fill="transparent"
					d={`
						M 0,${props.borderRadius}
						v ${props.height - props.borderRadius - props.semiMinor}
						A ${props.width / 2} ${props.semiMinor}
							0 0 0 ${props.width},${props.height - props.semiMinor}
						v ${-(props.height - props.borderRadius - props.semiMinor)}
						q 0,${-props.borderRadius} ${-props.borderRadius},${-props.borderRadius}
						h ${-(props.width - (2 * props.borderRadius))}
						q ${-props.borderRadius},0 ${-props.borderRadius},${props.borderRadius}
						z
					`}
					onPressIn={props.onPressIn}
					onPress={props.onPress}
					onPressOut={props.onPressOut}
				/>
			</Svg>

			<View style={{ position: "absolute" }} pointerEvents="none">
				<Text style={[
					{
						fontFamily: "Trickster-Reg-Semi",
						fontSize: GLOBAL.ui.bodyTextSize,
						color: (props.disabled) ? props.disabledColor : GLOBAL.ui.palette[0],
						marginBottom: 0.6 * GLOBAL.ui.bodyTextSize,
					},
					(!props.disabled) && GLOBAL.ui.btnShadowStyle()
				]}>
					{(props.disabled) ? props.disabledText : props.text}
				</Text>
			</View>
		</View>
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

			{props.optionTitles.map((option, i) => {
				const textAnimStyle = useAnimatedStyle(() => {
					return {
						color: interpolateColor(
							i ? toggleBtnProgress.value : 1 - toggleBtnProgress.value,
							[0, 1],
							[props.color, GLOBAL.ui.palette[0]]
						)
					}
				});

				const iconAnimProps = useAnimatedProps(() => {
					return {
						fill: interpolateColor(
							i ? toggleBtnProgress.value : 1 - toggleBtnProgress.value,
							[0, 1],
							[props.color, GLOBAL.ui.palette[0]]
						),
						stroke: interpolateColor(
							i ? toggleBtnProgress.value : 1 - toggleBtnProgress.value,
							[0, 1],
							[props.color, GLOBAL.ui.palette[0]]
						)
					}
				});

				return (
					<View
						key={`time-format-option-text${i}`}
						style={[
							{
								position: "absolute",
								top: GLOBAL.ui.inputBorderWidth,
								left: (i == 0) ? GLOBAL.ui.inputBorderWidth : toggleBtnWidth / 2,
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								width: (toggleBtnWidth - (2 * GLOBAL.ui.inputBorderWidth)) / 2,
								height: toggleBtnHeight - (2 * GLOBAL.ui.inputBorderWidth),
							},
							GLOBAL.ui.btnShadowStyle()
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
									d={props.optionIcons[i]}
								/>
							</Svg>
						)}

						<View style={{ alignItems: (props.optionIcons) ? "flex-start" : "center" }}>
							<Reanimated.Text
								style={[
									{
										fontFamily: "Trickster-Reg-Semi",
										fontSize: GLOBAL.ui.bodyTextSize,
									},
									textAnimStyle
								]}
							>{option.title}</Reanimated.Text>

							<Reanimated.Text
								style={[
									{
										fontFamily: "Trickster-Reg-Semi",
										fontSize: 0.8 * GLOBAL.ui.bodyTextSize,
									},
									textAnimStyle
								]}
							>{option.subtitle}</Reanimated.Text>
						</View>
					</View>
				);
			})}
		</Reanimated.View>
	);
}

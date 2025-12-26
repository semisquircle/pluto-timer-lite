import * as GLOBAL from "@/ref/global";
import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import { useEffect, useState } from "react";
import { PanResponder, View } from "react-native";
import Reanimated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { withPause } from "react-native-redash";
import { Ellipse, Svg } from "react-native-svg";


const bodyFrameWidth = 20;
const bodyFrameHeight = 20;
const totalBodyFrames = bodyFrameWidth * bodyFrameHeight;

type BodyRotatorType = { body: GLOBAL.CelestialBody }
export const BodyRotator = (props: BodyRotatorType) => {
	const [isPlaceholderImgDisplayed, setIsPlaceholderImgDisplayed] = useState<boolean>(false);
	const [isSpriteSheetDisplayed, setIsSpriteSheetDisplayed] = useState<boolean>(false);

	const bodyFrame = useSharedValue(0);
	const bodyFrameOffset = useSharedValue(0);
	const lastBodyFrameOffset = useSharedValue(0);
	const lastBodyFrameInt = useSharedValue(0);
	const dragStartX = useSharedValue(0);
	const dragStartY = useSharedValue(0);
	const isDraggingBody = useSharedValue(false);

	useEffect(() => {
		if (isSpriteSheetDisplayed) {
			bodyFrame.value = withPause(
				withRepeat(
					withTiming(
						totalBodyFrames - 1,
						{ duration: (1000 / GLOBAL.ui.fps) * totalBodyFrames, easing: Easing.linear }
					),
					-1,
					false
				),
				isDraggingBody
			);
		}
		return () => { bodyFrame.value = bodyFrame.value; }
	}, [isSpriteSheetDisplayed, isDraggingBody]);

	const bodyAnimStyle = useAnimatedStyle(() => {
		const modFrame = (f: number) => ((f % totalBodyFrames) + totalBodyFrames) % totalBodyFrames;
		const frameInt = modFrame(Math.round(bodyFrame.value + bodyFrameOffset.value));
		return {
			left: -(frameInt % bodyFrameWidth) * GLOBAL.slot.width,
			top: -Math.floor(frameInt / bodyFrameWidth) * (GLOBAL.slot.width / 2) - ((props.body.name == "Terra") ? 1 : 0)
		};
	});

	const bodyPanResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => isSpriteSheetDisplayed,
		onPanResponderGrant: (evt) => {
			isDraggingBody.value = true;
			dragStartX.value = evt.nativeEvent.pageX;
			dragStartY.value = evt.nativeEvent.pageY;
		},
		onPanResponderMove: (evt) => {
			const dx = evt.nativeEvent.pageX - dragStartX.value;
			const dy = evt.nativeEvent.pageY - dragStartY.value;
			const theta = (props.body.axialTilt ?? 0) * (Math.PI / 180);
			const offsetAlongTilt = dx * Math.cos(theta) + dy * Math.sin(theta);
			bodyFrameOffset.value = (lastBodyFrameOffset.value + (offsetAlongTilt / 2)) % totalBodyFrames;

			const modFrame = (f: number) => ((f % totalBodyFrames) + totalBodyFrames) % totalBodyFrames;
			const bodyFrameInt = modFrame(Math.round(bodyFrame.value + bodyFrameOffset.value));
			if (Math.abs(bodyFrameInt - lastBodyFrameInt.value) > 0) {
				lastBodyFrameInt.value = bodyFrameInt;
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
			}
		},
		onPanResponderRelease: () => {
			lastBodyFrameOffset.value = bodyFrameOffset.value;
			isDraggingBody.value = false;
		},
	});

	return (
		<View
			style={[
				(props.body.name == "Terra") && {
					position: "absolute",
					bottom: 0,
				},
				{
					justifyContent: "center",
					alignItems: "center",
					width: GLOBAL.slot.width,
					height: GLOBAL.slot.width / 2 - 1,
					// backgroundColor: "#111",
					overflow: "hidden",
				}
			]}
		>
			<Svg
				style={[
					{
						position: "absolute",
						top: (props.body.name == "Terra") ? -1 : -GLOBAL.slot.width / 2 - 1,
					},
					GLOBAL.ui.btnShadowStyle()
				]}
				width={GLOBAL.slot.width}
				height={GLOBAL.slot.width}
				viewBox={`0 0 ${GLOBAL.slot.width} ${GLOBAL.slot.width}`}
			>
				<Ellipse
					fill={props.body.colors[2]}
					cx={GLOBAL.slot.width / 2}
					cy={GLOBAL.slot.width / 2 + ((props.body.name == "Terra") ? 1 : -1)}
					rx={GLOBAL.slot.width / 2 - 1}
					ry={GLOBAL.slot.width / 2 - 1}
					{...((props.body.name == "Pluto") && bodyPanResponder.panHandlers)}
				/>
			</Svg>

			{(!isSpriteSheetDisplayed) && (
				<ExpoImage
					style={{
						position: "absolute",
						top: (props.body.name == "Terra") ? -1 : -GLOBAL.slot.width / 2 - 1,
						width: GLOBAL.slot.width,
						height: GLOBAL.slot.width,
					}}
					source={props.body.thumbnail}
					pointerEvents="none"
					cachePolicy="memory"
					onDisplay={() => setIsPlaceholderImgDisplayed(true)}
				/>
			)}

			{(isPlaceholderImgDisplayed) && (
				<Reanimated.View //? Don't you dare make this ReanimatedExpoImage
					style={[
						{
							position: "absolute",
							width: bodyFrameWidth * GLOBAL.slot.width,
							height: bodyFrameHeight * (GLOBAL.slot.width / 2),
						},
						bodyAnimStyle
					]}
					pointerEvents="none"
				>
					<ExpoImage
						style={{ width: "100%", height: "100%" }}
						source={props.body.spriteSheet}
						pointerEvents="none"
						contentFit="fill"
						cachePolicy="none"
						onDisplay={() => setIsSpriteSheetDisplayed(true)}
					/>
				</Reanimated.View>
			)}
		</View>
	);
}

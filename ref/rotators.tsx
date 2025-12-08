import * as GLOBAL from "@/ref/global";
import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { PanResponder, View } from "react-native";
import Reanimated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { withPause } from "react-native-redash";
import { Ellipse, Svg } from "react-native-svg";


const bodyFrameWidth = 20;
const bodyFrameHeight = 20;
const totalBodyFrames = bodyFrameWidth * bodyFrameHeight;

export const ActiveBodyRotator = () => {
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
	}, [isSpriteSheetDisplayed, isDraggingBody]);

	const bodyAnimStyle = useAnimatedStyle(() => {
		const modFrame = (f: number) => ((f % totalBodyFrames) + totalBodyFrames) % totalBodyFrames;
		const frameInt = modFrame(Math.round(bodyFrame.value + bodyFrameOffset.value));
		return {
			left: -(frameInt % bodyFrameWidth) * GLOBAL.slot.width,
			top: -Math.floor(frameInt / bodyFrameWidth) * (GLOBAL.slot.width / 2),
		};
	});

	const bodyPanResponder = useMemo(() => {
		return PanResponder.create({
			onStartShouldSetPanResponder: (evt) => {
				if (!isSpriteSheetDisplayed) return false; //? Only allow when sprite sheet is visible
				const a = GLOBAL.slot.width / 2;
				const b = GLOBAL.slot.width / 2;
				const x = evt.nativeEvent.pageX - GLOBAL.screen.horizOffset - a;
				const y = evt.nativeEvent.pageY - GLOBAL.screen.topOffset - GLOBAL.screen.horizOffset;
				const theta = Math.atan2(x, y);
				const r = (a * b) / Math.sqrt(a**2 * Math.sin(theta)**2 + b**2 * Math.cos(theta)**2);
				return Math.sqrt(x**2 + y**2) <= r; //? Only accept touches inside ellipse
			},
			onPanResponderGrant: (evt) => {
				isDraggingBody.value = true;
				dragStartX.value = evt.nativeEvent.pageX;
				dragStartY.value = evt.nativeEvent.pageY;
			},
			onPanResponderMove: (evt) => {
				const dx = evt.nativeEvent.pageX - dragStartX.value;
				const dy = evt.nativeEvent.pageY - dragStartY.value;
				const theta = (GLOBAL.pluto.axialTilt ?? 0) * (Math.PI / 180);
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
	}, [isSpriteSheetDisplayed]);

	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				width: GLOBAL.slot.width,
				height: GLOBAL.slot.width / 2 - 1,
				// backgroundColor: "pink",
				overflow: "hidden",
			}}
			{...bodyPanResponder.panHandlers}
		>
			<Svg
				style={[
					{
						position: "absolute",
						top: -GLOBAL.slot.width / 2,
						// backgroundColor: "lightblue"
					},
					GLOBAL.ui.btnShadowStyle()
				]}
				width={GLOBAL.slot.width}
				height={GLOBAL.slot.width}
				viewBox={`0 0 ${GLOBAL.slot.width} ${GLOBAL.slot.width}`}
			>
				<Ellipse
					fill={GLOBAL.pluto.colors[2]}
					cx={GLOBAL.slot.width / 2}
					cy={GLOBAL.slot.width / 2 - 1}
					rx={GLOBAL.slot.width / 2 - 1}
					ry={GLOBAL.slot.width / 2 - 1}
				/>
			</Svg>

			{(!isSpriteSheetDisplayed) && (
				<ExpoImage
					style={{
						position: "absolute",
						top: -GLOBAL.slot.width / 2 - 1,
						width: GLOBAL.slot.width,
						height: GLOBAL.slot.width,
					}}
					source={GLOBAL.pluto.thumbnail}
					cachePolicy="disk"
					onDisplay={() => {
						setIsPlaceholderImgDisplayed(true);
					}}
				/>
			)}

			{(isPlaceholderImgDisplayed) && (
				<Reanimated.View style={[
					{
						position: "absolute",
						width: bodyFrameWidth * GLOBAL.slot.width,
						height: bodyFrameHeight * (GLOBAL.slot.width / 2),
						// backgroundColor: "lightgreen",
					},
					bodyAnimStyle
				]}>
					<ExpoImage
						style={{
							width: "100%",
							height: "100%",
						}}
						source={GLOBAL.pluto.spriteSheet}
						contentFit="fill"
						cachePolicy="none"
						onDisplay={() => {
							setIsSpriteSheetDisplayed(true);
						}}
					/>
				</Reanimated.View>
			)}
		</View>
	);
}

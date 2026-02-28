import * as GLOBAL from "@/ref/global";
import { Platform, StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";


const shadowWallOffset = 300;
const shadowExtension = GLOBAL.slot.borderRadius + GLOBAL.slot.shadowRadius;

const styles = StyleSheet.create({
	slotShadowContainer: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},

	slotShadowSvg: {
		shadowColor: GLOBAL.ui.palette[1],
		shadowRadius: GLOBAL.slot.shadowRadius,
		shadowOpacity: 1,
		shadowOffset: { width: 0, height: 0 },
	},
});


type SlotTopShadowInterface = { style?: any }
export const SlotTopShadow = (props: SlotTopShadowInterface) => {
	return (
		<View style={[styles.slotShadowContainer, props.style]} pointerEvents="none">
			{Array.from({ length: 4 }).map((_, i) => (
				<View
					key={`shadow-top${i}`}
					style={{
						position: "absolute",
						left: -shadowWallOffset,
						top: -shadowWallOffset,
						width: GLOBAL.slot.width + 2 * shadowWallOffset,
						height: GLOBAL.slot.width + 2 * shadowWallOffset,
						filter: (Platform.OS == "android") ? [{ blur: GLOBAL.slot.shadowRadius }] : []
					}}
				>
					<Svg
						style={styles.slotShadowSvg}
						width="100%"
						height="100%"
						viewBox={`0 0 ${GLOBAL.slot.width + 2 * shadowWallOffset} ${GLOBAL.slot.width + 2 * shadowWallOffset}`}
					>
						<Path
							fill={GLOBAL.ui.palette[1]}
							d={`
								M 0,0
								h ${GLOBAL.slot.width + (2 * shadowWallOffset)}
								v ${(shadowExtension) + shadowWallOffset}
								h ${-shadowWallOffset}
								v ${-shadowExtension + GLOBAL.slot.borderRadius}
								q 0,${-GLOBAL.slot.borderRadius} ${-GLOBAL.slot.borderRadius},${-GLOBAL.slot.borderRadius}
								h ${-GLOBAL.slot.width + (2 * GLOBAL.slot.borderRadius)}
								q ${-GLOBAL.slot.borderRadius},0 ${-GLOBAL.slot.borderRadius},${GLOBAL.slot.borderRadius}
								v ${shadowExtension - GLOBAL.slot.borderRadius}
								h ${-shadowWallOffset}
								z
							`}
						/>
					</Svg>
				</View>
			))}
		</View>
	);
}


type SlotBottomShadowInterface = { style?: any }
export const SlotBottomShadow = (props: SlotBottomShadowInterface) => {
	return (
		<View style={[styles.slotShadowContainer, props.style]} pointerEvents="none">
			{Array.from({ length: 4 }).map((_, i) => (
				<View
					key={`shadow-bottom${i}`}
					style={{
						position: "absolute",
						left: -shadowWallOffset,
						bottom: -shadowWallOffset,
						width: GLOBAL.slot.width + 2 * shadowWallOffset,
						height: GLOBAL.slot.ellipseSemiMinor + shadowWallOffset,
						filter: (Platform.OS == "android") ? [{ blur: GLOBAL.slot.shadowRadius }] : []
					}}
				>
					<Svg
						style={styles.slotShadowSvg}
						width="100%"
						height="100%"
						viewBox={`0 0 ${GLOBAL.slot.width + 2 * shadowWallOffset} ${GLOBAL.slot.ellipseSemiMinor + shadowWallOffset}`}
					>
						<Path
							fill={GLOBAL.ui.palette[1]}
							d={`
								M 0,0
								h ${shadowWallOffset}
								a ${GLOBAL.slot.ellipseSemiMajor} ${GLOBAL.slot.ellipseSemiMinor}
									0 0 0 ${GLOBAL.slot.width},0
								h ${shadowWallOffset}
								v ${GLOBAL.slot.ellipseSemiMinor + shadowWallOffset}
								h ${-(GLOBAL.slot.width + 2 * shadowWallOffset)}
								z
							`}
						/>
					</Svg>
				</View>
			))}
		</View>
	);
}

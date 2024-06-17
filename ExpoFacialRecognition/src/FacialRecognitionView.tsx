import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";
import { ViewProps } from "react-native";

export type OnChangeEvent = {
  embedding: number[],
  error: string,
}

export type Props = {
  onChangeEvent: (event: { nativeEvent: OnChangeEvent }) => void
} & ViewProps;

const NativeView: React.ComponentType<Props> =
  requireNativeViewManager("FacialRecognitionView");

export default function FacialRecognitionView(props: Props) {
  return <NativeView {...props} />;
}
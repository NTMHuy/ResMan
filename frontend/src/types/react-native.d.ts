declare module 'react-native' {
  import type * as React from 'react';

  export type DimensionValue = number | 'auto' | `${number}%`;
  export type ColorValue = string;

  export interface FlexStyle {
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    aspectRatio?: number;
    borderBottomWidth?: number;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderTopWidth?: number;
    borderWidth?: number;
    bottom?: DimensionValue;
    columnGap?: number;
    display?: 'none' | 'flex';
    flex?: number;
    flexBasis?: DimensionValue;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    flexGrow?: number;
    flexShrink?: number;
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
    gap?: number;
    height?: DimensionValue;
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    left?: DimensionValue;
    margin?: DimensionValue;
    marginBottom?: DimensionValue;
    marginHorizontal?: DimensionValue;
    marginLeft?: DimensionValue;
    marginRight?: DimensionValue;
    marginTop?: DimensionValue;
    marginVertical?: DimensionValue;
    maxHeight?: DimensionValue;
    maxWidth?: DimensionValue;
    minHeight?: DimensionValue;
    minWidth?: DimensionValue;
    overflow?: 'visible' | 'hidden' | 'scroll';
    padding?: DimensionValue;
    paddingBottom?: DimensionValue;
    paddingHorizontal?: DimensionValue;
    paddingLeft?: DimensionValue;
    paddingRight?: DimensionValue;
    paddingTop?: DimensionValue;
    paddingVertical?: DimensionValue;
    position?: 'absolute' | 'relative';
    right?: DimensionValue;
    rowGap?: number;
    top?: DimensionValue;
    width?: DimensionValue;
    zIndex?: number;
  }

  export interface TransformStyle {
    transform?: Array<
      | { perspective: number }
      | { rotate: string }
      | { rotateX: string }
      | { rotateY: string }
      | { rotateZ: string }
      | { scale: number }
      | { scaleX: number }
      | { scaleY: number }
      | { translateX: number }
      | { translateY: number }
      | { skewX: string }
      | { skewY: string }
    >;
  }

  export interface ViewStyle extends FlexStyle, TransformStyle {
    backgroundColor?: ColorValue;
    borderBottomColor?: ColorValue;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    borderColor?: ColorValue;
    borderLeftColor?: ColorValue;
    borderRadius?: number;
    borderRightColor?: ColorValue;
    borderStyle?: 'solid' | 'dotted' | 'dashed';
    borderTopColor?: ColorValue;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    cursor?: 'auto' | 'pointer';
    elevation?: number;
    opacity?: number;
    shadowColor?: ColorValue;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
    userSelect?: 'auto' | 'none' | 'text' | 'all';
  }

  export interface TextStyle extends ViewStyle {
    color?: ColorValue;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic';
    fontVariant?: Array<'small-caps' | 'oldstyle-nums' | 'lining-nums' | 'tabular-nums' | 'proportional-nums'>;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    includeFontPadding?: boolean;
    letterSpacing?: number;
    lineHeight?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  }

  export interface ImageStyle extends FlexStyle, TransformStyle {
    backfaceVisibility?: 'visible' | 'hidden';
    backgroundColor?: ColorValue;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    borderColor?: ColorValue;
    borderRadius?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderWidth?: number;
    opacity?: number;
    overflow?: 'visible' | 'hidden';
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    tintColor?: ColorValue;
  }

  export type StyleProp<T> = T | null | undefined | false | Array<StyleProp<T>>;

  export interface ViewProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    testID?: string;
    accessible?: boolean;
    accessibilityLabel?: string;
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  }

  export interface TextProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    selectable?: boolean;
    testID?: string;
  }

  export interface PressableStateCallbackType {
    pressed: boolean;
    hovered?: boolean;
    focused?: boolean;
  }

  export interface PressableProps {
    children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode);
    style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
    onPress?: () => void;
    onLongPress?: () => void;
    disabled?: boolean;
    hitSlop?: number | { top?: number; left?: number; bottom?: number; right?: number };
    accessibilityLabel?: string;
    accessibilityRole?: string;
    testID?: string;
  }

  export interface TextInputProps {
    value?: string;
    defaultValue?: string;
    onChangeText?: (text: string) => void;
    onSubmitEditing?: () => void;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    editable?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;
    style?: StyleProp<TextStyle>;
    testID?: string;
  }

  export type ImageSourcePropType = { uri: string } | number;

  export interface ImageProps {
    source: ImageSourcePropType;
    style?: StyleProp<ImageStyle>;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    onError?: () => void;
    accessibilityLabel?: string;
  }

  export interface ScrollViewProps extends ViewProps {
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  }

  export interface FlatListProps<ItemT> {
    data: ReadonlyArray<ItemT> | null | undefined;
    renderItem: (info: { item: ItemT; index: number }) => React.ReactElement | null;
    keyExtractor?: (item: ItemT, index: number) => string;
    horizontal?: boolean;
    numColumns?: number;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
    columnWrapperStyle?: StyleProp<ViewStyle>;
    ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
    ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
    ItemSeparatorComponent?: React.ComponentType | null;
    style?: StyleProp<ViewStyle>;
  }

  export interface ModalProps {
    visible?: boolean;
    transparent?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
    onRequestClose?: () => void;
    children?: React.ReactNode;
  }

  export interface SwitchProps {
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    disabled?: boolean;
    trackColor?: { false?: ColorValue | null; true?: ColorValue | null };
    thumbColor?: ColorValue;
  }

  export interface ActivityIndicatorProps {
    animating?: boolean;
    color?: ColorValue;
    size?: 'small' | 'large' | number;
    style?: StyleProp<ViewStyle>;
  }

  export const View: React.ComponentType<ViewProps>;
  export const SafeAreaView: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const Pressable: React.ComponentType<PressableProps>;
  export const TouchableOpacity: React.ComponentType<PressableProps>;
  export const TextInput: React.ComponentType<TextInputProps>;
  export const Image: React.ComponentType<ImageProps>;
  export const ScrollView: React.ComponentType<ScrollViewProps>;
  export const Modal: React.ComponentType<ModalProps>;
  export const Switch: React.ComponentType<SwitchProps>;
  export const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>;
  export const Alert: {
    alert: (title: string, message?: string, buttons?: Array<{ text?: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>) => void;
  };
  export function FlatList<ItemT>(props: FlatListProps<ItemT>): React.ReactElement | null;

  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    select: <T>(specifics: Partial<Record<'ios' | 'android' | 'web' | 'default', T>>) => T | undefined;
  };

  export function useWindowDimensions(): {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  };

  type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

  export const StyleSheet: {
    create: <T extends NamedStyles<T> | NamedStyles<Record<string, unknown>>>(styles: T) => T;
    hairlineWidth: number;
  };

  export const AppRegistry: {
    registerComponent: (appKey: string, componentProvider: () => React.ComponentType) => void;
  };

  export const AssetRegistry: {
    registerAsset: (asset: unknown) => number;
    getAssetByID: (assetId: number) => unknown;
  };
}

declare module 'expo-router' {
  import type * as React from 'react';
  export const Stack: React.ComponentType<{ screenOptions?: Record<string, unknown>; children?: React.ReactNode }> & {
    Screen: React.ComponentType<{ name: string; options?: Record<string, unknown> }>;
  };
  export const Slot: React.ComponentType;
  export function Redirect(props: { href: string }): React.ReactElement | null;
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
  };
  export function usePathname(): string;
  export function useFocusEffect(callback: () => void | (() => void)): void;
}

declare module 'react-native-web' {
  export * from 'react-native';
}

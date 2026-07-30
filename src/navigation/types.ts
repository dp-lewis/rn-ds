import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Every route in the app and what it expects. Adding a screen means adding a
 * line here first — that's what makes navigation.navigate type-checked.
 */
export type RootStackParamList = {
  Home: undefined;
  Article: { storyId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

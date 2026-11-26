import { AssetRegistry } from 'react-native-web';

export function getAssetByID(assetId: number) {
  return AssetRegistry.getAssetByID(assetId);
}

export function registerAsset(asset: unknown) {
  return AssetRegistry.registerAsset(asset);
}

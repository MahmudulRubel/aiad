
export enum AdPlatform {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  GOOGLE = 'Google',
  LINKEDIN = 'LinkedIn'
}

export enum AdSize {
  SQUARE = '1:1',
  STORY = '9:16',
  LANDSCAPE = '16:9',
  PORTRAIT = '4:5'
}

export interface BrandKit {
  name: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface AdCreative {
  id: string;
  platform: AdPlatform;
  size: AdSize;
  headline: string;
  primaryText: string;
  cta: string;
  imageUrl: string;
  performanceScore: number;
  timestamp: number;
}

export interface UserState {
  credits: number;
  brandKit: BrandKit;
  creatives: AdCreative[];
}

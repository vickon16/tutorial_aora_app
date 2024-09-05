import { ImagePickerAsset } from "expo-image-picker";
import { Models } from "react-native-appwrite";

export type TUser = {
  accountId: string;
  email: string;
  username: string;
  avatar: string;
};

export type TUserDocument = Models.Document & TUser;

export type TVideo = {
  title: string;
  thumbnail: string;
  prompt: string;
  video: string;
};

export type TVideoDocument = Models.Document &
  TVideo & {
    creator: TUser;
    likedBy: TUser[];
  };

export type TFormVideo = {
  title: string;
  video: ImagePickerAsset | null;
  prompt: string;
  thumbnail: ImagePickerAsset | null;
};

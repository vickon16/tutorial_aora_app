import { DocumentPickerAsset } from "expo-document-picker";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";
import { TFormVideo, TUserDocument, TVideoDocument } from "./types";
import { ImagePickerAsset } from "expo-image-picker";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66d6128c0020f042d346",
  platform: "com.vickonary.aora",
  databaseId: "66d614db001328e0f84a",
  storageId: "66d617a10009703ca31f",
  userCollectionId: "66d61534002a89ccd3cb",
  videoCollectionId: "66d615640032faaef554",
};

const {
  endpoint,
  projectId,
  platform,
  databaseId,
  storageId,
  userCollectionId,
  videoCollectionId,
} = config;

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const db = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error("Failed to create account");
    }

    const avatar = avatars.getInitials(username);
    const session = await signIn(email, password);

    await db.createDocument(databaseId, userCollectionId, ID.unique(), {
      accountId: newAccount.$id,
      email,
      username,
      avatar,
    });

    return session;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const newSession = await account.createEmailPasswordSession(
      email,
      password
    );
    return newSession;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const deleteSessions = async () => {
  try {
    const sessions = await account.listSessions();

    await Promise.all(
      sessions.sessions.map(async (session) => {
        await account.deleteSession(session.$id);
      })
    );
  } catch (error) {
    console.error("Error deleting sessions:", error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    const session = await account.getSession("current");
    return session;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("No account found");
    }

    const currentUser = await db.listDocuments(databaseId, userCollectionId, [
      Query.equal("accountId", currentAccount.$id),
    ]);

    if (!currentUser) {
      throw new Error("No user found");
    }

    return currentUser.documents[0] as TUserDocument;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const getVideos = async () => {
  try {
    const videos = await db.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);
    return videos.documents as TVideoDocument[];
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const getLatestVideos = async () => {
  try {
    const videos = await db.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);
    return videos.documents as TVideoDocument[];
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const getSearchVideos = async (query: string) => {
  try {
    const videos = await db.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    return videos.documents as TVideoDocument[];
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const getUserVideos = async (userId?: string) => {
  try {
    const videos = await db.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId || ""),
      Query.orderDesc("$createdAt"),
    ]);
    return videos.documents as TVideoDocument[];
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

const uploadFile = async (file: ImagePickerAsset, type: "image" | "video") => {
  if (!file) throw new Error("No file selected");

  const asset = {
    uri: file.uri,
    type: file.mimeType || "",
    name: file.fileName || "image-" + Date.now(),
    size: file.fileSize || 0,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    let fileUrl;
    switch (type) {
      case "image":
        fileUrl = storage.getFilePreview(
          storageId,
          uploadedFile.$id,
          2000,
          2000,
          "top" as ImageGravity,
          100
        );
        console.log("1");
        break;
      case "video":
        fileUrl = storage.getFileView(storageId, uploadedFile.$id);
        console.log("2");
        break;
      default:
        throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("Failed to upload file");

    return fileUrl;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to upload file");
  }
};

export const createVideo = async (
  form: TFormVideo & {
    creator: string;
  }
) => {
  const { prompt, title, video: formVideo, thumbnail } = form;
  try {
    if (!prompt || !title || !formVideo || !thumbnail) {
      throw new Error("Invalid upload data");
    }

    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(thumbnail, "image"),
      uploadFile(formVideo, "video"),
    ]);

    const newVideoData = {
      ...form,
      thumbnail: thumbnailUrl,
      video: videoUrl,
    };

    await db.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      newVideoData
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw error;
    throw new Error("Internal server error");
  }
};

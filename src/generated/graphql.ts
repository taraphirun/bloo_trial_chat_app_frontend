export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: "Query";
  _?: Maybe<Scalars["Boolean"]>;
  me?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  user_online?: Maybe<Array<Maybe<User>>>;
  user_typing?: Maybe<Array<Maybe<User>>>;
  messages?: Maybe<Array<Maybe<Message>>>;
  message?: Maybe<Message>;
};

export type QueryUserArgs = {
  id: Scalars["String"];
};

export type QueryMessagesArgs = {
  limit: Scalars["Int"];
  cursor?: Maybe<Scalars["Int"]>;
};

export type QueryMessageArgs = {
  id: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  _?: Maybe<Scalars["Boolean"]>;
  signUpUser: User;
  loginUser: User;
  logoutUser: Scalars["Boolean"];
  updateUser: User;
  deleteUser: User;
  updateUserTyping: Scalars["Boolean"];
  updateUserOnline: Scalars["Boolean"];
  createMessage: Message;
  updateMessage: Message;
  deleteMessage: Scalars["Boolean"];
};

export type MutationSignUpUserArgs = {
  nickname: Scalars["String"];
  username: Scalars["String"];
  password: Scalars["String"];
  first_name?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
};

export type MutationLoginUserArgs = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type MutationUpdateUserArgs = {
  id: Scalars["ID"];
  first_name?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
  nickname?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"];
};

export type MutationCreateMessageArgs = {
  content: Scalars["String"];
};

export type MutationUpdateMessageArgs = {
  id: Scalars["Int"];
  content: Scalars["String"];
};

export type MutationDeleteMessageArgs = {
  id: Scalars["Int"];
};

export type Subscription = {
  __typename?: "Subscription";
  _?: Maybe<Scalars["Boolean"]>;
  userOnline?: Maybe<Array<Maybe<User>>>;
  userTyping?: Maybe<User>;
  messageCreated: Message;
  messageUpdated: Message;
  messageDeleted: Message;
};

export type SubscriptionUserOnlineArgs = {
  id: Scalars["ID"];
};

export type SubscriptionUserTypingArgs = {
  id: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  first_name?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
  nickname: Scalars["String"];
  username: Scalars["String"];
  messages?: Maybe<Array<Maybe<Message>>>;
  created_at: Scalars["String"];
  updated_at: Scalars["String"];
};

export type Token = {
  __typename?: "Token";
  token: Scalars["String"];
};

export type Message = {
  __typename?: "Message";
  id?: Maybe<Scalars["ID"]>;
  content: Scalars["String"];
  user_id: Scalars["String"];
  created_at: Scalars["String"];
  updated_at: Scalars["String"];
  user?: Maybe<User>;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

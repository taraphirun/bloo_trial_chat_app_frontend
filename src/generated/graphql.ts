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
  messages?: Maybe<Array<Maybe<Message>>>;
  message?: Maybe<Message>;
};

export type QueryUserArgs = {
  id: Scalars["String"];
};

export type QueryMessageArgs = {
  id: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  _?: Maybe<Scalars["Boolean"]>;
  signUpUser: Token;
  loginUser?: Maybe<Token>;
  logoutUser: Scalars["Boolean"];
  updateUser: User;
  deleteUser: User;
  createMessage: Message;
  updateMessage: Message;
  deleteMessage: Message;
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
  id: Scalars["ID"];
  content: Scalars["String"];
};

export type MutationDeleteMessageArgs = {
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
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type Token = {
  __typename?: "Token";
  token: Scalars["String"];
};

export type Message = {
  __typename?: "Message";
  id: Scalars["ID"];
  content: Scalars["String"];
  user_id: Scalars["String"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
  user?: Maybe<User>;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

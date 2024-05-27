export interface IFile {
  _id: string;
  filename: string;
  data: {
    data: Buffer;
    type: string;
  };
  contentType: string;
  createdAt:string;
}

export interface IUser {
  _id: string;
  name: string;
  password: string;
  files: IFile[];
  createdAt: string;
  updatedAt: string;
}
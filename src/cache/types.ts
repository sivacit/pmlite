/* eslint-disable @typescript-eslint/naming-convention */
export interface ICacheStore {
  [key: `attachment:signature:${string}`]: IAttachmentSignatureCache;
  [key: `attachment:upload:${string}`]: IAttachmentUploadCache;
  [key: `attachment:local-signature:${string}`]: IAttachmentLocalTokenCache;
  [key: `attachment:preview:${string}`]: IAttachmentPreviewCache;
  [key: `auth:session-user:${string}`]: Record<string, number>;
  [key: `auth:session-expire:${string}`]: boolean;
  [key: `oauth2:${string}`]: IOauth2State;
  [key: `reset-password-email:${string}`]: IResetPasswordEmailCache;
  [key: `workflow:running:${string}`]: string;
  [key: `workflow:repeatKey:${string}`]: string;
  [key: `oauth:code:${string}`]: IOAuthCodeState;
  [key: `oauth:txn:${string}`]: IOAuthTxnStore;
  // userId:tableId:windowId
  [key: `operations:undo:${string}:${string}:${string}`]: IUndoRedoOperation[];
  [key: `operations:redo:${string}:${string}:${string}`]: IUndoRedoOperation[];
  [key: `plugin:auth-code:${string}`]: IPluginAuthStore;
}

export interface IAttachmentSignatureCache {
  path: string;
  bucket: string;
  hash?: string;
}

export interface IAttachmentUploadCache {
  mimetype: string;
  hash: string;
  size: number;
}

export interface IAttachmentLocalTokenCache {
  expiresDate: number;
  contentLength: number;
  contentType: string;
}

export interface IAttachmentPreviewCache {
  url: string;
  expiresIn: number;
}

export interface IOauth2State {
  redirectUri?: string;
}

export interface IResetPasswordEmailCache {
  userId: string;
}

export interface IOAuthCodeState {
  scopes: string[];
  redirectUri: string;
  clientId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IOAuthTxnStore {
  redirectURI: string;
  clientId: string;
  type: string;
  scopes: string[];
  userId: string;
  state?: string;
}

export enum OperationName {
  CreateView = 'createView',
  DeleteView = 'deleteView',
  UpdateView = 'updateView',
  CreateRecords = 'createRecords',
  DeleteRecords = 'deleteRecords',
  UpdateRecords = 'updateRecords',
  UpdateRecordsOrder = 'updateRecordsOrder',
  CreateFields = 'createFields',
  ConvertField = 'convertField',
  DeleteFields = 'deleteFields',
  PasteSelection = 'pasteSelection',
}

export interface IUndoRedoOperationBase {
  name: OperationName;
  params: Record<string, unknown>;
  result?: unknown;
}

export interface IUpdateRecordsOperation extends IUndoRedoOperationBase {
  name: OperationName.UpdateRecords;
  params: {
    tableId: string;
    recordIds: string[];
    fieldIds: string[];
  };
  result: {    
  };
}

export interface IUpdateRecordsOrderOperation extends IUndoRedoOperationBase {
  name: OperationName.UpdateRecordsOrder;
  params: {
    tableId: string;
    viewId: string;
    recordIds: string[];
  };
  result: {
    ordersMap?: {
      [recordId: string]: {
        newOrder?: Record<string, number>;
        oldOrder?: Record<string, number>;
      };
    };
  };
}

export interface IRecord {
  id: string;
  fields: Record<string, unknown>;
}

export interface IDeleteViewOperation extends IUndoRedoOperationBase {
  name: OperationName.DeleteView;
  params: {
    tableId: string;
    viewId: string;
  };
}

export type IUndoRedoOperation =
  | IUpdateRecordsOperation
  | IUpdateRecordsOrderOperation
  | IDeleteViewOperation
export interface IPluginAuthStore {
  baseId: string;
  pluginId: string;
}

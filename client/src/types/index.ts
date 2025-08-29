export interface Todo {
  _id: string;
  title: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  timeAgo?: string;
}

export interface TodoFormData {
  title: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TodoUpdateData {
  title?: string;
  done?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface Notification {
  type: 'success' | 'error';
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string[];
}

export interface UserFileDTO{
  id: number;
  fileName: string;
  filePath: string;
  token?: string;        
  expiresAt: string;      
  fileSize?: number; 
  downloadUrl: string;
  downloadToken:string;
}
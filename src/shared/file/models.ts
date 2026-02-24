export interface ICreateDir {
      user: string;
      path: string;
}

export function encodeFileName(filename: string): string {
      // Кодируем имя файла в UTF-8 и затем в base64
      const encoded = Buffer.from(filename).toString('base64');
      return `=?UTF-8?B?${encoded}?=`;
}

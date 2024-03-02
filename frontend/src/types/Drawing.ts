// NOTE: This is not currently used
// Maybe in the future we will set the bounbdiung box of the drawing
export type TBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TColorUsage = {
  color: string;
  usage: number;
};

export type TCharacter = {
  fullname: string;
  shortname: string;
  likes: string[];
  dislikes: string[];
  fears: string[];
  personality: string[];
  backstory: string;
};

export type TDrawing = {
  id: string;
  url?: string;
  source?: "url" | "file" | "camera";
  content: string;
  style: string;
  items: string[];
  colors: TColorUsage[];
  character: TCharacter;
};

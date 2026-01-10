import mongoose from 'mongoose';

export interface Image {
  fileName: string;
  originalName: string;
}

const imageSchema = new mongoose.Schema<Image>({
  fileName: String,
  originalName: String,
});

export default imageSchema;

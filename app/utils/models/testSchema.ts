import { Schema, model, models } from 'mongoose';

// Blueprints
const testSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// Checks for duplicates before adds to collection
const Test = models.Test || model('Test', testSchema);

export default Test;

const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    enum: ['home', 'about', 'services', 'team', 'contact', 'gallery', 'donations'],
    trim: true,
  },
  section: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  items: [{
    title: String,
    text: String,
    icon: String, // For service snippets, etc.
    imageUrl: String,
  }],
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Add a compound index to ensure a section is unique for each page
pageContentSchema.index({ page: 1, section: 1 }, { unique: true });

const PageContent = mongoose.model('PageContent', pageContentSchema);

module.exports = PageContent;

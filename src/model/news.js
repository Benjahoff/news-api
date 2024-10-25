import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  urlToImage: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true
  }
});

const News = mongoose.model('News', newsSchema);

class NewsModel {
  // Obtener todas las noticias
  static async getAll(page = 1, limit = 10, sortBy = 'publishedAt', sortOrder = 'desc') {
    try {
      const skip = (page - 1) * limit;

      const news = await News.find()
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)  
        .limit(limit); 
      const totalNews = await News.countDocuments();

      return {
        data: news,
        totalNews,
        totalPages: Math.ceil(totalNews / limit),
        currentPage: page
      };
    } catch (error) {
      throw new Error('Failed to retrieve news with pagination and sorting. Please try again later.');
    }
  }

  // Obtener una noticia por su ID
  static async getById(id) {
    try {
      const news = await News.findById(id); 
      return news ? [news] : [];
    } catch (error) {
      throw new Error('Failed to retrieve that news. Please try again later.');
    }
  }

  // Guardar una nueva noticia
  static async saveNews(newsData) {
    try {
      const news = new News(newsData); 
      await news.save();
      return news;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to save that news. Please try again later.');
    }
  }

  // Actualizar una noticia por su ID
  static async updateNews(id, newsData) {
    try {
      const updatedNews = await News.findByIdAndUpdate(id, newsData, { new: true });
      if (!updatedNews) {
        throw new Error('News not found or nothing to update');
      }
      return updatedNews;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update that news. Please try again later.');
    }
  }

  // Eliminar una noticia por su ID
  static async deleteNews(id) {
    try {
      const result = await News.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw new Error('Failed to delete that news. Please try again later.');
    }
  }
}

export default NewsModel;

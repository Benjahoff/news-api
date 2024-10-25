import NewsModel from '../model/news.js';
import { validateNew, validatePartialNew } from '../schemas/news.js';

class NewsController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 10; 
      const sortBy = req.query.sortBy || 'publishedAt'; 
      const sortOrder = req.query.order || 'desc'; 

      
      const result = await NewsModel.getAll(page, limit, sortBy, sortOrder);

      res.status(200).json({
        message: 'Noticias recuperadas exitosamente.',
        data: result.data,
        totalNews: result.totalNews,
        totalPages: result.totalPages,
        currentPage: result.currentPage
      });
    } catch (error) {
      res.status(500).json({
        message: 'Ocurrió un error al recuperar las noticias',
        error: error.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const news = await NewsModel.getById(id); 

      if (!news) {
        return res.status(404).json({
          message: 'News not found'
        });
      }

      res.status(200).json({
        message: 'News retrieved successfully',
        data: news
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the news',
        error: error.message
      });
    }
  }

  static async saveNews(req, res) {
    try {
      const result = validateNew(req.body);
      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
      }

      const news = await NewsModel.saveNews(result.data);

      if (!news) {
        return res.status(404).json({
          message: 'It was not possible to save the news'
        });
      }

      res.status(200).json({
        message: 'News saved successfully',
        news
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while saving the news',
        error: error.message
      });
    }
  }

  static async updateNews(req, res) {
    try {
      const { id } = req.params;
      const result = validatePartialNew(req.body);

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
      }

      const news = await NewsModel.updateNews(id, result.data); 

      if (!news) {
        return res.status(404).json({
          message: 'It was not possible to update the news'
        });
      }

      res.status(200).json({
        message: 'News updated successfully',
        news
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while updating the news',
        error: error.message
      });
    }
  }

  static async deleteNews(req, res) {
    try {
      const { id } = req.params;

      const result = await NewsModel.deleteNews(id);

      if (!result) {
        return res.status(404).json({
          message: 'It was not possible to delete the news'
        });
      }

      res.status(200).json({
        message: 'News deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while deleting the news',
        error: error.message
      });
    }
  }
}

export default NewsController;

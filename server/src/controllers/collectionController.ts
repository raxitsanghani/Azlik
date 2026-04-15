import { Request, Response } from 'express';
import Collection from '../models/Collection';
import { createNotification } from './notificationController';

export const getAllCollections = async (req: Request, res: Response) => {
  try {
    const { all } = req.query;
    const query: any = {};
    if (all !== 'true') {
        query.status = 'Active';
    }

    const collections = await Collection.find(query).populate('relatedProducts').sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching collections', error: error.message });
  }
};

export const getCollectionById = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findById(req.params.id).populate('relatedProducts');
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.status(200).json(collection);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching collection', error: error.message });
  }
};

export const createCollection = async (req: any, res: Response) => {
  try {
    const images: string[] = [];
    
    // Support existing images if any (mostly for duplication/editing)
    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        images.push(...req.body.existingImages);
      } else {
        images.push(req.body.existingImages);
      }
    }
    
    if (req.files && Array.isArray(req.files)) {
      const mainFiles = req.files.filter((f: any) => f.fieldname === 'images' || f.fieldname === 'image');
      const newImages = mainFiles.map((file: any) => file.path);
      images.push(...newImages);
    }

    const { name, description, ...otherData } = req.body;
    
    // Basic validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }

    const collectionData = {
      name,
      description,
      ...otherData
    };

    if (images.length > 0) {
      collectionData.image = images[0];
      collectionData.images = images;
    }

    const collection = new Collection(collectionData);
    await collection.save();

    // Create Notification
    await createNotification({
      title: 'New Collection Added',
      message: `The "${name}" collection was added successfully.`,
      type: 'collection_added',
      metadata: { collectionId: collection._id }
    });
    
    res.status(201).json(collection);
  } catch (error: any) {
    console.error('Create Collection Error:', error);
    res.status(500).json({ 
      message: 'Internal server error while creating collection', 
      error: error.message 
    });
  }
};

export const updateCollection = async (req: any, res: Response) => {
  try {
    const images: string[] = [];
    
    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        images.push(...req.body.existingImages);
      } else {
        images.push(req.body.existingImages);
      }
    }
    
    if (req.files && Array.isArray(req.files)) {
      const mainFiles = req.files.filter((f: any) => f.fieldname === 'images' || f.fieldname === 'image');
      const newImages = mainFiles.map((file: any) => file.path);
      images.push(...newImages);
    }

    const collectionData = { ...req.body };
    if (images.length > 0) {
      collectionData.image = images[0];
      collectionData.images = images;
    }

    const collection = await Collection.findByIdAndUpdate(req.params.id, collectionData, { new: true });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.status(200).json(collection);
  } catch (error: any) {
    console.error('Update Collection Error:', error);
    res.status(500).json({ 
      message: 'Internal server error while updating collection', 
      error: error.message 
    });
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting collection', error: error.message });
  }
};

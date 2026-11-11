const express = require('express');
const router = express.Router();
const { auth, prestataireOnly } = require('../middlewares/auth');
const Service = require('../models/Service');

// Créer un service (prestataire seulement)
router.post('/', auth, prestataireOnly, async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      prestataire: req.user.id
    });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Filtrer les services
router.get('/', async (req, res) => {
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.location) filters.location = new RegExp(req.query.location, 'i');
  
  const services = await Service.find(filters).populate('prestataire');
  res.json(services);
});
router.get('/admin/users', auth, adminOnly, async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  
  // Modérer un service
  router.delete('/admin/services/:id', auth, adminOnly, async (req, res) => {
    try {
      await Service.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Service supprimé' });
    } catch (error) {
      res.status(400).json({ error });
    }
  });
exports.createBooking = async (req, res) => {
    try {
      const booking = new Booking({
        ...req.body,
        client: req.user.id,
        status: 'pending'
      });
      
      const service = await Service.findById(req.body.service);
      if (!service) return res.status(404).json({ msg: 'Service non trouvé' });
  
      await booking.save();
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error });
    }
  };
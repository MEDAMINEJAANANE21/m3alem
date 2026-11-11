exports.register = async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      if (role === 'admin') {
        return res.status(403).json({ msg: 'Création admin non autorisée' });
      }
  
      const user = new User({ email, password, role });
      await user.save();
      
      const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '2h' });
      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
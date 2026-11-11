exports.prestataireOnly = (req, res, next) => {
    if (req.user.role !== 'prestataire') {
      return res.status(403).json({ msg: 'Accès réservé aux prestataires' });
    }
    next();
  };
  
  exports.clientOnly = (req, res, next) => {
    if (req.user.role !== 'client') {
      return res.status(403).json({ msg: 'Accès réservé aux clients' });
    }
    next();
  };
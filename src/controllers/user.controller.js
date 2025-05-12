// src/controllers/user.controller.js
const userService = require('../services/user.service');

async function getRoles(req, res) {
  try {
    const roles = await userService.getUserRoles(req.params.id);
    res.json({ id_usuario: req.params.id, roles });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function updateRoles(req, res) {
  try {
    const roles = await userService.setUserRoles(req.params.id, req.body.roles);
    res.json({ id_usuario: req.params.id, roles });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { getRoles, updateRoles };

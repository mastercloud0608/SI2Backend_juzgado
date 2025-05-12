// src/services/expediente.service.js
const { Op } = require('sequelize');
const { Usuario, Expediente } = require('../models');
const { Cliente, Abogado, Juez } = require('../models');


async function listExpedientes() {
  return Expediente.findAll();
}

async function createExpediente(data) {
  return Expediente.create(data);
}

async function deleteExpediente(id) {
  const expediente = await Expediente.findByPk(id);
  if (!expediente) return null;
  await expediente.destroy();
  return expediente;
}

async function updateExpediente(id, data) {
  const [updatedCount, [updatedExp]] = await Expediente.update(data, {
    where: { numero_expediente: id },
    returning: true
  });
  return updatedCount ? updatedExp : null;
}

async function getExpedientesByAbogado(carnet) {
  return Expediente.findAll({
    where: {
      [Op.or]: [
        { abogado_demandante_carnet: carnet },
        { abogado_demandado_carnet:   carnet }
      ]
    }
  });
}

async function getExpedientesByJuez(carnet) {
  return Expediente.findAll({
    where: { juez_carnet: carnet }
  });
}

async function listClientes() {
  return Cliente.findAll({ attributes: ['id','nombre','carnet_identidad'] });
}

async function listAbogados() {
  return Abogado.findAll({ attributes: ['id','nombre','carnet_identidad'] });
}

async function listJueces() {
  return Juez.findAll({ attributes: ['id','nombre','carnet_identidad'] });
}

async function agregarAbogado(id_expediente, id_usuario) {
  const expediente = await Expediente.findByPk(id_expediente);
  const abogado = await Usuario.findByPk(id_usuario);
  if (!expediente || !abogado) throw new Error('Expediente o Usuario no encontrado');
  await expediente.addAbogado(abogado);
}

async function listarAbogados(id_expediente) {
  const expediente = await Expediente.findByPk(id_expediente, {
    include: { model: Usuario, as: 'abogados', through: { attributes: [] } }
  });
  return expediente.abogados;
}

async function quitarAbogado(id_expediente, id_usuario) {
  const expediente = await Expediente.findByPk(id_expediente);
  const abogado = await Usuario.findByPk(id_usuario);
  if (!expediente || !abogado) throw new Error('No existe');
  await expediente.removeAbogado(abogado);
}

module.exports = {
  listExpedientes,
  createExpediente,
  deleteExpediente,
  updateExpediente,
  getExpedientesByAbogado,
  getExpedientesByJuez,
  listClientes,
  listAbogados,
  listJueces, 
  agregarAbogado, 
  listarAbogados, 
  quitarAbogado
};

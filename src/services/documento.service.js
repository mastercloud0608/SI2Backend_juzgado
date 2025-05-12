// src/services/documento.service.js
const Documento        = require('../models/documento.model');
const DocumentoVersion = require('../models/documentoVersion.model');
const { Op, Sequelize } = require('sequelize');

module.exports = {
  async crearDocumento({ titulo, filename, buffer, tipo_documento, id_expediente, id_usuario }) {
    return Documento.create({
      titulo,
      filename,
      contenido: buffer,
      tipo_documento,
      id_expediente,
      id_usuario
    });
  },

  async listarPorExpediente(id_expediente) {
    return Documento.findAll({
      where: { id_expediente },
      attributes: ['id_documento','titulo','filename','tipo_documento','fecha_subida','firma_digital']
    });
  },

  async obtenerDocumento(id_documento) {
    return Documento.findByPk(id_documento);
  },

  async crearVersion(id_documento, buffer) {
    // contamos cuántas versiones existen para asignar el siguiente número
    const cuenta = await DocumentoVersion.count({ where: { id_documento } });
    return DocumentoVersion.create({
      id_documento,
      numero_version: cuenta + 1,
      contenido: buffer
    });
  },

  async listarVersiones(id_documento) {
    return DocumentoVersion.findAll({
      where: { id_documento },
      attributes: ['id_version','numero_version','fecha_version']
    });
  },

  async obtenerVersion(id_documento, numero_version) {
    return DocumentoVersion.findOne({
      where: { id_documento, numero_version }
    });
  }
};

// src/controllers/documento.controller.js
const documentoService = require('../services/documento.service');

// Subida de documento principal
exports.subirDocumento = async (req, res, next) => {
  try {
    const { titulo, tipo_documento, id_expediente, id_usuario } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ msg: 'Falta el archivo' });

    const doc = await documentoService.crearDocumento({
      titulo,
      filename: file.originalname,
      buffer: file.buffer,
      tipo_documento,
      id_expediente: +id_expediente,
      id_usuario: +id_usuario
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// Listar documentos de un expediente
exports.listarPorExpediente = async (req, res, next) => {
  try {
    const docs = await documentoService.listarPorExpediente(+req.params.id);
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

// Descargar contenido del documento principal
exports.descargarDocumento = async (req, res, next) => {
  try {
    const doc = await documentoService.obtenerDocumento(+req.params.id);
    if (!doc) return res.status(404).end();

    res.set({
      'Content-Disposition': `attachment; filename="${doc.filename}"`,
      'Content-Type': 'application/octet-stream'
    });
    res.send(doc.contenido);
  } catch (err) {
    next(err);
  }
};

// Subir nueva versión
exports.subirVersion = async (req, res, next) => {
  try {
    const id_documento = +req.params.id;
    const file = req.file;
    if (!file) return res.status(400).json({ msg: 'Falta el archivo de versión' });

    const version = await documentoService.crearVersion(id_documento, file.buffer);
    res.status(201).json(version);
  } catch (err) {
    next(err);
  }
};

// Listar versiones
exports.listarVersiones = async (req, res, next) => {
  try {
    const versiones = await documentoService.listarVersiones(+req.params.id);
    res.json(versiones);
  } catch (err) {
    next(err);
  }
};

// Descargar versión específica
exports.descargarVersion = async (req, res, next) => {
  try {
    const { id, numero } = req.params;
    const ver = await documentoService.obtenerVersion(+id, +numero);
    if (!ver) return res.status(404).end();

    // Recuperar también el filename original si quieres
    const orig = await documentoService.obtenerDocumento(+id);
    const name = orig ? orig.filename.replace(/(\.\w+)?$/, `_v${numero}$1`) : `doc_v${numero}`;

    res.set({
      'Content-Disposition': `attachment; filename="${name}"`,
      'Content-Type': 'application/octet-stream'
    });
    res.send(ver.contenido);
  } catch (err) {
    next(err);
  }
};

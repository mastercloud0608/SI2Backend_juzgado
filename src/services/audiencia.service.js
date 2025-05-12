// src/services/audiencia.service.js
const { Audiencia } = require('../models/audiencia.model'); // models/index.js
const { Usuario, AudienciaParte } = require('../models');

/**
 * Crea una nueva audiencia
 * @param {Object} data { fecha, hora, expedienteId, sala, descripcion, estado }
 * @returns {Promise<Audiencia>}
 */
async function createAudiencia(data) {
  // Sequelize mapeará los campos automáticamente
  const nueva = await Audiencia.create({
    fecha:        data.fecha,
    hora:         data.hora,
    expedienteId: data.expedienteId,
    sala:         data.sala,
    descripcion:  data.descripcion,
    estado:       data.estado || 'programada',
  });
  return nueva;
}

async function listAudiencias() {
  return Audiencia.findAll({
    order: [
      ['fecha', 'ASC'],
      ['hora',  'ASC']
    ]
  });
}

async function getAudienciaById(id) {
  return Audiencia.findByPk(id);
}

async function updateAudiencia(id, data) {
  const [n, [updated]] = await Audiencia.update(
    data,
    {
      where: { id },
      returning: true
    }
  );
  return n ? updated : null;
}

async function deleteAudiencia(id) {
  const n = await Audiencia.destroy({ where: { id } });
  return Boolean(n);
}

async function resolverAudiencia(id, { resultado }) {
  const audiencia = await Audiencia.findByPk(id);
  if (!audiencia) throw new Error('Audiencia no encontrada');

  audiencia.estado = 'resuelta';
  audiencia.resultado = resultado;
  audiencia.fechaResolucion = new Date();

  await audiencia.save();
  return audiencia;
}

async function addParte(audId, parteId) {
  const aud   = await Audiencia.findByPk(audId);
  const parte = await ParteInvolucrada.findByPk(parteId);
  if (!aud || !parte) throw new Error('Audiencia o Parte no existe');
  await aud.addParteInvolucrada(parte);
  return;
}

async function listPartes(audId) {
  const aud = await Audiencia.findByPk(audId, {
    include: { model: ParteInvolucrada, through: { attributes: [] } }
  });
  return aud ? aud.ParteInvolucradas : [];
}

async function removeParte(audId, parteId) {
  const aud   = await Audiencia.findByPk(audId);
  const parte = await ParteInvolucrada.findByPk(parteId);
  if (!aud || !parte) throw new Error('No existe');
  await aud.removeParteInvolucrada(parte);
  return;
}

async function addUsuarioAudiencia(id_audiencia, id_usuario, rol_en_audiencia) {
  const audiencia = await Audiencia.findByPk(id_audiencia);
  const usuario = await Usuario.findByPk(id_usuario);
  if (!audiencia || !usuario) throw new Error('Usuario o Audiencia no existe');

  await audiencia.addUsuario(usuario, {
    through: { rol_en_audiencia }
  });
  return;
}


module.exports = {
  createAudiencia,
  listAudiencias,
  getAudienciaById,
  updateAudiencia,
  deleteAudiencia,
  resolverAudiencia,
  addParte,
  listPartes,
  removeParte,
  addUsuarioAudiencia
};

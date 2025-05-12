// src/services/abogado.service.js

// Lista todos los abogados
async function listAbogados() {
  return Abogado.findAll({ attributes: ['id','nombre','apellido','carnet_identidad','email'] });
}

// Obtiene un abogado por ID
async function getAbogado(id) {
  return Abogado.findByPk(id);
}

// Crea un nuevo abogado
async function createAbogado(data) {
  return Abogado.create(data);
}

// Actualiza un abogado existente
async function updateAbogado(id, data) {
  const [updated, [abogado]] = await Abogado.update(data, {
    where: { id },
    returning: true
  });
  return updated ? abogado : null;
}

// Elimina un abogado
async function deleteAbogado(id) {
  const abogado = await Abogado.findByPk(id);
  if (!abogado) return null;
  await abogado.destroy();
  return abogado;
}

// Perfil: abogado + sus expedientes (demandante o demandado)
async function getPerfilAbogado(id) {
  const abogado = await Abogado.findByPk(id);
  if (!abogado) return null;
  const expedientes = await Expediente.findAll({
    where: {
      [Expediente.sequelize.Op.or]: [
        { abogado_demandante_carnet: abogado.carnet_identidad },
        { abogado_demandado_carnet:   abogado.carnet_identidad }
      ]
    }
  });
  return { abogado, expedientes };
}

module.exports = {
  listAbogados,
  getAbogado,
  createAbogado,
  updateAbogado,
  deleteAbogado,
  getPerfilAbogado
};

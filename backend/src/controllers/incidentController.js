const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {

  async index(request, response) {
    const [count] = await connection('incidents').count();

    const { page = 1 } = request.query;
    const incidents = await connection('incidents')
    .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
    .limit(5)
    .offset((page -1) * 5)
    .select('incidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf');

    response.header('X-Total-Count', count['count(*)']);
    return response.json(incidents);
  },

  async create(request, response){
    const {title, description, value} = request.body;
    const ong_id = request.headers.authorization;
    try{
      const [id] = await connection('incidents').insert({
        title,
        description,
        value,
        ong_id
      });
      return response.json({id});
    } catch (err){
      return response.status(400).send({error: 'Registration failed'});
    }
    return response.json({ id });
  },

  async delete(request, response){
    const { id } = request.params;
    const ong_id = request.headers.authorization;
    const incitent = await connection('incidents')
    .where('id', id)
    .select('ong_id')
    .first();

    if(incitent.ong_id != ong_id)
      return response.status(401).send({error: 'Operation not permitted '});

    await connection('incidents').where('id', id).delete();
    return response.status(204).send();
  }
};

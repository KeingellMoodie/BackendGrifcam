const supabase = require('../config/db');

const PoliticasModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('politicas')
      .select('*')
      .order('orden', { ascending: true });
    if (error) throw error;
    return data;
  },
  async update(id, { titulo, contenido }) {
    const { data, error } = await supabase
      .from('politicas')
      .update({ titulo, contenido })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
module.exports = PoliticasModel;

const supabase = require('../config/db');

const HorarioModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('horario')
      .select('*')
      .order('orden', { ascending: true });
    if (error) throw error;
    return data;
  },
  async update(id, { horas, abierto }) {
    const { data, error } = await supabase
      .from('horario')
      .update({ horas, abierto })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
module.exports = HorarioModel;

const supabase = require('../config/db');

const VideoModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('orden', { ascending: true });
    if (error) throw error;
    return data;
  },
  async create({ titulo, url, orden }) {
    const { data, error } = await supabase
      .from('videos')
      .insert({ titulo, url, orden: orden ?? 0 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async update(id, { titulo, orden }) {
    const { data, error } = await supabase
      .from('videos')
      .update({ titulo, orden })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async delete(id) {
    const { data, error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)
      .select('id, url')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};
module.exports = VideoModel;

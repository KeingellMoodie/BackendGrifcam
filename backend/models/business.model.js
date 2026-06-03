const supabase = require('../config/db');

const BusinessModel = {
  async get() {
    const { data, error } = await supabase
      .from('business_info')
      .select('*')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  async update(id, fields) {
    const { data, error } = await supabase
      .from('business_info')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
module.exports = BusinessModel;
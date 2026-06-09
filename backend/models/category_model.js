// models/category.model.js
const supabase = require('../config/db');

const CategoryModel = {

  async findAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create({ name }) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, { name }) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .select('id')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};

module.exports = CategoryModel;

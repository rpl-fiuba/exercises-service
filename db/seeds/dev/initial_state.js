
exports.seed = async (knex) => {
  await knex('users').del();
  await knex('users').insert([
    {
      user_id: 1, name: 'Diego', email: 'diego@gmail.com', rol: 'professor'
    },
    {
      user_id: 2, name: 'Lucas', email: 'lucas@gmail.com', rol: 'admin'
    },
    {
      user_id: 3, name: 'Mariano', email: 'mariano@gmail.com', rol: 'professor'
    }
  ]);
};

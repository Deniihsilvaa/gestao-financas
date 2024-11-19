import { supabase } from './supabaseClient'; // Importando o cliente Supabase


// Criar Cliente
async function createClient(clientData) {
  const { data, error } = await supabase.from('clients').insert([clientData]);
  if (error) throw error;
  console.log('Cliente criado:', data);
}

// Ler Clientes
async function getClients() {
  const { data, error } = await supabase.from('clients').select('*');
  if (error) throw error;
  console.log('Clientes:', data);
}

// Atualizar Cliente
async function updateClient(clientId, updatedData) {
  const { data, error } = await supabase
    .from('clients')
    .update(updatedData)
    .match({ id: clientId });

  if (error) throw error;
  console.log('Cliente atualizado:', data);
}

// Deletar Cliente
async function deleteClient(clientId) {
  const { data, error } = await supabase
    .from('clients')
    .delete()
    .match({ id: clientId });

  if (error) throw error;
  console.log('Cliente deletado:', data);
}


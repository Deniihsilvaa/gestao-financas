import {supabase} from "../../services/supabaseClient";

export default async function DashboardHome() {
  const response = await supabase.from("viewBaseCaixa").select("*").order("data_transacao", { ascending: false });

  if (response.error) {
    throw response.error;
  }
  if (!response.data) {
    return [];
  }
  const data = response.data.map((item) => ({
    id: item.id,
    type: item.tipo_registro,
    category: item.tipo_categoria,
    paymentMethod: item.payment_type,
    date: item.data_transacao,
    amount: item.valor
  }));

  //agrupar por mês
  const groupedData = data.reduce((acc, item) => {
    const data = new Date(item.date);
    const month = data.getMonth();
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(item);
    return acc;
  }, {} as { [key: number]: typeof data });

//   console.log('Dados groupedData:', groupedData);
  return groupedData;
};

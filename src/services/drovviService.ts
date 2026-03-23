
export const disconnectDrovvi = async (company_id: string, clear_credentials = false) => { const { data, error } = await supabase.functions.invoke("drovvi-disconnect", { body: { company_id, clear_credentials } }); if (error) throw error; return data; };
